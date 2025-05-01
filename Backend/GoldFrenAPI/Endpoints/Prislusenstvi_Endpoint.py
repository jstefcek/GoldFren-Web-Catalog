# Imports
from django.urls import path
from GoldFrenAPI.Views.Prislusenstvi_View import (
    get_prislusenstvi,
    get_prislusenstvi_by_id,
    update_prislusenstvi_view,
    create_prislusenstvi_view,
    prislusenstvi_publication_view,
    get_vozidla_for_prislusenstvi_view,
    get_filtered_prislusenstvi_view
)

# URL patterns
urlpatterns = [
    path("", get_prislusenstvi, name="get_prislusenstvi"),
    path("<int:prislusenstvi_id>", get_prislusenstvi_by_id, name="get_prislusenstvi_by_id"),
    path("update/<int:prislusenstvi_id>", update_prislusenstvi_view, name="update_prislusenstvi"),
    path("create", create_prislusenstvi_view, name="create_prislusenstvi"),  
    path("publication/<int:prislusenstvi_id>", prislusenstvi_publication_view, name="prislusenstvi_publication"),
    path("filter", get_filtered_prislusenstvi_view, name="get_filtered_prislusenstvi_view"),
    path("vozidla", get_vozidla_for_prislusenstvi_view, name="get_vozidla_for_prislusenstvi_view"),
]