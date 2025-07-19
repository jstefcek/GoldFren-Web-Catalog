"""
URL configuration for GoldFren project.
"""
from django.contrib import admin
from django.urls import include, path
from GoldFrenAPI.Authentication.Auth_View import (
    Login_View, 
    Register_User,
    change_user_password
)

urlpatterns = [
    path('django-admin/', admin.site.urls),
    path('api/goldfren/internal/', include('GoldFrenAPI.urls')),
]
