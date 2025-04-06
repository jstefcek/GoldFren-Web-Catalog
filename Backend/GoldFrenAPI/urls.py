# Imports
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static

# URL patterns
urlpatterns = [
    path("adapters/", include("GoldFrenAPI.Endpoints.Adapters_Endpoint")),
    path("brzdice/", include("GoldFrenAPI.Endpoints.Brzdice_Endpoint")),
    path("desticky/", include("GoldFrenAPI.Endpoints.Desticky_Endpoint")),
    path("kotouce/", include("GoldFrenAPI.Endpoints.Kotouce_Endpoint")),
    path("image/", include("GoldFrenAPI.Endpoints.Image_Endpoint")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)