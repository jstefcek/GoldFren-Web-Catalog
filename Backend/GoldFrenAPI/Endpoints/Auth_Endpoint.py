from django.urls import path
from GoldFrenAPI.Authentication.Auth_View import (
    Login_View,
    AdminTokenVerifyView,
)

urlpatterns = [
    path("", Login_View.as_view(), name='auth_login'),
    path("verify/", AdminTokenVerifyView.as_view(), name='auth_verify'),
]

