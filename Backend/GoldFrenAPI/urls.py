# Imports
from django.urls import path
from GoldFrenAPI.Views.Adapter_View import (
    get_adapters, get_adapter_by_id, update_adapter_view, create_adapter_view
)
from GoldFrenAPI.Views.Brzdice_View import get_brzdice
from GoldFrenAPI.Views.Desticka_View import get_desticky
from GoldFrenAPI.Views.Kotouc_View import get_kotouce

# URL patterns
urlpatterns = [
    path("adapters/", get_adapters, name="get_adapters"),
    path("adapters/<int:adapter_id>/", get_adapter_by_id, name="get_adapter_by_id"),
    path("adapters/update/<int:adapter_id>/", update_adapter_view, name="update_adapter"),
    path("adapters/create/", create_adapter_view, name="create_adapter"),
    path('brzdice/', get_brzdice, name='get_all_brzdice'),
    path('desticky/', get_desticky, name='get_all_desticky'),
    path('kotouce/', get_kotouce, name='get_all_kotouce'),
]