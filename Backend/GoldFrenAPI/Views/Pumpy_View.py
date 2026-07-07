# Adapter RestAPI view definiton

# Imports
import json
import logging
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from GoldFrenAPI.Authentication.Auth_Permissions import IsInternalUser
from django.http import JsonResponse, HttpResponseBadRequest
from GoldFrenAPI.utils.utils import (
    get_pagination,
    get_total_count,
    get_pagination_urls,
    get_total_count_with_params,
    get_publication_states,
    parse_publication_value
)
from GoldFrenAPI.Services.Pumpy_Service import (
    get_pumpy as get_all_pumpy,
    get_pumpa,
    update_pumpa,
    create_pumpa,
    pumpa_publication,
    get_filtered_pumpy,
    get_vozidla_for_pumpa
)

logger = logging.getLogger(__name__)

# Function to get all pumpy
@api_view(['GET'])
def get_pumpy(request):
    """
    This function will return all pumpy from the database with optional pagination.
    """
    try:
        # Get pagination parameters from request
        limit, page = get_pagination(request)
        
        # Try to get state parameter from request
        states = get_publication_states(request)
    
        # If limit is set to 0 return all pumpy
        if limit == 0:
            pumpy_objects = get_all_pumpy(states=states) or []
            pumpy = [pumpa.to_dict() for pumpa in pumpy_objects]
            return JsonResponse({
                "count": len(pumpy),
                "data": pumpy
            }, status=200)
        
        # Get pumpy count
        total_pumpy = get_total_count("d_pumpa", states=states)
        
        # If limit is set to a number, return paginated pumpy
        pumpy_objects = get_all_pumpy(limit=limit, page=page, states=states) or []
        pumpy = [pumpa.to_dict() for pumpa in pumpy_objects]
        
        # Construct next and previous page URLs
        next_url, prev_url = get_pagination_urls(request, limit, page, total_pumpy)
        
        return JsonResponse({
            "count": total_pumpy,
            "next": next_url,
            "previous": prev_url,
            "data": pumpy
        }, status=200)

    # Handle pagination errors
    except ValueError:
        return JsonResponse({"error": "Invalid pagination parameters. Limit and offset must be integers."}, status=400)

# Function to get a single pumpa by ID
@api_view(['GET'])
def get_pumpa_by_id(request, pumpa_id):
    """
    This function returns a single pumpa by ID.
    """
    pumpa = get_pumpa(pumpa_id)
    if pumpa:
        return JsonResponse(pumpa.to_dict(), status=200)
    return JsonResponse({"error": "Pumpa not found"}, status=404)

# Function to return pumpa that match specific parameters
@api_view(['GET'])
def get_filtered_pumpa_view(request):
    """
    This function returns pumpa that match specific parameters.
    """
    try:    
        # Get parameters from request
        prumer_min = request.GET.get("prumer_min", None)
        prumer_max = request.GET.get("prumer_max", None)
        pozice = request.GET.get("pozice", None)
        
        # Store params to dict
        filters = {
            "prumer": (prumer_min, prumer_max),
            "pozice": pozice
        }
        
        # Get pagination parameters from request 
        limit, page = get_pagination(request)
        
        # Try to get state parameter from request
        states = get_publication_states(request)
    
        # If limit is set to 0 return all pumpy
        if limit == 0:
            pumpy_objects = get_filtered_pumpy(states=states, filters=filters)
            if pumpy_objects:
                pumpy = [pumpa for pumpa in pumpy_objects]
                return JsonResponse({
                    "count": len(pumpy),
                    "data": pumpy
                }, status=200)
        
        # If limit is set to a number, return paginated pumpy
        pumpy_objects = get_filtered_pumpy(limit=limit, page=page, states=states, filters=filters)
        if pumpy_objects:
            pumpy = [pumpa for pumpa in pumpy_objects]
            
            # Get filtered pumpy count
            total_pumpy = get_total_count_with_params("""SELECT DISTINCT kod, cislo_dilu, obrazek, vektor, prumer, typ, pozice
                                                            FROM v_vozidlo_pumpa""", 
                                                        states=states, filters=filters)
            
            # Construct next and previous page URLs
            next_url, prev_url = get_pagination_urls(request, limit, page, total_pumpy)
            return JsonResponse({
                "count": total_pumpy,
                "next": next_url,
                "previous": prev_url,
                "data": pumpy
            }, status=200)
        else:
            return JsonResponse({"error": "No pumpy has been found.."}, status=404)

    # Handle pagination errors
    except ValueError:
        return JsonResponse({"error": "Invalid pagination parameters. Limit and offset must be integers."}, status=400)

