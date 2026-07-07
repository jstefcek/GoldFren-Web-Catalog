import logging
import os
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from django.core.cache import cache
from rest_framework.permissions import IsAuthenticated
from GoldFrenAPI.Authentication.Auth_Permissions import IsInternalUser
from GoldFrenAPI.Services.GA4_Service import (
    get_home_page_metrics,
    get_top_searched_manufacturers,
    get_sessions_manual_source,
    get_language_sessions,
    get_top_view_pages,
    get_web_stats_summary,
    get_traffic_over_time,
    get_engagment_quality,
    get_device_engagment
)

logger = logging.getLogger(__name__)

# Cache timeout settings for home page
CACHE_TIMEOUT_HOME = int(os.getenv("GA4_CACHE_TIMEOUT", 3600)) # 1 hour
CACHE_TIMEOUT_METRICS = int(os.getenv("GA4_CACHE_TIMEOUT_METRICS", 300)) # 5 minutes
MAX_GA4_DAYS = int(os.getenv("GA4_MAX_DAYS", 365))
MAX_GA4_LIMIT = int(os.getenv("GA4_MAX_LIMIT", 100))


def _bounded_int(request, name, default, minimum, maximum):
    raw_value = request.GET.get(name, default)
    try:
        value = int(raw_value)
    except (TypeError, ValueError):
        raise ValueError(f"{name} must be an integer")

    if value < minimum or value > maximum:
        raise ValueError(f"{name} must be between {minimum} and {maximum}")

    return value


def _analytics_error(message):
    logger.exception(message)
    return JsonResponse({"error": "Failed to fetch analytics data"}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsInternalUser])
