import os, json
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from django.core.cache import cache
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse, HttpResponseBadRequest
from GoldFrenAPI.Authentication.Auth_Permissions import IsInternalUser
from GoldFrenAPI.Services.GA4_Service import (
    get_home_page_metrics,
    get_top_searched_manufacturers,
    get_sessions_manual_source,
    get_language_sessions,
    get_top_view_pages
)

# Cache timeout settings for home page
CACHE_TIMEOUT_HOME = int(os.getenv("GA4_CACHE_TIMEOUT", 3600)) # 1 hour
CACHE_TIMEOUT_METRICS = int(os.getenv("GA4_CACHE_TIMEOUT_METRICS", 300)) # 5 minutes

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
    
    except Exception as ex:
        return HttpResponseBadRequest(f"Error fetching home page metrics: {str(ex)}")
    
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
    
    except Exception as ex:
        return HttpResponseBadRequest(f"Error fetching top searched manufacturers: {str(ex)}")
    
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsInternalUser])
def get_sessions_manual_source_view(request):
    try:
        # Try to get limit and days from request parameters
        limit = int(request.GET.get('limit', 10))
        days = int(request.GET.get('days', 7))
        
        # Try to get cached manual sources
        cache_key = f"sessions_manual_source_limit_{limit}_days_{days}"
        cached_sources = cache.get(cache_key)

        # If cached sources exist, return them
        if cached_sources is not None:
            return JsonResponse(cached_sources, safe=False)

        # If not cached, fetch fresh sources
        sources = get_sessions_manual_source(limit=limit, days=days)

        # Cache the results
        cache.set(cache_key, sources, CACHE_TIMEOUT_METRICS)

        # Return the fresh sources
        return JsonResponse(sources, safe=False)
    
    except Exception as ex:
        return HttpResponseBadRequest(f"Error fetching sessions by manual source: {str(ex)}")
    
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsInternalUser])
def get_language_sessions_view(request):
    try:
        # Try to get limit and days from request parameters
        limit = int(request.GET.get('limit', 10))
        days = int(request.GET.get('days', 7))
        
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
    
    except Exception as ex:
        return HttpResponseBadRequest(f"Error fetching sessions by language: {str(ex)}")
    
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsInternalUser])
def get_top_view_pages_view(request):
    try:
        # Try to get limit and days from request parameters
        limit = int(request.GET.get('limit', 10))
        days = int(request.GET.get('days', 7))
        
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
    
    except Exception as ex:
        return HttpResponseBadRequest(f"Error fetching top view pages: {str(ex)}")