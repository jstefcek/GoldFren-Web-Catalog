# Imports
from django.urls import include, path

# URL patterns
urlpatterns = [
    path("adapters/", include("GoldFrenAPI.Endpoints.Adapters_Endpoint")),
    path("brzdice/", include("GoldFrenAPI.Endpoints.Brzdice_Endpoint")),
    path("desticky/", include("GoldFrenAPI.Endpoints.Desticky_Endpoint")),
    path("kotouce/", include("GoldFrenAPI.Endpoints.Kotouce_Endpoint")),
]