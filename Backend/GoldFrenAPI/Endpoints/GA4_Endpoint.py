# Imports
from django.urls import path
from GoldFrenAPI.Views.GA4_View import (
    get_home_page_metrics_view,
    get_top_searched_manufacturers_view,
    get_sessions_manual_source_view,
    get_language_sessions_view,
    get_top_view_pages_view
)

# URL patterns
urlpatterns = [
    path("homepage", get_home_page_metrics_view, name="get_home_page_metrics_view"),
    path("homepage/manufacturers", get_top_searched_manufacturers_view, name="get_top_searched_manufacturers_view"),
    path("stats/sessions", get_sessions_manual_source_view, name="get_sessions_manual_source_view"),
    path("stats/languages", get_language_sessions_view, name="get_language_sessions_view"),
    path("stats/pages", get_top_view_pages_view, name="get_top_view_pages_view"),
]