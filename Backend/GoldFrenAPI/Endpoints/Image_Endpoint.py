# Imports
from django.urls import path
from GoldFrenAPI.Views.Image_View import ImageUploadView

# URL patterns
urlpatterns = [
    path("", ImageUploadView.as_view(), name="upload_image"),
]