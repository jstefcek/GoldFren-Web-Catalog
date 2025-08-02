# Imports
from django.urls import path
from GoldFrenAPI.Views.Vozidla_View import (
    get_vyrobce_names,
    get_vozidlo_filtered_view,
    get_vozidlo_sortiment_view,
    get_vozidlo_by_category_view,
    update_vozidlo_view
)

# URL patterns
urlpatterns = [
    path("vyrobce", get_vyrobce_names, name="get_vyrobce_names"),
    path("filter", get_vozidlo_filtered_view, name="get_vozidlo_filtered_view"),
    path("sortiment", get_vozidlo_sortiment_view, name="get_vozidlo_sortiment_view"),
    path("kategorie", get_vozidlo_by_category_view, name="get_vozidlo_by_category_view"),
    path("update/<int:vozidlo_id>", update_vozidlo_view, name="update_vozidlo_view"),
]