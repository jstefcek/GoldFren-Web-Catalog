# Imports
from django.urls import path
from GoldFrenAPI.Views.Kotouc_View import (
    get_kotouce, 
    get_kotouc_by_id, 
    update_kotouc_view, 
    create_kotouc_view
)

# URL patterns
urlpatterns = [
    path("", get_kotouce, name="get_all_kotouce"),
    path("<int:kotouc_id>/", get_kotouc_by_id, name="get_kotouc_by_id"),
    path("update/<int:kotouc_id>/", update_kotouc_view, name="update_kotouc"),
    path("create/", create_kotouc_view, name="create_kotouc"),  
]