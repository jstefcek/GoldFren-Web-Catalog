# Imports
from django.urls import path
from GoldFrenAPI.Views.Sortiment_View import (
    get_sortiment_for_vyrobce_view
)

# URL patterns
urlpatterns = [
    path("", get_sortiment_for_vyrobce_view, name="get_sortiment_for_vyrobce"),
]