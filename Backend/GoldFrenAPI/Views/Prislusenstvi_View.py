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
    get_total_count_with_params
)
from GoldFrenAPI.Services.Prislusenstvi_Service import (
    get_prislusenstvi as get_all_prislusenstvi,
    get_one_prislusenstvi,
    update_prislusenstvi,
    create_prislusenstvi,
    prislusenstvi_publication,
    get_filtered_prislusenstvi,
    get_vozidla_for_prislusenstvi
)

# Function to get all prislusenstvi
@api_view(['GET'])
def get_prislusenstvi(request):
    """
    This function will return all prislusenstvi from the database with optional pagination.
    """
    try:
        # Get pagination parameters from request
        limit, page = get_pagination(request)
        
        # Try to get state parameter from request
        states = bool(request.GET.get("states", False))
    
        # If limit is set to 0 return all prislusenstvi
        if limit == 0:
            prislusenstvi_objects = get_all_prislusenstvi(states=states)
            if prislusenstvi_objects:
                prislusenstvi = [prislusenstvi.to_dict() for prislusenstvi in prislusenstvi_objects]
                return JsonResponse({
                    "count": len(prislusenstvi),
                    "data": prislusenstvi
                }, status=200)
        
        # Get prislusenstvi count
        total_prislusenstvi = get_total_count("d_prislusenstvi", states=states)
        
        # If limit is set to a number, return paginated prislusenstvi
        prislusenstvi_objects = get_all_prislusenstvi(limit=limit, page=page, states=states)
        prislusenstvi = [prislusenstvi.to_dict() for prislusenstvi in prislusenstvi_objects]
        
        # Construct next and previous page URLs
        next_url, prev_url = get_pagination_urls(request, limit, page, total_prislusenstvi)
        
        return JsonResponse({
            "count": total_prislusenstvi,
            "next": next_url,
            "previous": prev_url,
            "data": prislusenstvi
        }, status=200)

    # Handle pagination errors
    except ValueError:
        return JsonResponse({"error": "Invalid pagination parameters. Limit and offset must be integers."}, status=400)

# Function to get a single prislusenstvi by ID
@api_view(['GET'])
def get_prislusenstvi_by_id(request, prislusenstvi_id):
    """
    This function returns a single prislusenstvi by ID.
    """
    prislusenstvi = get_one_prislusenstvi(prislusenstvi_id)
    if prislusenstvi:
        return JsonResponse(prislusenstvi.to_dict(), status=200)
    return JsonResponse({"error": "Prislusenstvi not found"}, status=404)

# Function to return prislusenstvi that match specific parameters
@api_view(['GET'])
def get_filtered_prislusenstvi_view(request):
    """
    This function returns prislusenstvi that match specific parameters.
    """
    try:    
        # Get parameters from request
        typ = request.GET.get("typ", None)
        
        # Store params to dict
        filters = {
            "typ": typ
        }
        
        # Get pagination parameters from request 
        limit, page = get_pagination(request)
        
        # Try to get state parameter from request
        states = bool(request.GET.get("states", False))
    
        # If limit is set to 0 return all prislusenstvi
        if limit == 0:
            prislusenstvi_objects = get_filtered_prislusenstvi(states=states, filters=filters)
            if prislusenstvi_objects:
                all_prislusenstvi = [prislusenstvi for prislusenstvi in prislusenstvi_objects]
                return JsonResponse({
                    "count": len(all_prislusenstvi),
                    "data": all_prislusenstvi
                }, status=200)
        
        # If limit is set to a number, return paginated prislusenstvi
        prislusenstvi_objects = get_filtered_prislusenstvi(limit=limit, page=page, states=states, filters=filters)
        if prislusenstvi_objects:
            all_prislusenstvi = [prislusenstvi for prislusenstvi in prislusenstvi_objects]
            
            # Get filtered prislusenstvi count
            total_prislusenstvi = get_filtered_prislusenstvi("""SELECT DISTINCT kod, cislo_dilu, obrazek, vektor, typ, poznamka, popis, pozice
                                                            FROM v_vozidlo_prislusenstvi
                                                            """, 
                                                        states=states, filters=filters)
            
            # Construct next and previous page URLs
            next_url, prev_url = get_pagination_urls(request, limit, page, total_prislusenstvi)
            return JsonResponse({
                "count": total_prislusenstvi,
                "next": next_url,
                "previous": prev_url,
                "data": all_prislusenstvi
            }, status=200)
        else:
            return JsonResponse({"error": "No prislusenstvi has been found.."}, status=404)

    # Handle pagination errors
    except ValueError:
        return JsonResponse({"error": "Invalid pagination parameters. Limit and offset must be integers."}, status=400)

