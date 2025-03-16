# Imports
from django.urls import path
from GoldFrenAPI.Views.Desticka_View import (
    get_desticky
)

# URL patterns
urlpatterns = [
    path("", get_desticky, name="get_all_desticky"),
]