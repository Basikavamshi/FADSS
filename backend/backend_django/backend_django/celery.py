# backend_django/celery.py
import os
from celery import Celery
from celery.schedules import crontab

# Set default Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_django.settings')

app = Celery('backend_django')

# Load config from Django settings with CELERY namespace
app.config_from_object('django.conf:settings', namespace='CELERY')

# Auto-discover tasks in all installed apps
app.autodiscover_tasks()

# Optional: Configure periodic tasks
app.conf.beat_schedule = {
    'send-daily-weather-alerts': {
        'task': 'backend_app.tasks.send_daily_weather_alerts',
        'schedule': crontab(hour=6, minute=0),  # Run daily at 6 AM
    },
    'check-irrigation-schedules': {
        'task': 'backend_app.tasks.check_irrigation_schedules',
        'schedule': crontab(minute='*/30'),  # Run every 30 minutes
    },
}

@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f'Request: {self.request!r}')