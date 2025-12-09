from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Q

from .chatmodel import ChatbotModel
from .plantDiseaseModel import PlantDiseaseModel
from .serializers import (
    RegisterSerializer, LoginSerializer, ChatSessionSerializer,
    ChatSessionDetailSerializer, ChatMessageSerializer,
    LiveChatMessageSerializer, LiveChatRoomSerializer,
    NotificationSerializer, PlantDiseaseSerializer
)
from .models import (
    ChatSession, ChatMessage, LiveChatRoom, LiveChatMessage,
    Notification, PlantDisease
)
from .recommendationModel import RecommendationModel
from .irrigationModel import IrrigationModel
from .tasks import (
    send_welcome_email, 
    send_login_notification,
    send_async_email
)
import json

User = get_user_model()

# ==================== EXISTING VIEWS ====================

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    
    def perform_create(self, serializer):
        user = serializer.save()
        send_welcome_email.delay(user.id)
   
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user_id = serializer.validated_data['user']['id']
        send_login_notification.delay(user_id)
        
        return Response(serializer.validated_data)

class CropRecommendationView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        user_inputs = request.data
        model = RecommendationModel()
        data = model.Predictor(
            N=user_inputs["N"],
            P=user_inputs["P"],
            K=user_inputs["K"],
            PH=user_inputs["PH"],
            address=user_inputs["location"],
            soil_type=user_inputs["soil_type"],
            season=user_inputs['season']
        )
        return JsonResponse({"data": data})

class IrrigationSchedulingView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        user_inputs = request.data
        model = IrrigationModel()
        data = model.Predictor(
            cropType=user_inputs['crop_type'],
            fieldSize=user_inputs['field_size'],
            soilMoistureLevel=user_inputs['soil_moisture_level']
        )
        return JsonResponse({"data": data})


# ==================== NEW CHATBOT VIEWS WITH MEMORY ====================

