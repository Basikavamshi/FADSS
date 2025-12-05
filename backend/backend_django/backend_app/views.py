from django.shortcuts import render
from rest_framework import generics, permissions

from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from .chatmodel import ChatbotModel

from .serializers import RegisterSerializer, LoginSerializer
from rest_framework.response import Response
from django.http import JsonResponse
from .recommendationModel import RecommendationModel
import json
# Create your views here.

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
   
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data)


class ChatModelView(APIView):
    permission_classes=[permissions.AllowAny]
    def post(self, request):
        user_message = request.data.get("message")
        print(user_message)
        chatbot = ChatbotModel()
        chatbot.add_message(user_message)
        print(chatbot)
        response=chatbot.get_messages()
        print(response)
        return JsonResponse({"status": "success", "messages": response[0]})
    
class CropRecommendationView(APIView):
    permission_classes=[permissions.AllowAny]
    def post(self,request):
        model=RecommendationModel()
        user_inputs=request.data 
        data=model.Predictor(N=user_inputs["N"],P=user_inputs["P"],K=user_inputs["K"],PH=user_inputs["PH"],address=user_inputs["location"],soil_type=user_inputs["soil_type"],season=user_inputs['season'])
    
        return JsonResponse({"data":data})
