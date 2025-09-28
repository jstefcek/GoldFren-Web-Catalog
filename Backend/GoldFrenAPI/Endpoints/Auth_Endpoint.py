from django.urls import path
from GoldFrenAPI.Authentication.Auth_View import (
    Login_View
)

urlpatterns = [
    path("", Login_View.as_view(), name='auth_login'),
]