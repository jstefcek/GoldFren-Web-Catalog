import json
import logging
import os
import time
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from django.core.cache import cache
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponseBadRequest
from GoldFrenAPI.Authentication.Auth_Permissions import IsInternalUser
from GoldFrenAPI.Services.Vozidla_Service import (
    get_vyrobce_by_kategorie,
    get_vozidlo_filtered,
    get_vozidlo_sortiment_all,
    get_vozidlo_by_category,
    update_vozidlo,
    create_vozidlo,
    update_vyrobce,
    create_vyrobce,
    update_vozidlo_sortiment,
    get_vozidlo_sortiment_by_type,
    get_vozidlo_available_sortiment
)

logger = logging.getLogger(__name__)

# Cache timeout settings
CACHE_TIMEOUT = int(os.getenv("DJANGO_CACHE_TIMEOUT", 86400))
VEHICLE_CACHE_VERSION_KEY = "vozidlo_cache_version"
VEHICLE_CATEGORY_MAP = {
    "automobily": ("Auto", 2),
    "motocykly": ("Motocykl", 1),
    "motokary": ("Motokary", 6),
    "kola": ("Kolo", 3),
    "letadla": ("Letadlo", 4),
    "prumysl": ("Prumysl", 5),
}


def _vehicle_cache_version():
    version = cache.get(VEHICLE_CACHE_VERSION_KEY)
    if version is None:
        version = str(time.time_ns())
        cache.set(VEHICLE_CACHE_VERSION_KEY, version, None)
    return version


def _vehicle_cache_key(name, *parts):
    normalized_parts = ["" if part is None else str(part) for part in parts]
    return ":".join(["vozidlo", _vehicle_cache_version(), name, *normalized_parts])


def _invalidate_vehicle_caches():
    cache.set(VEHICLE_CACHE_VERSION_KEY, str(time.time_ns()), None)

@api_view(['GET'])
def get_vyrobce_names(request):
    # Get the kategorie_kod from the request
    kategorie_kod = request.GET.get("kategorie_kod")
    all_params = request.GET.get("all_params", "false").lower() == "true"
    
    # Set default kategorie_kod if not provided (Return all vyrobce)
    if not kategorie_kod:
        kategorie_kod = "All"

    # If not cached, fetch the vyrobce names from the database
    vyrobce_objects = get_vyrobce_by_kategorie(kategorie_kod, all_params=all_params)
    if vyrobce_objects:
        vyrobce_list = [v.to_dict() for v in vyrobce_objects]
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
    cache_key = _vehicle_cache_key("filtered", kategorie_kod, vyrobce_kod, objem, model, rok_vyroby)
    cached_data = cache.get(cache_key)
    if cached_data is not None:
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
    cache_key = _vehicle_cache_key("sortiment", vozidlo_id)
    cached_data = cache.get(cache_key)
    if cached_data is not None:
        return JsonResponse(cached_data, safe=False, status=200)

    # If not cached, fetch the vozidlo sortiment data from the database
    data = get_vozidlo_sortiment_all(vozidlo_id)
    if not data:
        return JsonResponse({"message": "No sortiment data found for vozidlo"}, status=404)

    cache.set(cache_key, data, timeout=CACHE_TIMEOUT)
    return JsonResponse(data, safe=False, status=200)

@api_view(['GET'])
def get_vozidlo_by_category_view(request):
    # Get the kategorie from the request
    kategorie = request.GET.get("kategorie_kod")
    if not kategorie:
        return JsonResponse({"error": "kategorie is required"}, status=400)
    
    category = VEHICLE_CATEGORY_MAP.get(kategorie)
    if category is None:
        return JsonResponse({"error": "Invalid kategorie_kod"}, status=400)

    kategorie, kategorie_kod = category

    # Check if there is a cached version of the vozidlo data
    cache_key = _vehicle_cache_key("by_category", kategorie_kod)
    
    cached_data = cache.get(cache_key)
    if cached_data is not None:
        return JsonResponse(cached_data, safe=False, status=200)

    # If not cached, fetch the vozidlo data from the database
    vozidla_objects = get_vozidlo_by_category(kategorie)
    if vozidla_objects:
        vozidla_list = [v.to_dict() for v in vozidla_objects]
        cache.set(cache_key, vozidla_list, timeout=CACHE_TIMEOUT)
        return JsonResponse(vozidla_list, safe=False, status=200)
    
    return JsonResponse({"error": "Vozidla not found"}, status=404)