def get_home_page_metrics_view(request):
    try:
        # Try to get cached metrics
        cache_key = "home_page_metrics"
        cached_metrics = cache.get(cache_key)

        # If cached metrics exist, return them
        if cached_metrics is not None:
            return JsonResponse(cached_metrics, safe=False)

        # If not cached, fetch fresh metrics
        metrics = get_home_page_metrics()

        # Cache the results
        cache.set(cache_key, metrics, CACHE_TIMEOUT_HOME)

        # Return the fresh metrics
        return JsonResponse(metrics, safe=False)
    
    except Exception:
        return _analytics_error("Error fetching home page metrics")
    
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsInternalUser])
def get_top_searched_manufacturers_view(request):
    try:
        # Try to get cached manufacturers
        cache_key = "top_searched_manufacturers"
        cached_manufacturers = cache.get(cache_key)

        # If cached manufacturers exist, return them
        if cached_manufacturers is not None:
            return JsonResponse(cached_manufacturers, safe=False)

        # If not cached, fetch fresh manufacturers
        manufacturers = get_top_searched_manufacturers()

        # Cache the results
        cache.set(cache_key, manufacturers, CACHE_TIMEOUT_HOME)

        # Return the fresh manufacturers
        return JsonResponse(manufacturers, safe=False)
    
    except Exception:
        return _analytics_error("Error fetching top searched manufacturers")
    
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsInternalUser])
def get_sessions_manual_source_view(request):
    try:
        # Try to get days from request parameters
        days = _bounded_int(request, 'days', 30, 1, MAX_GA4_DAYS)
        
        # Try to get cached manual sources
        cache_key = f"sessions_manual_source_days_{days}"
        cached_sources = cache.get(cache_key)

        # If cached sources exist, return them
        if cached_sources is not None:
            return JsonResponse(cached_sources, safe=False)

        # If not cached, fetch fresh sources
        sources = get_sessions_manual_source(days=days)

        # Cache the results
        cache.set(cache_key, sources, CACHE_TIMEOUT_METRICS)

        # Return the fresh sources
        return JsonResponse(sources, safe=False)
    
    except ValueError as ex:
        return JsonResponse({"error": str(ex)}, status=400)
    except Exception:
        return _analytics_error("Error fetching sessions by manual source")
    
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsInternalUser])
def get_language_sessions_view(request):
    try:
        # Try to get limit and days from request parameters
        limit = _bounded_int(request, 'limit', 10, 1, MAX_GA4_LIMIT)
        days = _bounded_int(request, 'days', 30, 1, MAX_GA4_DAYS)
        
        # Try to get cached language sessions
        cache_key = f"language_sessions_limit_{limit}_days_{days}"
        cached_languages = cache.get(cache_key)

        # If cached languages exist, return them
        if cached_languages is not None:
            return JsonResponse(cached_languages, safe=False)

        # If not cached, fetch fresh language sessions
        languages = get_language_sessions(limit=limit, days=days)

        # Cache the results
        cache.set(cache_key, languages, CACHE_TIMEOUT_METRICS)

        # Return the fresh language sessions
        return JsonResponse(languages, safe=False)
    
    except ValueError as ex:
        return JsonResponse({"error": str(ex)}, status=400)
    except Exception:
        return _analytics_error("Error fetching sessions by language")
    
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsInternalUser])
def get_top_view_pages_view(request):
    try:
        # Try to get limit and days from request parameters
        limit = _bounded_int(request, 'limit', 10, 1, MAX_GA4_LIMIT)
        days = _bounded_int(request, 'days', 30, 1, MAX_GA4_DAYS)
        
        # Try to get cached top viewed pages
        cache_key = f"top_view_pages_limit_{limit}_days_{days}"
        cached_languages = cache.get(cache_key)

        # If cached top viewed pages exist, return them
        if cached_languages is not None:
            return JsonResponse(cached_languages, safe=False)

        # If not cached, fetch fresh top viewed pages
        languages = get_top_view_pages(limit=limit, days=days)

        # Cache the results
        cache.set(cache_key, languages, CACHE_TIMEOUT_METRICS)

        # Return the fresh top viewed pages
        return JsonResponse(languages, safe=False)
    
    except ValueError as ex:
        return JsonResponse({"error": str(ex)}, status=400)
    except Exception:
        return _analytics_error("Error fetching top view pages")
    
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsInternalUser])
def get_web_stats_summary_view(request):
    try:
        # Try to get days and limit from request parameters
        days = _bounded_int(request, 'days', 30, 1, MAX_GA4_DAYS)
        
        # Try to get cached web stats summary
        cache_key = f"web_stats_summary_days_{days}"
        cached_summary = cache.get(cache_key)

        # If cached summary exists, return it
        if cached_summary is not None:
            return JsonResponse(cached_summary, safe=False)

        # If not cached, fetch fresh web stats summary
        summary = get_web_stats_summary(days=days)

        # Cache the results
        cache.set(cache_key, summary, CACHE_TIMEOUT_METRICS)

        # Return the fresh web stats summary
        return JsonResponse(summary, safe=False)
    
    except ValueError as ex:
        return JsonResponse({"error": str(ex)}, status=400)
    except Exception:
        return _analytics_error("Error fetching web stats summary")
    
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsInternalUser])
def get_traffic_over_time_view(request):
    try:
        # Try to get days and limit from request parameters
        days = _bounded_int(request, 'days', 30, 1, MAX_GA4_DAYS)

        # Try to get cached traffic over time data
        cache_key = f"traffic_over_time_days_{days}"
        cached_summary = cache.get(cache_key)

        # If cached summary exists, return it
        if cached_summary is not None:
            return JsonResponse(cached_summary, safe=False)

        # If not cached, fetch fresh traffic over time data
        summary = get_traffic_over_time(days=days)

        # Cache the results
        cache.set(cache_key, summary, CACHE_TIMEOUT_METRICS)

        # Return the fresh traffic over time data
        return JsonResponse(summary, safe=False)
    
    except ValueError as ex:
        return JsonResponse({"error": str(ex)}, status=400)
    except Exception:
        return _analytics_error("Error fetching traffic over time data")
    
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsInternalUser])
def get_engagment_quality_view(request):
    try:
        # Try to get days from request parameters
        days = _bounded_int(request, 'days', 30, 1, MAX_GA4_DAYS)
        
        # Try to get cached engagement quality data
        cache_key = f"engagment_quality_days_{days}"
        cached_data = cache.get(cache_key)

        # If cached data exists, return it
        if cached_data is not None:
            return JsonResponse(cached_data, safe=False)

        # If not cached, fetch fresh engagement quality data
        data = get_engagment_quality(days=days)

        # Cache the results
        cache.set(cache_key, data, CACHE_TIMEOUT_METRICS)

        # Return the fresh engagement quality data
        return JsonResponse(data, safe=False)
    
    except ValueError as ex:
        return JsonResponse({"error": str(ex)}, status=400)
    except Exception:
        return _analytics_error("Error fetching engagement quality data")
    
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsInternalUser])
def get_device_engagment_view(request):
    try:
        # Try to get days from request parameters
        days = _bounded_int(request, 'days', 30, 1, MAX_GA4_DAYS)
        
        # Try to get cached device engagement data
        cache_key = f"device_engagment_days_{days}"
        cached_data = cache.get(cache_key)

        # If cached data exists, return it
        if cached_data is not None:
            return JsonResponse(cached_data, safe=False)

        # If not cached, fetch fresh device engagement data
        data = get_device_engagment(days=days)

        # Cache the results
        cache.set(cache_key, data, CACHE_TIMEOUT_METRICS)

        # Return the fresh device engagement data
        return JsonResponse(data, safe=False)
    
    except ValueError as ex:
        return JsonResponse({"error": str(ex)}, status=400)
    except Exception:
        return _analytics_error("Error fetching device engagement data")
