# Adapter RestAPI view definiton

# Imports
import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from GoldFrenAPI.Authentication.Auth_Permissions import IsInternalUser
from django.http import JsonResponse, HttpResponseBadRequest
from rest_framework.pagination import LimitOffsetPagination
from GoldFrenAPI.Services.Adapter_Service import (
    get_adapters as get_all_adapters,
    get_adapter,
    update_adapter,
    create_adapter,
    adapter_publication
)

# Function to get all adapters
@api_view(['GET'])
def get_adapters(request):
    """
    This function will return all adapters from the database with optional pagination.
    """
    # Get pagination parameters, defaulting to 25 items per page
    try:
        # Get limit and offset from request
        req_limit = request.GET.get('limit')
        req_page = request.GET.get('page', 1)
        
        # Validate and convert parameters
        limit = int(req_limit) if req_limit is not None else 25
        page = int(req_page) if req_page is not None else 1
        
        # Ensure positive values
        limit = max(0, limit)
        page = max(0, page)
    
        # If limit is set to 0 return all adapters
        if limit == 0:
            adapter_objects = get_all_adapters()
            adapters = [adapter.to_dict() for adapter in adapter_objects]
            return JsonResponse(adapters, status=200, safe=False)
        
        # If limit is set to a number, return paginated adapters
        adapter_objects = get_all_adapters(limit=limit, page=page)
        adapters = [adapter.to_dict() for adapter in adapter_objects]
        return JsonResponse(adapters, status=200, safe=False)

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