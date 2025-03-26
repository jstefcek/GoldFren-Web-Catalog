# Brzdice RestAPI view definiton

# Imports
import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from GoldFrenAPI.Authentication.Auth_Permissions import IsInternalUser
from django.http import JsonResponse, HttpResponseBadRequest
from GoldFrenAPI.Services.Desticka_Service import (
    get_desticky as get_all_desticky,
    get_desticka,
    update_desticka,
    create_desticka
)

# Function to get all desticky
@api_view(['GET'])
def get_desticky(request):
    """
    This function will return all desticky
    """
    # Get all adapters
    desticky_objects = get_all_desticky()
    desticky = [desticka.to_dict() for desticka in desticky_objects]
    return JsonResponse(desticky, status=200, safe=False)

# Function to get a single desticka by ID
@api_view(['GET'])
def get_desticka_by_id(request, desticka_id):
    """
    This function returns a single desticka by ID.
    """
    desticka = get_desticka(desticka_id)
    if desticka:
        return JsonResponse(desticka.to_dict(), status=200)
    return JsonResponse({"error": "Desticka not found"}, status=404)

# Function to update an desticka 
@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsInternalUser])
def update_desticka_view(request, desticka_id):
    """
    This function updates an existing desticka.
    """
    try:
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
            success = update_desticka(desticka_id, data)
        except Exception as ex:
            raise ex

        if success:
            return JsonResponse({"message": "Desticka updated successfully"}, status=200)
        return JsonResponse({"error": "Failed to update adapter"}, status=500)
    except Exception as ex:
        raise ex

# Function to create a new desticka
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsInternalUser])
def create_desticka_view(request):
    """
    This function creates a new desticka.
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
    
    # Create desticka
    new_id = create_desticka(data)
    if new_id:
        return JsonResponse({"message": "Desticka created successfully", "desticka_id": new_id}, status=201)
    return JsonResponse({"error": "Failed to create desticka"}, status=500)