from backend_app.views import TaskStatusView

urlpatterns = [
    # ... existing patterns
    path('task-status/<str:task_id>/', TaskStatusView.as_view(), name='task-status'),
]