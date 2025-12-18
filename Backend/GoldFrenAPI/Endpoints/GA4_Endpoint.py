# Imports
from django.urls import path
from GoldFrenAPI.Views.GA4_View import (
    get_home_page_metrics_view,
    get_top_searched_manufacturers_view
)

# URL patterns
urlpatterns = [
    path("homepage", get_home_page_metrics_view, name="get_home_page_metrics_view"),
    path("homepage/manufacturers", get_top_searched_manufacturers_view, name="get_top_searched_manufacturers_view"),
]