# Function to get vozidla for a specific prislusenstvi
@api_view(['GET'])
def get_vozidla_for_prislusenstvi_view(request):
    """
    This function returns vozidla for a specific prislusenstvi.
    """
    try:
        # Get parameters from request
        prislusenstvi_id = request.GET.get("prislusenstvi_id", None)
        if not prislusenstvi_id:
            return JsonResponse({"error": "Missing prislusenstvi_id parameter"}, status=400)
        
        # Get pagination parameters from request
        limit, page = get_pagination(request)
        
        # Try to get state parameter from request
        states = bool(request.GET.get("states", False))
        
        # If limit is set to 0 return all prislusenstvi
        if limit == 0:
            vozidla_objects = get_vozidla_for_prislusenstvi(prislusenstvi_id=prislusenstvi_id)
            if vozidla_objects:
                vozidla = [vozidlo.to_dict() for vozidlo in vozidla_objects]
                return JsonResponse({
                    "count": len(vozidla),
                    "data": vozidla
                }, status=200)
        
        # Get vozidla for the prislusenstvi
        vozidla_objects = get_vozidla_for_prislusenstvi(limit=limit, page=page, states=states, kotouc_id=prislusenstvi_id)
        if vozidla_objects:
            vozidla = [vozidlo.to_dict() for vozidlo in vozidla_objects]
        
            # Get filtered prislusenstvi count
            total_kotouce = get_total_count_with_params("SELECT * FROM v_vozidlo_prislusenstvi",
                                                        states=states, filters={"kod": prislusenstvi_id})
            
            # Construct next and previous page URLs
            next_url, prev_url = get_pagination_urls(request, limit, page, total_kotouce)
            return JsonResponse({
                "count": total_kotouce,
                "next": next_url,
                "previous": prev_url,
                "data": vozidla
            }, status=200)
            
        return JsonResponse({"error": "No vozidla found for this prislusenstvi"}, status=404)
    
    except Exception as ex:
        return JsonResponse({"error": f"Error fetching vozidla: {str(ex)}"}, status=500)

# Function to update an prislusenstvi
@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsInternalUser])
def update_prislusenstvi_view(request, prislusenstvi_id):
    """
    This function updates an existing prislusenstvi.
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
    
    # Update prislusenstvi
    success = update_prislusenstvi(prislusenstvi_id, data)
    if success:
        return JsonResponse({"message": "Prislusenstvi updated successfully"}, status=200)
    return JsonResponse({"error": "Failed to update prislusenstvi"}, status=500)

# Function to create a new prislusenstvi
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsInternalUser])
def create_prislusenstvi_view(request):
    """
    This function creates a new prislusenstvi.
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
    new_id = create_prislusenstvi(data)
    if new_id:
        return JsonResponse({"message": "Prislusenstvi created successfully", "prislusenstvi_id": new_id}, status=201)
    return JsonResponse({"error": "Failed to create prislusenstvi"}, status=500)

# Change state of publikovat
@api_view(['PATCH'])
@permission_classes([IsAuthenticated, IsInternalUser])
def prislusenstvi_publication_view(request, prislusenstvi_id):
    """
    This function changes the state of publikovat for a prislusenstvi.
    """
    if request.method != "PATCH":
        return HttpResponseBadRequest("Invalid request method")

    # Get params from request
    try:
        publikovat = request.GET.get("pbl", None)
        if publikovat is None:
            return JsonResponse({"error": "Publikovat parameter is required"}, status=400)
    except Exception as ex:
        return JsonResponse({"error": f"There was a error getting publikovat parameter. Error: {ex}"}, status=400)
    
    # Update prislusenstvi publication state
    success = prislusenstvi_publication(prislusenstvi_id, publikovat)
    
    if success:
        return JsonResponse({"message": f"Prislusenstvi kod - {prislusenstvi_id} - publication state updated successfully"}, status=200)
    return JsonResponse({"error": "Failed to update prislusenstvi publication state"}, status=500)