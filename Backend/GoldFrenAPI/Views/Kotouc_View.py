# Kotouc RestAPI view definiton

# Imports
import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from GoldFrenAPI.Authentication.Auth_Permissions import IsInternalUser
from django.http import JsonResponse, HttpResponseBadRequest
from GoldFrenAPI.Services.Kotouc_Service import (
    get_kotouce as get_all_kotouce,
    get_kotouc,
    update_kotouc,
    create_kotouc,
    kotouc_publication
)

# Change state of publikovat
@api_view(['PATCH'])
@permission_classes([IsAuthenticated, IsInternalUser])
def kotouc_publication_view(request, kotouc_id):
    """
    This function changes the state of publikovat for a kotouc.
    """
    if request.method != "PATCH":
        return HttpResponseBadRequest("Invalid request method")

    # Get params from request
    try:
        publikovat = request.GET.get("publikovat", None)
        if publikovat is None:
            return JsonResponse({"error": "publikovat parameter is required"}, status=400)
    except Exception as ex:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    
    # Update kotouc publication state
    success = kotouc_publication(kotouc_id, publikovat)
    
    if success:
        return JsonResponse({"message": "Kotouc publication state updated successfully"}, status=200)
    return JsonResponse({"error": "Failed to update kotouc publication state"}, status=500)

# Function to get all koutce
@api_view(['GET'])
def get_kotouce(request):
    """
    This function will return all kotouce from the database
    """
    # Get all adapters
    kotouce_objects = get_all_kotouce()
    kotouce = [kotouc.to_dict() for kotouc in kotouce_objects]
    return JsonResponse(kotouce, status=200, safe=False)

# Function to get a single kotouc by ID
@api_view(['GET'])
def get_kotouc_by_id(request, kotouc_id):
    """
    This function returns a single kotouc by ID.
    """
    kotouc = get_kotouc(kotouc_id)
    if kotouc:
        return JsonResponse(kotouc.to_dict(), status=200)
    return JsonResponse({"error": "Kotouc not found"}, status=404)

# Function to update an kotouc
@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsInternalUser])
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
    
    # Get user id from request
    user = request.user
    data["aktualizoval"] = user.id
    
    # Update adapter
    try:
        success = update_kotouc(kotouc_id, data)
    except Exception as ex:
        print(ex)

    if success:
        return JsonResponse({"message": "Kotouc updated successfully"}, status=200)
    return JsonResponse({"error": "Failed to update adapter"}, status=500)

# Function to create a new adapter
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsInternalUser])
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
    
    # Get user id from request
    user = request.user
    data["aktualizoval"] = user.id
    
    # Create adapter
    new_id = create_kotouc(data)
    if new_id:
        return JsonResponse({"message": "Kotouc created successfully", "adapter_id": new_id}, status=201)
    return JsonResponse({"error": "Failed to create adapter"}, status=500)