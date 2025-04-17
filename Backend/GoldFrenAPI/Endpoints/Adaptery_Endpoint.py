# Imports
from django.urls import path
from GoldFrenAPI.Views.Adapter_View import (
    get_adapters, 
    get_adapter_by_id, 
    update_adapter_view, 
    create_adapter_view,
    adapter_publication_view,
    get_filtered_adapters_view,
    get_vozidla_for_adapter_view
)

# URL patterns
urlpatterns = [
    path("", get_adapters, name="get_adapters"),
    path("<int:adapter_id>", get_adapter_by_id, name="get_adapter_by_id"),
    path("update/<int:adapter_id>", update_adapter_view, name="update_adapter"),
    path("create", create_adapter_view, name="create_adapter"),  
    path("publication/<int:adapter_id>", adapter_publication_view, name="adapter_publication"),
    path("filter", get_filtered_adapters_view, name="get_filtered_adapters_view"),
    path("vozidla", get_vozidla_for_adapter_view, name="get_vozidla_for_adapter_view"),
]