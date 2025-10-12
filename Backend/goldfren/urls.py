"""
URL configuration for GoldFren project.
"""
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/goldfren/internal/', include('GoldFrenAPI.urls')),
]
