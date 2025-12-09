# backend_app/tasks.py
from celery import shared_task
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
import time

User = get_user_model()

@shared_task(bind=True, max_retries=3)
def send_async_email(self, subject, message, recipient_list):
    """
    Send email asynchronously
    """
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=None,
            recipient_list=recipient_list,
            fail_silently=False,
        )
        return f"Email sent successfully to {recipient_list}"
    except Exception as exc:
        # Retry after 60 seconds if failed
        raise self.retry(exc=exc, countdown=60)

@shared_task
def send_welcome_email(user_id):
    """
    Send welcome email after user registration
    """
    try:
        user = User.objects.get(id=user_id)
        send_mail(
            subject='Welcome to FADSS!',
            message=f"Hi {user.first_name}, your account has been created successfully!",
            from_email=None,
            recipient_list=[user.email],
            fail_silently=False,
        )
        return f"Welcome email sent to {user.email}"
    except User.DoesNotExist:
        return f"User with id {user_id} not found"

@shared_task
def send_login_notification(user_id):
    """
    Send login notification
    """
    try:
        user = User.objects.get(id=user_id)
        send_mail(
            subject='Login Notification - FADSS',
            message=f"Hi {user.first_name}, you just logged in to your account.",
            from_email=None,
            recipient_list=[user.email],
            fail_silently=False,
        )
        return f"Login notification sent to {user.email}"
    except User.DoesNotExist:
        return f"User with id {user_id} not found"

@shared_task
def process_crop_recommendation(user_id, N, P, K, PH, address, soil_type, season):
    """
    Process crop recommendation in background
    """
    from .recommendationModel import RecommendationModel
    
    model = RecommendationModel()
    result = model.Predictor(
        N=N, P=P, K=K, PH=PH, 
        address=address, 
        soil_type=soil_type, 
        season=season
    )
    
    # You can store result in database or send notification
    return result

@shared_task
def process_irrigation_scheduling(user_id, crop_type, field_size, soil_moisture_level):
    """
    Process irrigation scheduling in background
    """
    from .irrigationModel import IrrigationModel
    
    model = IrrigationModel()
    result = model.Predictor(
        cropType=crop_type,
        fieldSize=field_size,
        soilMoistureLevel=soil_moisture_level
    )
    
    return result

@shared_task
def send_daily_weather_alerts():
    """
    Send daily weather alerts to all users
    Scheduled task that runs daily at 6 AM
    """
    users = User.objects.filter(email__isnull=False)
    count = 0
    
    for user in users:
        send_mail(
            subject='Daily Weather Alert - FADSS',
            message=f"Hi {user.first_name}, here's your daily weather forecast...",
            from_email=None,
            recipient_list=[user.email],
            fail_silently=True,
        )
        count += 1
    
    return f"Weather alerts sent to {count} users"

@shared_task
def check_irrigation_schedules():
    """
    Check and send irrigation reminders
    Scheduled task that runs every 30 minutes
    """
    # Add your logic to check irrigation schedules
    # and send reminders to users
    return "Irrigation schedules checked"

@shared_task
def cleanup_old_data():
    """
    Cleanup old data periodically
    """
    # Add cleanup logic here
    return "Old data cleaned up"