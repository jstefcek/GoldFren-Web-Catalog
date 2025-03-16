# Imports
from django.urls import path
from GoldFrenAPI.Views.Adapter_View import (
    get_adapters, get_adapter_by_id, update_adapter_view, create_adapter_view
)

# URL patterns
urlpatterns = [
    path("", get_adapters, name="get_adapters"),
    path("<int:adapter_id>/", get_adapter_by_id, name="get_adapter_by_id"),
    path("update/<int:adapter_id>/", update_adapter_view, name="update_adapter"),
    path("create/", create_adapter_view, name="create_adapter"),  
]