# Imports
from django.urls import path
from GoldFrenAPI.Views.Desticka_View import (
    get_desticky,
    get_desticka_by_id
)

# URL patterns
urlpatterns = [
    path("", get_desticky, name="get_all_desticky"),
    path("<int:desticka_id>/", get_desticka_by_id, name="get_desticka_by_id"),
]