class ChatSessionListView(APIView):
    """
    GET: List all chat sessions for authenticated user
    POST: Create new chat session
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        sessions = ChatSession.objects.filter(user=request.user)
        serializer = ChatSessionSerializer(sessions, many=True)
        return Response({"sessions": serializer.data})

    def post(self, request):
        session_name = request.data.get('session_name', 'New Chat')
        session = ChatSession.objects.create(
            user=request.user,
            session_name=session_name
        )
        serializer = ChatSessionSerializer(session)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ChatSessionDetailView(APIView):
    """
    GET: Get chat session with all messages
    POST: Send message to specific session
    DELETE: Delete chat session
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        session_id = request.data.get('session_id')
        try:
            session = ChatSession.objects.get(id=session_id, user=request.user)
            serializer = ChatSessionDetailSerializer(session)
            return Response(serializer.data)
        except ChatSession.DoesNotExist:
            return Response(
                {"error": "Session not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    def post(self, request):
        session_id = request.data.get('session_id')
        user_message = request.data.get('message')

        if not user_message:
            return Response(
                {"error": "Message is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            session = ChatSession.objects.get(id=session_id, user=request.user)
            
            # Get conversation history
            previous_messages = ChatMessage.objects.filter(session=session)
            conversation_history = [
                {"question": msg.message, "answer": msg.bot}
                for msg in previous_messages
            ]
            
            # Create chatbot with context
            chatbot = ChatbotModel(conversation_history=conversation_history)
            bot_response = chatbot.chat_with_context(user_message)
            
            # Save message
            chat_message = ChatMessage.objects.create(
                session=session,
                message=user_message,
                bot=bot_response
            )
            
            # Update session timestamp
            session.save()
            
            serializer = ChatMessageSerializer(chat_message)
            return Response({
                "status": "success",
                "message": serializer.data
            })
            
        except ChatSession.DoesNotExist:
            return Response(
                {"error": "Session not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    def delete(self, request, session_id):
        try:
            session = ChatSession.objects.get(id=session_id, user=request.user)
            session.delete()
            return Response({"message": "Session deleted successfully"})
        except ChatSession.DoesNotExist:
            return Response(
                {"error": "Session not found"},
                status=status.HTTP_404_NOT_FOUND
            )


# ==================== LIVE CHAT VIEWS ====================

class LiveChatRoomView(APIView):
    """
    GET: Get or create general chat room with messages
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Get or create general chat room
        room, created = LiveChatRoom.objects.get_or_create(name="General Chat")
        
        # Get latest 50 messages
        messages = LiveChatMessage.objects.filter(room=room).order_by('-timestamp')[:50]
        messages = reversed(list(messages))
        
        serializer = LiveChatMessageSerializer(messages, many=True)
        return Response({
            "room_id": room.id,
            "room_name": room.name,
            "messages": serializer.data
        })


class LiveChatSendMessageView(APIView):
    """
    POST: Send message or file to chat room
    """
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        room_id = request.data.get('room_id', 1)
        message_text = request.data.get('message')
        file = request.FILES.get('file')
        file_type = request.data.get('file_type')

        try:
            room = LiveChatRoom.objects.get(id=room_id)
            
            message = LiveChatMessage.objects.create(
                room=room,
                user=request.user,
                message=message_text,
                file_url=file if file else None,
                file_type=file_type
            )
            
            serializer = LiveChatMessageSerializer(message)
            return Response({
                "status": "success",
                "message": serializer.data
            }, status=status.HTTP_201_CREATED)
            
        except LiveChatRoom.DoesNotExist:
            return Response(
                {"error": "Room not found"},
                status=status.HTTP_404_NOT_FOUND
            )


# ==================== NOTIFICATION VIEWS ====================

class NotificationListView(APIView):
    """
    GET: List all notifications for user
    POST: Create new notification
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        notifications = Notification.objects.filter(user=request.user)
        
        # Filter by read/unread if specified
        filter_type = request.query_params.get('filter', 'all')
        if filter_type == 'unread':
            notifications = notifications.filter(unread=True)
        elif filter_type == 'read':
            notifications = notifications.filter(unread=False)
        
        serializer = NotificationSerializer(notifications, many=True)
        unread_count = Notification.objects.filter(user=request.user, unread=True).count()
        
        return Response({
            "notifications": serializer.data,
            "unread_count": unread_count
        })

    def post(self, request):
        # Create notification (usually done by system, not user)
        serializer = NotificationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class NotificationDetailView(APIView):
    """
    PUT: Mark notification as read/unread
    DELETE: Delete notification
    """
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, notification_id):
        try:
            notification = Notification.objects.get(
                id=notification_id,
                user=request.user
            )
            notification.unread = request.data.get('unread', False)
            notification.save()
            
            serializer = NotificationSerializer(notification)
            return Response(serializer.data)
            
        except Notification.DoesNotExist:
            return Response(
                {"error": "Notification not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    def delete(self, request, notification_id):
        try:
            notification = Notification.objects.get(
                id=notification_id,
                user=request.user
            )
            notification.delete()
            return Response({"message": "Notification deleted successfully"})
            
        except Notification.DoesNotExist:
            return Response(
                {"error": "Notification not found"},
                status=status.HTTP_404_NOT_FOUND
            )


class NotificationBulkActionView(APIView):
    """
    POST: Bulk actions - mark all as read or delete all
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        action = request.data.get('action')  # 'mark_all_read' or 'delete_all'
        
        if action == 'mark_all_read':
            Notification.objects.filter(user=request.user).update(unread=False)
            return Response({"message": "All notifications marked as read"})
        
        elif action == 'delete_all':
            count = Notification.objects.filter(user=request.user).count()
            Notification.objects.filter(user=request.user).delete()
            return Response({"message": f"{count} notifications deleted"})
        
        return Response(
            {"error": "Invalid action"},
            status=status.HTTP_400_BAD_REQUEST
        )


# ==================== PLANT DISEASE SCANNER VIEWS ====================

class PlantDiseaseScanView(APIView):
    """
    POST: Upload plant image for disease detection
    """
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        image = request.FILES.get('image')
        
        if not image:
            return Response(
                {"error": "Image is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create plant disease record
        plant_scan = PlantDisease.objects.create(
            user=request.user,
            image=image
        )

        # Run prediction
        model = PlantDiseaseModel()
        prediction = model.predict_disease(plant_scan.image)

        # Update record with results
        plant_scan.disease_name = prediction['disease_name']
        plant_scan.confidence = prediction['confidence']
        plant_scan.recommendations = prediction['recommendations']
        plant_scan.save()

        serializer = PlantDiseaseSerializer(plant_scan)
        return Response({
            "status": "success",
            "scan": serializer.data
        }, status=status.HTTP_201_CREATED)


class PlantDiseaseScanHistoryView(APIView):
    """
    GET: Get user's scan history
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        scans = PlantDisease.objects.filter(user=request.user)
        serializer = PlantDiseaseSerializer(scans, many=True)
        return Response({"scans": serializer.data})


class PlantDiseaseScanDetailView(APIView):
    """
    GET: Get specific scan details
    DELETE: Delete scan
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, scan_id):
        try:
            scan = PlantDisease.objects.get(id=scan_id, user=request.user)
            serializer = PlantDiseaseSerializer(scan)
            return Response(serializer.data)
        except PlantDisease.DoesNotExist:
            return Response(
                {"error": "Scan not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    def delete(self, request, scan_id):
        try:
            scan = PlantDisease.objects.get(id=scan_id, user=request.user)
            scan.delete()
            return Response({"message": "Scan deleted successfully"})
        except PlantDisease.DoesNotExist:
            return Response(
                {"error": "Scan not found"},
                status=status.HTTP_404_NOT_FOUND
            )