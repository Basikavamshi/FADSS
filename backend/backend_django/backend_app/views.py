from django.shortcuts import render
from rest_framework import generics, permissions
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from .chatmodel import ChatbotModel
from .serializers import RegisterSerializer, LoginSerializer
from rest_framework.response import Response
from django.http import JsonResponse
from .recommendationModel import RecommendationModel
from .irrigationModel import IrrigationModel
from .tasks import (
    send_welcome_email, 
    send_login_notification,
    process_crop_recommendation,
    process_irrigation_scheduling
)
import json

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    
    def perform_create(self, serializer):
        user = serializer.save()
        # Send welcome email asynchronously
        send_welcome_email.delay(user.id)
   
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Send login notification asynchronously
        user_id = serializer.validated_data['user']['id']
        send_login_notification.delay(user_id)
        
        return Response(serializer.validated_data)


class ChatModelView(APIView):
    permission_classes=[permissions.AllowAny]
    def post(self, request):
        user_message = request.data.get("message")
        chatbot = ChatbotModel()
        chatbot.add_message(user_message)
        response = chatbot.get_messages()
        return JsonResponse({"status": "success", "messages": response[0]})
    
class CropRecommendationView(APIView):
    permission_classes=[permissions.AllowAny]
    
    def post(self, request):
        user_inputs = request.data
        
        # Option 1: Process synchronously (immediate response)
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
        
        # Option 2: Process asynchronously (for heavy tasks)
        # task = process_crop_recommendation.delay(
        #     user_id=request.user.id if request.user.is_authenticated else None,
        #     N=user_inputs["N"],
        #     P=user_inputs["P"],
        #     K=user_inputs["K"],
        #     PH=user_inputs["PH"],
        #     address=user_inputs["location"],
        #     soil_type=user_inputs["soil_type"],
        #     season=user_inputs['season']
        # )
        # return JsonResponse({"task_id": task.id, "status": "processing"})
        
        return JsonResponse({"data": data})

class IrrigationSchedulingView(APIView):
    permission_classes=[permissions.AllowAny]
    
    def post(self, request):
        user_inputs = request.data
        
        # Process synchronously
        model = IrrigationModel()
        data = model.Predictor(
            cropType=user_inputs['crop_type'],
            fieldSize=user_inputs['field_size'],
            soilMoistureLevel=user_inputs['soil_moisture_level']
        )
        
        return JsonResponse({"data": data})