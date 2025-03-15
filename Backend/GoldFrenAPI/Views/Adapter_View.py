# Adapter RestAPI view definiton

# Imports
import json
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from GoldFrenAPI.Services.Adapter_Service import (
    get_adapters as get_all_adapters,
    get_adapter,
    update_adapter,
    create_adapter
)

# Function to get all adapters
def get_adapters(request):
    """
    This function will return all adapters from the database
    """
    # Get all adapters
    adapter_objects = get_all_adapters()
    adapters = [adapter.to_dict() for adapter in adapter_objects]
    return JsonResponse(adapters, status=200, safe=False)

# Function to get a single adapter by ID
def get_adapter_by_id(request, adapter_id):
    """
    This function returns a single adapter by ID.
    """
    adapter = get_adapter(adapter_id)
    if adapter:
        return JsonResponse(adapter.to_dict(), status=200)
    return JsonResponse({"error": "Adapter not found"}, status=404)

# Function to update an adapter
@csrf_exempt
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
    
    # Update adapter
    success = update_adapter(adapter_id, data)
    if success:
        return JsonResponse({"message": "Adapter updated successfully"}, status=200)
    return JsonResponse({"error": "Failed to update adapter"}, status=500)

# Function to create a new adapter
@csrf_exempt
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
    
    # Create adapter
    new_id = create_adapter(data)
    if new_id:
        return JsonResponse({"message": "Adapter created successfully", "adapter_id": new_id}, status=201)
    return JsonResponse({"error": "Failed to create adapter"}, status=500)