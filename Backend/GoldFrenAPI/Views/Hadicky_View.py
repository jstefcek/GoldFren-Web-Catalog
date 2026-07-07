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
    get_pagination_urls,
    get_total_count_with_params,
    get_publication_states
)
from GoldFrenAPI.Services.Hadicky_Service import (
    get_hadicky as get_all_hadicky,
    get_hadicka,
    update_hadicka,
    create_hadicka,
    hadicka_publication,
    get_filtered_hadicky,
    get_vozidla_for_hadicka
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
        states = get_publication_states(request)
    
        # If limit is set to 0 return all adapters
        if limit == 0:
            hadicky_objects = get_all_hadicky(states=states)
            if hadicky_objects:
                hadicky = [hadicka.to_dict() for hadicka in hadicky_objects]
                return JsonResponse({
                    "count": len(hadicky),
                    "data": hadicky
                }, status=200)
        
        # Get hadicka count
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

# Function to return hadicky that match specific parameters
@api_view(['GET'])
def get_filtered_hadicky_view(request):
    """
    This function returns hadicky that match specific parameters.
    """
    try:    
        # Get parameters from request
        pozice = request.GET.get("pozice", None)
        
        # Store params to dict
        filters = {
            "pozice": [pozice] if pozice else None
        }
        
        # Get pagination parameters from request 
        limit, page = get_pagination(request)
        
        # Try to get state parameter from request
        states = get_publication_states(request)
    
        # If limit is set to 0 return all hadicky
        if limit == 0:
            hadicky_objects = get_filtered_hadicky(states=states, filters=filters)
            if hadicky_objects:
                hadicky = [hadicka for hadicka in hadicky_objects]
                return JsonResponse({
                    "count": len(hadicky),
                    "data": hadicky
                }, status=200)
        
        # If limit is set to a number, return paginated hadicky
        hadicky_objects = get_filtered_hadicky(limit=limit, page=page, states=states, filters=filters)
        if hadicky_objects:
            hadicky = [hadicka for hadicka in hadicky_objects]
            
            # Get filtered hadicky count
            total_hadicky = get_total_count_with_params("""SELECT DISTINCT kod, cislo_dilu, obrazek, vektor, poznamka, pozice
                                                            FROM v_vozidlo_hadicka""", 
                                                        states=states, filters=filters)
            
            # Construct next and previous page URLs
            next_url, prev_url = get_pagination_urls(request, limit, page, total_hadicky)
            
            return JsonResponse({
                "count": total_hadicky,
                "next": next_url,
                "previous": prev_url,
                "data": hadicky
            }, status=200)
        else:
            return JsonResponse({"error": "No hadicka has been found.."}, status=404)

    # Handle pagination errors
    except ValueError:
        return JsonResponse({"error": "Invalid pagination parameters. Limit and offset must be integers."}, status=400)
    
# Function to get vozidla for a specific hadicka
@api_view(['GET'])
def get_vozidla_for_hadicka_view(request):
    """
    This function returns vozidla for a specific hadicka.
    """
    try:
        # Get parameters from request
        hadicka_id = request.GET.get("hadicka_id", None)
        
        # Get pagination parameters from request
        limit, page = get_pagination(request)
        
        # Try to get state parameter from request
        states = get_publication_states(request)
        
        # If limit is set to 0 return all hadicka
        if limit == 0:
            vozidla_objects = get_vozidla_for_hadicka(hadicka_id=hadicka_id)
            if vozidla_objects:
                vozidla = [vozidlo.to_dict() for vozidlo in vozidla_objects]
                return JsonResponse({
                    "count": len(vozidla),
                    "data": vozidla
                }, status=200)
        
        # Get vozidla for the hadicky
        vozidla_objects = get_vozidla_for_hadicka(limit=limit, page=page, states=states, hadicka_id=hadicka_id)
        if vozidla_objects:
            vozidla = [vozidlo.to_dict() for vozidlo in vozidla_objects]
        
            # Get filtered hadicky count
            total_hadicky = get_total_count_with_params("SELECT * FROM v_vozidlo_hadicka",
                                                        states=states, filters={"kod": hadicka_id})
            
            # Construct next and previous page URLs
            next_url, prev_url = get_pagination_urls(request, limit, page, total_hadicky)
            return JsonResponse({
                "count": total_hadicky,
                "next": next_url,
                "previous": prev_url,
                "data": vozidla
            }, status=200)
            
        return JsonResponse({"error": "No vozidla found for this hadicka"}, status=404)
    
    except Exception as ex:
        return JsonResponse({"error": f"Error fetching vozidla: {str(ex)}"}, status=500)

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
        return JsonResponse({"message": "Hadicka created successfully", "hadicka_id": new_id}, status=201)
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
