import os, json
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from django.core.cache import cache
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse, HttpResponseBadRequest
from GoldFrenAPI.Authentication.Auth_Permissions import IsInternalUser
from GoldFrenAPI.Services.GA4_Service import get_home_page_metrics

# Cache timeout settings - 1 hour 
CACHE_TIMEOUT_HOME = int(os.getenv("GA4_CACHE_TIMEOUT", 3600))

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