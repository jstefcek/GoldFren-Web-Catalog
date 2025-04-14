# Imports
from django.urls import path
from GoldFrenAPI.Views.Hadicky_View import (
    get_hadicky,
    get_hadicka_by_id,
    update_hadicka_view,
    create_hadicka_view,
    hadicka_publication_view
)

# URL patterns
urlpatterns = [
    path("", get_hadicky, name="get_hadicky"),
    path("<int:hadicka_id>", get_hadicka_by_id, name="get_hadicka_by_id"),
    path("update/<int:hadicka_id>", update_hadicka_view, name="update_hadicka"),
    path("create/", create_hadicka_view, name="create_hadicka"),  
    path("publication/<int:hadicka_id>", hadicka_publication_view, name="hadicka_publication"),
]