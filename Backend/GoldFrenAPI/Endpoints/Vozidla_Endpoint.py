# Imports
from django.urls import path
from GoldFrenAPI.Views.Vozidla_View import (
    get_vyrobce_names,
    get_vozidlo_filtered_view,
    get_vozidlo_sortiment_view,
    get_vozidlo_by_category_view,
    update_vozidlo_view,
    create_vozidlo_view,
    update_vyrobce_view,
    create_vyrobce_view,
    update_vozidlo_sortiment_view
)

# URL patterns
urlpatterns = [
    path("vyrobce", get_vyrobce_names, name="get_vyrobce_names"),
    path("filter", get_vozidlo_filtered_view, name="get_vozidlo_filtered_view"),
    path("sortiment", get_vozidlo_sortiment_view, name="get_vozidlo_sortiment_view"),
    path("kategorie", get_vozidlo_by_category_view, name="get_vozidlo_by_category_view"),
    path("update/<int:vozidlo_id>", update_vozidlo_view, name="update_vozidlo_view"),
    path("create", create_vozidlo_view, name="create_vozidlo_view"),
    path("vyrobce/update/<int:vyrobce_kod>", update_vyrobce_view, name="update_vyrobce_view"),
    path("vyrobce/create", create_vyrobce_view, name="create_vyrobce_view"),
    path("sortiment/update/<int:vozidlo_id>", update_vozidlo_sortiment_view, name="update_vozidlo_sortiment_view"),
]