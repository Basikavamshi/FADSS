from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from backend_app.views import (
    RegisterView, LoginView, 
    CropRecommendationView, IrrigationSchedulingView,
    # Chatbot with memory
    ChatSessionListView, ChatSessionDetailView,
    # Live Chat
    LiveChatRoomView, LiveChatSendMessageView,
    # Notifications
    NotificationListView, NotificationDetailView, NotificationBulkActionView,
    # Plant Disease Scanner
    PlantDiseaseScanView, PlantDiseaseScanHistoryView, PlantDiseaseScanDetailView
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Auth
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    
    # Existing features
    path('recommendation/', CropRecommendationView.as_view()),
    path('irrigationScheduling/', IrrigationSchedulingView.as_view()),
    
    # Chatbot with Memory
    path('chat_history/', ChatSessionListView.as_view(), name='chat-history'),
    path('chat_history/<int:session_id>/', ChatSessionDetailView.as_view(), name='chat-detail'),
    path('chatbot/', ChatSessionDetailView.as_view(), name='chatbot'),  # Send message
    
    # Live Chat
    path('livechat/room/', LiveChatRoomView.as_view(), name='livechat-room'),
    path('livechat/send/', LiveChatSendMessageView.as_view(), name='livechat-send'),
    
    # Notifications
    path('notifications/', NotificationListView.as_view(), name='notifications-list'),
    path('notifications/<int:notification_id>/', NotificationDetailView.as_view(), name='notification-detail'),
    path('notifications/bulk-action/', NotificationBulkActionView.as_view(), name='notification-bulk'),
    
    # Plant Disease Scanner
    path('plant-scan/', PlantDiseaseScanView.as_view(), name='plant-scan'),
    path('plant-scan/history/', PlantDiseaseScanHistoryView.as_view(), name='plant-scan-history'),
    path('plant-scan/<int:scan_id>/', PlantDiseaseScanDetailView.as_view(), name='plant-scan-detail'),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)