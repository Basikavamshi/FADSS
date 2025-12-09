from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class User(AbstractUser):
    email = models.EmailField(unique=True, null=True, blank=True)
    phone = models.CharField(max_length=15, unique=True, null=True, blank=True)
    address = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.username or self.email or self.phone or str(self.id)


class ChatSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_sessions')
    session_name = models.CharField(max_length=255, default="New Chat")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.user.username} - {self.session_name}"


class ChatMessage(models.Model):
    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name='messages')
    message = models.TextField()  # User message
    bot = models.TextField()  # Bot response
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"Message in {self.session.session_name}"


class LiveChatRoom(models.Model):
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class LiveChatMessage(models.Model):
    room = models.ForeignKey(LiveChatRoom, on_delete=models.CASCADE, related_name='messages')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField(blank=True, null=True)
    file_url = models.FileField(upload_to='chat_files/', blank=True, null=True)
    file_type = models.CharField(max_length=50, blank=True, null=True)  # audio, image, video, pdf
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"{self.user.username}: {self.message[:50]}"


class Notification(models.Model):
    CATEGORY_CHOICES = [
        ('weather', 'Weather'),
        ('pest', 'Pest'),
        ('irrigation', 'Irrigation'),
        ('fertilizer', 'Fertilizer'),
        ('crop', 'Crop'),
        ('market', 'Market'),
        ('chatbot', 'Chatbot'),
        ('system', 'System'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255)
    message = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='system')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    unread = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.user.username}"


class PlantDisease(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='plant_scans')
    image = models.ImageField(upload_to='plant_images/')
    disease_name = models.CharField(max_length=255, blank=True, null=True)
    confidence = models.FloatField(blank=True, null=True)
    recommendations = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.disease_name or 'Unknown'}"