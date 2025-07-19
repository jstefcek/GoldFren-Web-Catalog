from django.urls import path
from GoldFrenAPI.Authentication.Auth_View import get_users
from GoldFrenAPI.Authentication.Auth_View import (
    Register_User,
    change_user_password
)

urlpatterns = [
    path("", get_users, name='get_users_list'),
    path('register/', Register_User, name='register_user'),
    path('change_password/', change_user_password, name='change_user_password'),
]