# Imports
from django.urls import path
from GoldFrenAPI.Views.Prislusenstvi_View import (
    get_prislusenstvi,
    get_prislusenstvi_by_id,
    update_prislusenstvi_view,
    create_prislusenstvi_view,
    prislusenstvi_publication_view
)

# URL patterns
urlpatterns = [
    path("", get_prislusenstvi, name="get_prislusenstvi"),
    path("<int:prislusenstvi_id>", get_prislusenstvi_by_id, name="get_prislusenstvi_by_id"),
    path("update/<int:prislusenstvi_id>", update_prislusenstvi_view, name="update_prislusenstvi"),
    path("create", create_prislusenstvi_view, name="create_prislusenstvi"),  
    path("publication/<int:prislusenstvi_id>", prislusenstvi_publication_view, name="prislusenstvi_publication"),
]