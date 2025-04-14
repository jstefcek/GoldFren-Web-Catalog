# Imports
from django.urls import path
from GoldFrenAPI.Views.Desticka_View import (
    get_desticky,
    get_desticka_by_id,
    update_desticka_view,
    create_desticka_view,
    desticka_publication_view,
)

# URL patterns
urlpatterns = [
    path("", get_desticky, name="get_all_desticky"),
    path("<int:desticka_id>", get_desticka_by_id, name="get_desticka_by_id"),
    path("update/<int:desticka_id>", update_desticka_view, name="update_desticka"),
    path("create", create_desticka_view, name="create_desticka"),
    path("publication/<int:desticka_id>", desticka_publication_view, name="desticka_publication"),
]