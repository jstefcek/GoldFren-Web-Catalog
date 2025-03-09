# Imports
from django.urls import path
from GoldFrenAPI.Views.Adapter_View import get_adapters

# URL patterns
urlpatterns = [
    path('adapters/', get_adapters, name='get_all_adapters'),
]