@api_view(['GET'])
def get_vozidlo_sortiment_type_view(request, vozidlo_id, sortiment_type):
    # Check if parameters are provided
    if not vozidlo_id or not sortiment_type:
        return JsonResponse({"error": "vozidlo_id and sortiment_type are required"}, status=400)

    # Get vozidlo sortiment by type
    vozidlo_sortiment = get_vozidlo_sortiment_by_type(vozidlo_id=vozidlo_id, sortiment_type=sortiment_type)
    if vozidlo_sortiment:
        return JsonResponse(vozidlo_sortiment, safe=False, status=200)
    return JsonResponse({"error": "Vozidlo sortiment not found"}, status=404)

@api_view(['GET'])
def get_vozidlo_available_sortiment_view(request, vozidlo_id, sortiment_type):
    # Check if parameters are provided
    if not vozidlo_id or not sortiment_type:
        return JsonResponse({"error": "vozidlo_id and sortiment_type are required"}, status=400)

    # Get vozidlo sortiment by type
    vozidlo_sortiment = get_vozidlo_available_sortiment(vozidlo_id=vozidlo_id, sortiment_type=sortiment_type)
    if vozidlo_sortiment:
        return JsonResponse(vozidlo_sortiment, safe=False, status=200)
    return JsonResponse({"error": "Vozidlo sortiment not found"}, status=404)

@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsInternalUser])
def update_vozidlo_view(request, vozidlo_id):
    # Get the data from the request
    data = request.data

    # Validate the required fields
    required_fields = ["subkategorie", "vyrobce", "typ", "oznaceni", "rok_od", "rok_do", "vykon", "objem", "publikovat"]
    for field in required_fields:
        if field not in data:
            return JsonResponse({"error": f"{field} is required"}, status=400)

    # Update the vozidlo in the database
    try:
        success = update_vozidlo(vozidlo_id, data)

        if success:
            _invalidate_vehicle_caches()
            return JsonResponse({"message": "Vozidlo updated successfully"}, status=200)

        return JsonResponse({"error": "Failed to update Vozidlo"}, status=400)
    except Exception:
        logger.exception("Failed to update vozidlo %s", vozidlo_id)
        return JsonResponse({"error": "Failed to update vozidlo"}, status=500)
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsInternalUser])
def update_vyrobce_view(request, vyrobce_kod):
    # Check vyrobce kod if is provided
    if not vyrobce_kod:
        return JsonResponse({"error": "vyrobce_kod is required"}, status=400)

    # Get the data to update from the request
    data = request.data
    if not data:
        return JsonResponse({"error": "No data provided"}, status=400)
    
    # Get user id from request
    user = request.user
    data["aktualizoval"] = user.id

    # Update the vyrobce
    status = update_vyrobce(vyrobce_kod, data)
    if status:
        _invalidate_vehicle_caches()
        return JsonResponse({"message": "Vyrobce updated successfully"}, status=200)
    return JsonResponse({"error": "Failed to update vyrobce"}, status=400)

@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsInternalUser])
def update_vozidlo_sortiment_view(request, vozidlo_id):
    """
    This function update sortiment records for given vozidlo id
    """
    # Check vyrobce kod if is provided
    if not vozidlo_id:
        return JsonResponse({"error": "vozidlo_id is required"}, status=400)
    
    # Get the data to update from the request
    data = request.data
    if not data:
        return JsonResponse({"error": "No sortiment data provided"}, status=400)
    
    # Get user id from request
    user = request.user
    data["aktualizoval"] = user.id
    
    # Update the vyrobce
    status = update_vozidlo_sortiment(vozidlo_id, data)
    if status:
        _invalidate_vehicle_caches()
        return JsonResponse({"message": "Vozidlo sortiment updated successfully"}, status=200)
    return JsonResponse({"error": "Failed to update vozidlo sortiment"}, status=400)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsInternalUser])
def create_vozidlo_view(request):
    """
    This function creates a new vozidlo in DB.
    """
    if request.method != "POST":
        return HttpResponseBadRequest("Invalid request method")

    # Parse JSON request body
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    
    # Get user id from request
    user = request.user
    data["aktualizoval"] = user.id
    
    # Create vozidlo
    new_id = create_vozidlo(data)
    if new_id:
        _invalidate_vehicle_caches()
        return JsonResponse({"message": "Vozidlo created successfully", "id": new_id, "vozidlo_id": new_id}, status=201)
    return JsonResponse({"error": "Failed to create vozidlo"}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsInternalUser])
def create_vyrobce_view(request):
    if request.method != "POST":
        return HttpResponseBadRequest("Invalid request method")
    
    # Get the data to create from the request
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    
    # Get user id from request
    user = request.user
    data["aktualizoval"] = user.id

    # Create the vyrobce
    new_id = create_vyrobce(data)
    if new_id:
        _invalidate_vehicle_caches()
        return JsonResponse({"message": "Vyrobce created successfully", "id": new_id, "vyrobce_id": new_id}, status=201)
    return JsonResponse({"error": "Failed to create vyrobce"}, status=400)
