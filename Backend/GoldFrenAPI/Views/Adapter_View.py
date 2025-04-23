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
    get_total_count_with_params,
    get_pagination_urls
)
from GoldFrenAPI.Services.Adapter_Service import (
    get_adapters as get_all_adapters,
    get_adapter,
    update_adapter,
    create_adapter,
    adapter_publication,
    get_filtered_adapters,
    get_vozidla_for_adapter
)

# Function to get all adapters
@api_view(['GET'])
def get_adapters(request):
    """
    This function will return all adapters from the database with optional pagination.
    """
    try:
        # Get pagination parameters from request
        limit, page = get_pagination(request)
        
        # Try to get state parameter from request
        states = bool(request.GET.get("states", False))
    
        # If limit is set to 0 return all adapters
        if limit == 0:
            adapter_objects = get_all_adapters(states=states)
            adapters = [adapter.to_dict() for adapter in adapter_objects]
            return JsonResponse({
                "count": len(adapters),
                "data": adapters
            }, status=200)
        
        # Get adapters count
        total_adapters = get_total_count("d_adapter", states=states)
        
        # If limit is set to a number, return paginated adapters
        adapter_objects = get_all_adapters(limit=limit, page=page, states=states)
        adapters = [adapter.to_dict() for adapter in adapter_objects]
        
        # Construct next and previous page URLs
        next_url, prev_url = get_pagination_urls(request, limit, page, total_adapters)
        return JsonResponse({
            "count": total_adapters,
            "next": next_url,
            "previous": prev_url,
            "data": adapters
        }, status=200)

    # Handle pagination errors
    except ValueError:
        return JsonResponse({"error": "Invalid pagination parameters. Limit and offset must be integers."}, status=400)

# Function to get a single adapter by ID
@api_view(['GET'])
def get_adapter_by_id(request, adapter_id):
    """
    This function returns a single adapter by ID.
    """
    adapter = get_adapter(adapter_id)
    if adapter:
        return JsonResponse(adapter.to_dict(), status=200)
    return JsonResponse({"error": "Adapter not found"}, status=404)

# Function to return adapters that match specific parameters
@api_view(['GET'])
def get_filtered_adapters_view(request):
    """
    This function returns adapters that match specific parameters.
    """
    try:    
        # Get parameters from request
        pozice = request.GET.get("pozice", None)
        prumer_min = request.GET.get("prumer_min", None)
        prumer_max = request.GET.get("prumer_max", None)
        uchyceni = request.GET.get("typ_uchyceni", None)
        roztec_min = request.GET.get("roztec_min", None)
        roztec_max = request.GET.get("roztec_max", None)
        
        # Checks if parameters are provided
        if not pozice:
            return JsonResponse({"error": "pozice parameter is required"}, status=400)
        if not prumer_min:
            return JsonResponse({"error": "prumer_min parameter is required"}, status=400)
        if not prumer_max:
            return JsonResponse({"error": "prumer_max parameter is required"}, status=400)
        
        # Store params to dict
        filters = {
            "pozice": pozice,
            "prumer": (prumer_min, prumer_max),
            "typ_uchyceni": uchyceni,
            "roztec_brzdic": (roztec_min, roztec_max)
        }
        
        # Get pagination parameters from request
        limit, page = get_pagination(request)
        
        # Try to get state parameter from request
        states = bool(request.GET.get("states", False))
    
        # If limit is set to 0 return all adapters
        if limit == 0:
            adapter_objects = get_filtered_adapters(states=states, filters=filters)
            adapters = [adapter for adapter in adapter_objects]
            return JsonResponse({
                "count": len(adapters),
                "data": adapters
            }, status=200)
        
        # If limit is set to a number, return paginated adapters
        adapter_objects = get_filtered_adapters(limit=limit, page=page, states=states, filters=filters)
        if adapter_objects:
            adapters = [adapter for adapter in adapter_objects]
            
            # Get filtered adapters count
            total_adapters = get_total_count_with_params("SELECT DISTINCT kod, cislo_dilu, pozice, prumer, typ_uchyceni, roztec_brzdic FROM v_vozidlo_adapter", 
                                                        states=states, filters=filters)
            
            # Construct next and previous page URLs
            next_url, prev_url = get_pagination_urls(request, limit, page, total_adapters)
            
            return JsonResponse({
                "count": total_adapters,
                "next": next_url,
                "previous": prev_url,
                "data": adapters
            }, status=200)
        else:
            return JsonResponse({"error": "No adapter has been found.."}, status=404)

    # Handle pagination errors
    except ValueError:
        return JsonResponse({"error": "Invalid pagination parameters. Limit and offset must be integers."}, status=400)
    
# Function to get vozidla for a specific adapter
@api_view(['GET'])
def get_vozidla_for_adapter_view(request):
    """
    This function returns vozidla for a specific adapter.
    """
    try:
        # Get parameters from request
        adapter_id = request.GET.get("adapter_id", None)
        
        # Get pagination parameters from request
        limit, page = get_pagination(request)
        
        # Try to get state parameter from request
        states = bool(request.GET.get("states", False))
        
        # If limit is set to 0 return all adapters
        if limit == 0:
            adapter_objects = get_vozidla_for_adapter(adapter_id=adapter_id)
            adapters = [adapter.to_dict() for adapter in adapter_objects]
            return JsonResponse({
                "count": len(adapters),
                "data": adapters
            }, status=200)
        
        # Get vozidla for the adapter
        vozidla_objects = get_vozidla_for_adapter(limit=limit, page=page, states=states, adapter_id=adapter_id)
        if vozidla_objects:
            vozidla = [vozidlo.to_dict() for vozidlo in vozidla_objects]
        
            # Get filtered adapters count
            total_adapters = get_total_count_with_params("SELECT * FROM v_vozidlo_adapter",
                                                        states=states, filters={"kod": adapter_id})
            
            # Construct next and previous page URLs
            next_url, prev_url = get_pagination_urls(request, limit, page, total_adapters)
            
            return JsonResponse({
                "count": total_adapters,
                "next": next_url,
                "previous": prev_url,
                "data": vozidla
            }, status=200)
            
        return JsonResponse({"error": "No vozidla found for this adapter"}, status=404)
    
    except Exception as ex:
        return JsonResponse({"error": f"Error fetching vozidla: {str(ex)}"}, status=500)
    
# Function to update an adapter
@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsInternalUser])
def update_adapter_view(request, adapter_id):
    """
    This function updates an existing adapter.
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
    
    # Update adapter
    success = update_adapter(adapter_id, data)
    if success:
        return JsonResponse({"message": "Adapter updated successfully"}, status=200)
    return JsonResponse({"error": "Failed to update adapter"}, status=500)

# Function to create a new adapter
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsInternalUser])
def create_adapter_view(request):
    """
    This function creates a new adapter.
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
    new_id = create_adapter(data)
    if new_id:
        return JsonResponse({"message": "Adapter created successfully", "adapter_id": new_id}, status=201)
    return JsonResponse({"error": "Failed to create adapter"}, status=500)

# Change state of publikovat
@api_view(['PATCH'])
@permission_classes([IsAuthenticated, IsInternalUser])
def adapter_publication_view(request, adapter_id):
    """
    This function changes the state of publikovat for a adapter.
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
    
    # Update adapter publication state
    success = adapter_publication(adapter_id, publikovat)
    
    if success:
        return JsonResponse({"message": f"Adapter kod - {adapter_id} - publication state updated successfully"}, status=200)
    return JsonResponse({"error": "Failed to update adapter publication state"}, status=500)