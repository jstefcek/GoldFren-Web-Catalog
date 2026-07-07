# Brzdice RestAPI view definiton

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
from GoldFrenAPI.Services.Brzdice_Service import (
    get_brzdice as get_all_brzdice,
    get_brzdic,
    update_brzdic,
    create_brzdic,
    brzdice_publication,
    get_filtered_brzdice,
    get_vozidla_for_brzdic,
    )

# Function to get all brzdice
@api_view(['GET'])
def get_brzdice(request):
    """
    This function will return all brzdice from the database with optional pagination.
    """
    try:
        # Get pagination parameters from request
        limit, page = get_pagination(request)
        
        # Try to get state parameter from request
        states = get_publication_states(request)
        
        # If limit is set to 0 return all adapters
        if limit == 0:
            brzdice_objects = get_all_brzdice(states=states)
            brzdice = [brzdic.to_dict() for brzdic in brzdice_objects]
            return JsonResponse({
                "count": len(brzdice),
                "data": brzdice
            }, status=200)
            
        # Get adapters count
        total_brzidce = get_total_count("d_brzdice", states=states)
        
        # If limit is set to a number, return paginated adapters
        brzdice_objects = get_all_brzdice(limit=limit, page=page, states=states)
        brzdice = [brzdic.to_dict() for brzdic in brzdice_objects]
        
        # Construct next and previous page URLs
        next_url, prev_url = get_pagination_urls(request, limit, page, total_brzidce)
        
        return JsonResponse({
            "count": total_brzidce,
            "next": next_url,
            "previous": prev_url,
            "data": brzdice
        }, status=200)
    
    # Handle pagination errors
    except ValueError:
        return JsonResponse({"error": "Invalid pagination parameters. Limit and offset must be integers."}, status=400)

# Function to get a single adapter by ID
@api_view(['GET'])
def get_brzdic_by_id(request, brzdic_id):
    """
    This function returns a single brzdic by ID.
    """
    brzdic = get_brzdic(brzdic_id)
    if brzdic:
        return JsonResponse(brzdic.to_dict(), status=200)
    return JsonResponse({"error": "Brzdic not found"}, status=404)

# Function to return brzdice that match specific parameters
@api_view(['GET'])
def get_filtered_brzdice_view(request):
    """
    This function returns brzdice that match specific parameters.
    """
    try:    
        # Get parameters from request
        pozice = request.GET.get("pozice", None)
        uchyceni = request.GET.get("uchyceni", None)
        pistku_min = request.GET.get("pocet_pistku_min", None)
        pistku_max = request.GET.get("pocet_pistku_max", None)
        
        # Store params to dict
        filters = {
            "pozice": pozice if pozice else None,
            "typ_uchyceni": uchyceni if uchyceni else None,
            "pocet_pistku": (pistku_min, pistku_max)
        }
        
        # Get pagination parameters from request
        limit, page = get_pagination(request)
        
        # Try to get state parameter from request
        states = get_publication_states(request)
    
        # If limit is set to 0 return all filtered brzdice
        if limit == 0:
            brzdice_objects = get_filtered_brzdice(states=states, filters=filters)
            if brzdice_objects:
                brzdice = [brzdic for brzdic in brzdice_objects]
                return JsonResponse({
                    "count": len(brzdice),
                    "data": brzdice
                }, status=200)
        
        # Return paginated brzdice with filters
        brzdice_objects = get_filtered_brzdice(limit=limit, page=page, states=states, filters=filters)
        if brzdice_objects:
            brzdice = [brzdic for brzdic in brzdice_objects]
            
            # Get filtered brzdice count
            total_brzdice = get_total_count_with_params("SELECT DISTINCT kod, cislo_dilu, obrazek, vektor, pozice, pocet_pistku, typ_uchyceni FROM v_vozidlo_brzdic", 
                                                        states=states, filters=filters)
            
            # Construct next and previous page URLs
            next_url, prev_url = get_pagination_urls(request, limit, page, total_brzdice)
            
            return JsonResponse({
                "count": total_brzdice,
                "next": next_url,
                "previous": prev_url,
                "data": brzdice
            }, status=200)
        else:
            return JsonResponse({"error": "No brzdic has been found.."}, status=404)

    # Handle pagination errors
    except ValueError:
        return JsonResponse({"error": "Invalid pagination parameters. Limit and offset must be integers."}, status=400)
    
# Function to get vozidla for a specific brzdic
@api_view(['GET'])
def get_vozidla_for_brzdic_view(request):
    """
    This function returns vozidla for a specific brzdic.
    """
    try:
        # Get parameters from request
        brzdic_id = request.GET.get("brzdic_id", None)
        
        # Get pagination parameters from request
        limit, page = get_pagination(request)
        
        # Try to get state parameter from request
        states = get_publication_states(request)
        
        # If limit is set to 0 return all adapters
        if limit == 0:
            brzdice_objects = get_vozidla_for_brzdic(brzdic_id=brzdic_id)
            if brzdice_objects:
                brzdic = [brzdic.to_dict() for brzdic in brzdice_objects]
                return JsonResponse({
                    "count": len(brzdic),
                    "data": brzdic
                }, status=200)
        
        # Get vozidla for the brzdic
        brzdice_objects = get_vozidla_for_brzdic(limit=limit, page=page, states=states, brzdic_id=brzdic_id)
        if brzdice_objects:
            vozidla = [vozidlo.to_dict() for vozidlo in brzdice_objects]
        
            # Get filtered adapters count
            total_vozidla_brzdice = get_total_count_with_params("SELECT * FROM v_vozidlo_brzdic",
                                                        states=states, filters={"kod": brzdic_id})
            
            # Construct next and previous page URLs
            next_url, prev_url = get_pagination_urls(request, limit, page, total_vozidla_brzdice)
            
            return JsonResponse({
                "count": total_vozidla_brzdice,
                "next": next_url,
                "previous": prev_url,
                "data": vozidla
            }, status=200)
            
        return JsonResponse({"error": "No vozidla found for this brzdic"}, status=404)
    
    except Exception as ex:
        return JsonResponse({"error": f"Error fetching vozidla: {str(ex)}"}, status=500)

# Function to update an adapter
@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsInternalUser])
def update_brzdic_view(request, brzdic_id):
    """
    This function updates an existing brzdic.
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
    
    # Update brzdic
    success = update_brzdic(brzdic_id, data)
    if success:
        return JsonResponse({"message": "Brzdic updated successfully"}, status=200)
    return JsonResponse({"error": "Failed to update brdzic"}, status=500)

# Function to create a new brzdic
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsInternalUser])
def create_brzdic_view(request):
    """
    This function creates a new brzdic.
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
    
    # Create brzdic
    new_id = create_brzdic(data)
    if new_id:
        return JsonResponse({"message": "Brzdic created successfully", "brzdic_id": new_id}, status=201)
    return JsonResponse({"error": "Failed to create brzdic"}, status=500)

# Change state of publikovat
@api_view(['PATCH'])
@permission_classes([IsAuthenticated, IsInternalUser])
def brzdic_publication_view(request, brzdic_id):
    """
    This function changes the state of publikovat for a brzdic.
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
    
    # Update brzdic publication state
    success = brzdice_publication(brzdic_id, publikovat)
    
    if success:
        return JsonResponse({"message": f"Brzdic kod - {brzdic_id} - publication state updated successfully"}, status=200)
    return JsonResponse({"error": "Failed to update brzdic publication state"}, status=500)
