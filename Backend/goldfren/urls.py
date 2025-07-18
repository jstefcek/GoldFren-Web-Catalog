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
    path('api/auth/token/', Login_View.as_view(), name='token_obtain_pair'),
    path('api/goldfren/auth/register/', Register_User, name='Register_User'),
    path('api/goldfren/auth/change_password/', change_user_password, name='Change_User_Password'),
]
