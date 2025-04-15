# Imports
from django.urls import path
from GoldFrenAPI.Views.Vozidla_View import (
    get_vyrobce_names,
    get_vozidlo_filtered_view
)

# URL patterns
urlpatterns = [
    path("vyrobce", get_vyrobce_names, name="get_vyrobce_names"),
    path("filter", get_vozidlo_filtered_view, name="get_vozidlo_filtered_view"),
]