# Imports
from django.urls import include, path

# URL patterns
urlpatterns = [
    path("adaptery/", include("GoldFrenAPI.Endpoints.Adaptery_Endpoint")),
    path("brzdice/", include("GoldFrenAPI.Endpoints.Brzdice_Endpoint")),
    path("desticky/", include("GoldFrenAPI.Endpoints.Desticky_Endpoint")),
    path("kotouce/", include("GoldFrenAPI.Endpoints.Kotouce_Endpoint")),
    path("image/", include("GoldFrenAPI.Endpoints.Image_Endpoint")),
    path("hadicky/", include("GoldFrenAPI.Endpoints.Hadicky_Endpoint")),
    path("pumpy/", include("GoldFrenAPI.Endpoints.Pumpy_Endpoint")),
    path("prislusenstvi/", include("GoldFrenAPI.Endpoints.Prislusenstvi_Endpoint")),
    path("vozidla/", include("GoldFrenAPI.Endpoints.Vozidla_Endpoint")),
]
