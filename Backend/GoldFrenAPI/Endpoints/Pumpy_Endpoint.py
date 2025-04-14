# Imports
from django.urls import path
from GoldFrenAPI.Views.Pumpy_View import (
    get_pumpy,
    get_pumpa_by_id,
    update_pumpa_view,
    create_pumpa_view,
    pumpa_publication_view
)

# URL patterns
urlpatterns = [
    path("", get_pumpy, name="get_pumpy"),
    path("<int:pumpa_id>", get_pumpa_by_id, name="get_pumpa_by_id"),
    path("update/<int:pumpa_id>", update_pumpa_view, name="update_pumpa"),
    path("create/", create_pumpa_view, name="create_pumpa"),  
    path("publication/<int:pumpa_id>", pumpa_publication_view, name="pumpa_publication"),
]