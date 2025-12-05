from django.contrib import admin
from .models import User
from django.contrib.auth.admin import UserAdmin
# Register your models here.



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
