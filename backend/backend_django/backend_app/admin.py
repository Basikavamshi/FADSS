from django.contrib import admin
from .models import (
    User, ChatSession, ChatMessage, LiveChatRoom, 
    LiveChatMessage, Notification, PlantDisease
)
from django.contrib.auth.admin import UserAdmin

class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ('id', 'username', 'email', 'phone', 'first_name', 'last_name', 'is_staff')
    
    fieldsets = UserAdmin.fieldsets + (
        ('Extra Info', {'fields': ('phone', 'address')}),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Extra Info', {'fields': ('phone', 'address')}),
    )

admin.site.register(User, CustomUserAdmin)

@admin.register(ChatSession)
class ChatSessionAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'session_name', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'session_name']

@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ['id', 'session', 'message', 'timestamp']
    list_filter = ['timestamp']

@admin.register(LiveChatRoom)
class LiveChatRoomAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'created_at']

@admin.register(LiveChatMessage)
class LiveChatMessageAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'room', 'message', 'timestamp']
    list_filter = ['timestamp', 'room']

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'title', 'category', 'priority', 'unread', 'created_at']
    list_filter = ['category', 'priority', 'unread', 'created_at']
    search_fields = ['user__username', 'title', 'message']

@admin.register(PlantDisease)
class PlantDiseaseAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'disease_name', 'confidence', 'created_at']
list_filter = ['created_at', 'disease_name']
search_fields = ['user__username', 'disease_name']