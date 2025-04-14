# Adapter RestAPI view definiton

# Imports
import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from GoldFrenAPI.Authentication.Auth_Permissions import IsInternalUser
from django.http import JsonResponse, HttpResponseBadRequest
from GoldFrenAPI.utils.utils import (
    get_pagination,
    get_total_count,
    get_pagination_urls
)
from GoldFrenAPI.Services.Hadicky_Service import (
    get_hadicky as get_all_hadicky,
    get_hadicka,
    update_hadicka,
    create_hadicka,
    hadicka_publication
)

# Function to get all hadicky
@api_view(['GET'])
def get_hadicky(request):
    """
    This function will return all hadicky from the database with optional pagination.
    """
    try:
        # Get pagination parameters from request
        limit, page = get_pagination(request)
        
        # Try to get state parameter from request
        states = bool(request.GET.get("states", False))
    
        # If limit is set to 0 return all adapters
        if limit == 0:
            hadicky_objects = get_all_hadicky(states=states)
            hadicky = [hadicka.to_dict() for hadicka in hadicky_objects]
            return JsonResponse({
                "count": len(hadicky),
                "data": hadicky
            }, status=200)
        
        # Get adapters count
        total_hadicky = get_total_count("d_hadicka", states=states)
        
        # If limit is set to a number, return paginated hadicky
        hadicky_objects = get_all_hadicky(limit=limit, page=page, states=states)
        hadicky = [hadicka.to_dict() for hadicka in hadicky_objects]
        
        # Construct next and previous page URLs
        next_url, prev_url = get_pagination_urls(request, limit, page, total_hadicky)
        
        return JsonResponse({
            "count": total_hadicky,
            "next": next_url,
            "previous": prev_url,
            "data": hadicky
        }, status=200)

    # Handle pagination errors
    except ValueError:
        return JsonResponse({"error": "Invalid pagination parameters. Limit and offset must be integers."}, status=400)

# Function to get a single hadicka by ID
@api_view(['GET'])
def get_hadicka_by_id(request, hadicka_id):
    """
    This function returns a single hadicka by ID.
    """
    hadicka = get_hadicka(hadicka_id)
    if hadicka:
        return JsonResponse(hadicka.to_dict(), status=200)
    return JsonResponse({"error": "Hadicka not found"}, status=404)

# Function to update an hadicka
@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsInternalUser])
def update_hadicka_view(request, hadicka_id):
    """
    This function updates an existing hadicka.
    """
    if request.method != "PUT":
        return HttpResponseBadRequest("Invalid request method")
    
    # Parse JSON request body
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    
    # Get user id from request
    user = request.user
    data["aktualizoval"] = user.id
    
    # Update hadicka
    success = update_hadicka(hadicka_id, data)
    if success:
        return JsonResponse({"message": "Hadicka updated successfully"}, status=200)
    return JsonResponse({"error": "Failed to update hadicka"}, status=500)

# Function to create a new hadicka
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsInternalUser])
def create_hadicka_view(request):
    """
    This function creates a new hadicka.
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
    
    # Create adapter
    new_id = create_hadicka(data)
    if new_id:
        return JsonResponse({"message": "Hadicka created successfully", "adapter_id": new_id}, status=201)
    return JsonResponse({"error": "Failed to create hadicka"}, status=500)

# Change state of publikovat
@api_view(['PATCH'])
@permission_classes([IsAuthenticated, IsInternalUser])
def hadicka_publication_view(request, hadicka_id):
    """
    This function changes the state of publikovat for a hadicka.
    """
    if request.method != "PATCH":
        return HttpResponseBadRequest("Invalid request method")

    # Get params from request
    try:
        publikovat = request.GET.get("pbl", None)
        if publikovat is None:
            return JsonResponse({"error": "publikovat parameter is required"}, status=400)
    except Exception as ex:
        return JsonResponse({"error": f"There was a error getting publikovat parameter. Error: {ex}"}, status=400)
    
    # Update hadicka publication state
    success = hadicka_publication(hadicka_id, publikovat)
    
    if success:
        return JsonResponse({"message": f"Hadicka kod - {hadicka_id} - publication state updated successfully"}, status=200)
    return JsonResponse({"error": "Failed to update hadicka publication state"}, status=500)