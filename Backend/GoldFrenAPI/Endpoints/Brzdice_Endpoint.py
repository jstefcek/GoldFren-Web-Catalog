# Imports
from django.urls import path
from GoldFrenAPI.Views.Brzdice_View import (
    get_brzdice, 
    get_brzdic_by_id, 
    update_brzdic_view, 
    create_brzdic_view,
    brzdic_publication_view,
    get_filtered_brzdice_view,
    get_vozidla_for_brzdic_view
)

# URL patterns
urlpatterns = [
    path("", get_brzdice, name="get_all_brzdice"),
    path("<int:brzdic_id>", get_brzdic_by_id, name="get_brzdic_by_id"),
    path("update/<int:brzdic_id>", update_brzdic_view, name="update_brzdic"),
    path("create", create_brzdic_view, name="create_brzdic"),
    path("publication/<int:brzdic_id>", brzdic_publication_view, name="brzdic_publication"),
    path("filter", get_filtered_brzdice_view, name="get_filtered_brzdice_view"),
    path("vozidla", get_vozidla_for_brzdic_view, name="get_vozidla_for_brzdic_view"),
]