# Function to get vozidla for a specific pumpa
@api_view(['GET'])
def get_vozidla_for_pumpa_view(request):
    """
    This function returns vozidla for a specific pumpa.
    """
    try:
        # Get parameters from request
        pumpa_id = request.GET.get("pumpa_id", None)
        if not pumpa_id:
            return JsonResponse({"error": "Missing pumpa_id parameter"}, status=400)
        
        # Get pagination parameters from request
        limit, page = get_pagination(request)
        
        # Try to get state parameter from request
        states = get_publication_states(request)
        
        # If limit is set to 0 return all pumpa
        if limit == 0:
            vozidla_objects = get_vozidla_for_pumpa(pumpa_id=pumpa_id) or []
            if vozidla_objects:
                vozidla = [vozidlo.to_dict() for vozidlo in vozidla_objects]
                return JsonResponse({
                    "count": len(vozidla),
                    "data": vozidla
                }, status=200)
        
        # Get vozidla for the pumpa
        vozidla_objects = get_vozidla_for_pumpa(limit=limit, page=page, states=states, pumpa_id=pumpa_id) or []
        if vozidla_objects:
            vozidla = [vozidlo.to_dict() for vozidlo in vozidla_objects]
        
            # Get filtered kotouc count
            total_pumpy = get_total_count_with_params("SELECT * FROM v_vozidlo_pumpa",
                                                        states=states, filters={"kod": pumpa_id})
            
            # Construct next and previous page URLs
            next_url, prev_url = get_pagination_urls(request, limit, page, total_pumpy)
            return JsonResponse({
                "count": total_pumpy,
                "next": next_url,
                "previous": prev_url,
                "data": vozidla
            }, status=200)
            
        return JsonResponse({"error": "No vozidla found for this pumpa"}, status=404)
    
    except Exception:
        logger.exception("Error fetching vozidla for pumpa")
        return JsonResponse({"error": "Error fetching vozidla"}, status=500)

# Function to update an pumpa
@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsInternalUser])
def update_pumpa_view(request, pumpa_id):
    """
    This function updates an existing pumpa.
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
    
    # Update pumpa
    success = update_pumpa(pumpa_id, data)
    if success:
        return JsonResponse({"message": "Pumpa updated successfully"}, status=200)
    return JsonResponse({"error": "Failed to update pumpa"}, status=500)

# Function to create a new pumpa
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsInternalUser])
def create_pumpa_view(request):
    """
    This function creates a new pumpa.
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
    new_id = create_pumpa(data)
    if new_id:
        return JsonResponse({"message": "Pumpa created successfully", "id": new_id, "pumpa_id": new_id}, status=201)
    return JsonResponse({"error": "Failed to create pumpa"}, status=500)

# Change state of publikovat
@api_view(['PATCH'])
@permission_classes([IsAuthenticated, IsInternalUser])
def pumpa_publication_view(request, pumpa_id):
    """
    This function changes the state of publikovat for a pumpa.
    """
    if request.method != "PATCH":
        return HttpResponseBadRequest("Invalid request method")

    # Get params from request
    try:
        raw_publikovat = request.GET.get("pbl", None)
        if raw_publikovat is None:
            return JsonResponse({"error": "Publikovat parameter is required"}, status=400)
        publikovat = parse_publication_value(raw_publikovat)
    except ValueError as ex:
        return JsonResponse({"error": str(ex)}, status=400)
    
    # Update pumpa publication state
    success = pumpa_publication(pumpa_id, publikovat)
    
    if success:
        return JsonResponse({"message": f"Pumpa kod - {pumpa_id} - publication state updated successfully"}, status=200)
    return JsonResponse({"error": "Failed to update pumpa publication state"}, status=500)
