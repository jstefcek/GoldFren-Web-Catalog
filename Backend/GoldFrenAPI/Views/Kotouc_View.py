# Kotouc RestAPI view definiton

# Imports
import json
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from GoldFrenAPI.Services.Kotouc_Service import (
    get_kotouce as get_all_kotouce,
    get_kotouc,
    update_kotouc,
    create_kotouc
)

# Function to get all koutce
def get_kotouce(request):
    """
    This function will return all kotouce from the database
    """
    # Get all adapters
    kotouce_objects = get_all_kotouce()
    kotouce = [kotouc.to_dict() for kotouc in kotouce_objects]
    return JsonResponse(kotouce, status=200, safe=False)

# Function to get a single kotouc by ID
def get_kotouc_by_id(request, kotouc_id):
    """
    This function returns a single kotouc by ID.
    """
    kotouc = get_kotouc(kotouc_id)
    if kotouc:
        return JsonResponse(kotouc.to_dict(), status=200)
    return JsonResponse({"error": "Kotouc not found"}, status=404)

# Function to update an kotouc
@csrf_exempt
def update_kotouc_view(request, kotouc_id):
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
    try:
        success = update_kotouc(kotouc_id, data)
    except Exception as ex:
        print(ex)

    if success:
        return JsonResponse({"message": "Kotouc updated successfully"}, status=200)
    return JsonResponse({"error": "Failed to update adapter"}, status=500)

# Function to create a new adapter
@csrf_exempt
def create_kotouc_view(request):
    """
    This function creates a new kotouc.
    """
    if request.method != "POST":
        return HttpResponseBadRequest("Invalid request method")

    # Parse JSON request body
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    
    # Create adapter
    new_id = create_kotouc(data)
    if new_id:
        return JsonResponse({"message": "Kotouc created successfully", "adapter_id": new_id}, status=201)
    return JsonResponse({"error": "Failed to create adapter"}, status=500)