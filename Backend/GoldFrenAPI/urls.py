# Imports
from django.urls import path
from GoldFrenAPI.Views.Adapter_View import get_adapters
from GoldFrenAPI.Views.Brzdice_View import get_brzdice

# URL patterns
urlpatterns = [
    path('adapters/', get_adapters, name='get_all_adapters'),
    path('brzdice/', get_brzdice, name='get_all_brzdice'),
]