# accounts/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Q
import uuid
from django.core.mail import send_mail
User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
   
    class Meta:
        model = User
        fields = [
            'id',
            'first_name',
            'last_name',
            'email',
            'phone',
            'address',
            'password',
        ]

    def validate(self, attrs):
        email = attrs.get('email')
        phone = attrs.get('phone')
        print(email)
        # at least one (email or phone) must be given
        if not email and not phone:
            raise serializers.ValidationError(
                "You must provide at least email or phone number."
            )
        return attrs

    def create(self, validated_data):
     
        password = validated_data.pop('password')
        print(validated_data)
        validated_data['username'] = validated_data['first_name']+validated_data['last_name']
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        
        send_mail(
        subject='Welcome to FADSS!',
        message=f"Hi {user.first_name}, your account has been created successfully!",
        from_email=None,
        recipient_list=[user.email],
        fail_silently=False,)
        return user

class LoginSerializer(serializers.Serializer):
    identifier = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        identifier = attrs.get("identifier")
        password = attrs.get("password")

        try:
            user = User.objects.get(
                Q(email=identifier) | Q(phone=identifier)
            )
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid credentials")

        if not user.check_password(password):
            raise serializers.ValidationError("Invalid credentials")

        refresh = RefreshToken.for_user(user)
        send_mail(
        subject='Login Notification - FADSS',
        message=f"Hi {user.first_name}, you just logged in to your account.",
        from_email=None,
        recipient_list=[user.email],
        fail_silently=False,
        )
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": user.id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "phone": user.phone,
                "address": user.address,
            }
        }
