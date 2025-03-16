# Brzdice RestAPI view definiton

# Imports
import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from GoldFrenAPI.Authentication.Auth_Permissions import IsInternalUser
from django.http import JsonResponse, HttpResponseBadRequest
from GoldFrenAPI.Services.Brzdice_Service import (
    get_brzdice as get_all_brzdice,
    get_brzdic,
    update_brzdic,
    create_brzdic
    )

# Function to get all brzdice
@api_view(['GET'])
def get_brzdice(request):
    """
    This function will return all brzdice from the database
    """
    # Get all adapters
    brzdice_objects = get_all_brzdice()
    brzdice = [brzdic.to_dict() for brzdic in brzdice_objects]
    return JsonResponse(brzdice, status=200, safe=False)

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
    
    # Create brzdic
    new_id = create_brzdic(data)
    if new_id:
        return JsonResponse({"message": "Brzdic created successfully", "brzdic_id": new_id}, status=201)
    return JsonResponse({"error": "Failed to create brzdic"}, status=500)