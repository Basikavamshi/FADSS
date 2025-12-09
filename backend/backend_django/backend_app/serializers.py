from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Q

from .models import (
    ChatSession, ChatMessage, LiveChatMessage,
    LiveChatRoom, Notification, PlantDisease
)

# ---------------------------------------------------
# Registration Serializer
# ---------------------------------------------------
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'phone', 'address', 'password']

    def create(self, validated_data):
        # Extract password
        password = validated_data.pop('password')

        # Auto-generate username
        validated_data['username'] = validated_data['first_name'] + validated_data['last_name']

        # Create user
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


# ---------------------------------------------------
# Login Serializer
# ---------------------------------------------------
class LoginSerializer(serializers.Serializer):
    identifier = serializers.CharField()  # email or phone
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        identifier = attrs.get("identifier")
        password = attrs.get("password")

        try:
            user = User.objects.get(Q(email=identifier) | Q(phone=identifier))
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid credentials")

        if not user.check_password(password):
            raise serializers.ValidationError("Invalid credentials")

        refresh = RefreshToken.for_user(user)

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "auth": True,
            "user": {
                "id": user.id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "phone": user.phone,
                "address": user.address,
            }
        }


# ---------------------------------------------------
# Chat Serializers
# ---------------------------------------------------
class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'message', 'bot', 'timestamp']


class ChatSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatSession
        fields = ['id', 'session_name', 'created_at', 'updated_at']


class ChatSessionDetailSerializer(serializers.ModelSerializer):
    chats = ChatMessageSerializer(source='messages', many=True, read_only=True)

    class Meta:
        model = ChatSession
        fields = ['id', 'session_name', 'created_at', 'updated_at', 'chats']


# ---------------------------------------------------
# Live Chat Serializers
# ---------------------------------------------------
class LiveChatMessageSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = LiveChatMessage
        fields = ['id', 'username', 'message', 'file_url', 'file_type', 'timestamp']


class LiveChatRoomSerializer(serializers.ModelSerializer):
    messages = LiveChatMessageSerializer(many=True, read_only=True)

    class Meta:
        model = LiveChatRoom
        fields = ['id', 'name', 'created_at', 'messages']


# ---------------------------------------------------
# Notification Serializer
# ---------------------------------------------------
class NotificationSerializer(serializers.ModelSerializer):
    time = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'category', 'priority', 'unread', 'time', 'created_at']

    def get_time(self, obj):
        from django.utils.timesince import timesince
        return f"{timesince(obj.created_at)} ago"


# ---------------------------------------------------
# Plant Disease Serializer
# ---------------------------------------------------
class PlantDiseaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlantDisease
        fields = ['id', 'image', 'disease_name', 'confidence', 'recommendations', 'created_at']
        read_only_fields = ['disease_name', 'confidence', 'recommendations']
