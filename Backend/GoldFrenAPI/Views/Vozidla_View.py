import os
from django.http import JsonResponse
from rest_framework.decorators import api_view
from django.core.cache import cache
from GoldFrenAPI.Services.Vozidla_Service import (
    get_vyrobce_by_kategorie,
    get_vozidlo_filtered,
    get_vozidlo_sortiment_all,
    get_vozidlo_by_category
)

# Cache timeout settings
CACHE_TIMEOUT = int(os.getenv("DJANGO_CACHE_TIMEOUT", 86400))

@api_view(['GET'])
def get_vyrobce_names(request):
    # Get the kategorie_kod from the request
    kategorie_kod = request.GET.get("kategorie_kod")
    all_params = request.GET.get("all_params", "false").lower() == "true"
    if not kategorie_kod:
        return JsonResponse({"error": "kategorie_kod is required"}, status=400)

    # Check if there is a cached version of the vyrobce names
    cache_key = f"vyrobce_names_{kategorie_kod}_{all_params}"
    cached_data = cache.get(cache_key)
    if cached_data:
        return JsonResponse(cached_data, safe=False, status=200)

    # If not cached, fetch the vyrobce names from the database
    vyrobce_objects = get_vyrobce_by_kategorie(kategorie_kod, all_params=all_params)
    if vyrobce_objects:
        vyrobce_list = [v.to_dict() for v in vyrobce_objects]
        cache.set(cache_key, vyrobce_list, timeout=CACHE_TIMEOUT)
        return JsonResponse(vyrobce_list, safe=False, status=200)
    return JsonResponse({"error": "Vyrobce not found"}, status=404)

@api_view(['GET'])
def get_vozidlo_filtered_view(request):
    # Get the parameters from the request
    kategorie_kod = request.GET.get("kategorie_kod")
    vyrobce_kod = request.GET.get("vyrobce")
    objem = request.GET.get("objem")
    model = request.GET.get("model")
    rok_vyroby = request.GET.get("rok_vyroby")

    # Validate the required parameters
    if not kategorie_kod or not vyrobce_kod:
        return JsonResponse({"error": "kategorie_kod and vyrobce_kod are required"}, status=400)

    # Check if there is a cached version of the vozidlo data
    cache_key = f"vozidlo_filtered_{kategorie_kod}_{vyrobce_kod}_{objem}_{model}_{rok_vyroby}"
    cached_data = cache.get(cache_key)
    if cached_data:
        return JsonResponse(cached_data, safe=False, status=200)

    # If not cached, fetch the vozidlo data from the database
    vozidla_objects = get_vozidlo_filtered(kategorie_kod, vyrobce_kod, objem, model, rok_vyroby)
    if vozidla_objects:
        vozidla_list = [v.to_dict() for v in vozidla_objects]
        cache.set(cache_key, vozidla_list, timeout=CACHE_TIMEOUT)
        return JsonResponse(vozidla_list, safe=False, status=200)
    return JsonResponse({"error": "Vozidlo not found"}, status=404)

@api_view(['GET'])
def get_vozidlo_sortiment_view(request):
    # Get the vozidlo_kod from the request
    vozidlo_kod = request.GET.get("vozidlo_kod")
    if not vozidlo_kod:
        return JsonResponse({"error": "vozidlo_kod is required"}, status=400)

    try:
        vozidlo_id = int(vozidlo_kod)
    except ValueError:
        return JsonResponse({"error": "vozidlo_kod must be an integer"}, status=400)

    # Check if there is a cached version of the vozidlo sortiment data
    cache_key = f"vozidlo_sortiment_{vozidlo_id}"
    cached_data = cache.get(cache_key)
    if cached_data:
        return JsonResponse(cached_data, safe=False, status=200)

    # If not cached, fetch the vozidlo sortiment data from the database
    data = get_vozidlo_sortiment_all(vozidlo_id)
    if not data:
        return JsonResponse({"message": "No sortiment data found for vozidlo"}, status=404)

    cache.set(cache_key, data, timeout=CACHE_TIMEOUT)
    return JsonResponse(data, safe=False, status=200)

@api_view(['GET'])
def get_vozidlo_by_category_view(request):
    # Get the kategorie_kod from the request
    kategorie_kod = request.GET.get("kategorie_kod")
    if not kategorie_kod:
        return JsonResponse({"error": "kategorie_kod is required"}, status=400)

    # Check if there is a cached version of the vozidlo data
    cache_key = f"vozidlo_by_category_{kategorie_kod}"
    cached_data = cache.get(cache_key)
    if cached_data:
        return JsonResponse(cached_data, safe=False, status=200)

    # If not cached, fetch the vozidlo data from the database
    vozidla_objects = get_vozidlo_by_category(kategorie_kod)
    if vozidla_objects:
        vozidla_list = [v.to_dict() for v in vozidla_objects]
        cache.set(cache_key, vozidla_list, timeout=CACHE_TIMEOUT)
        return JsonResponse(vozidla_list, safe=False, status=200)
    
    return JsonResponse({"error": "Vozidla not found"}, status=404)