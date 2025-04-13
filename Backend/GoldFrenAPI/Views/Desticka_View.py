# Brzdice RestAPI view definiton

# Imports
import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from GoldFrenAPI.Authentication.Auth_Permissions import IsInternalUser
from django.http import JsonResponse, HttpResponseBadRequest
from GoldFrenAPI.utils.utils import get_pagination
from GoldFrenAPI.Services.Desticka_Service import (
    get_desticky as get_all_desticky,
    get_desticka,
    update_desticka,
    create_desticka,
    desticka_publication
)

# Function to get all desticky
@api_view(['GET'])
def get_desticky(request):
    """
    This function will return all desticky with optional pagination.
    """
    try:
        # Get pagination parameters from request
        limit, page = get_pagination(request)
        
        # Try to get state parameter from request
        states = bool(request.GET.get("states", False))
    
        # If limit is set to 0 return all adapters
        if limit == 0:
            desticky_objects = get_all_desticky(states=states)
            desticky = [desticka.to_dict() for desticka in desticky_objects]
            return JsonResponse(desticky, status=200, safe=False)
        
        # If limit is set to a number, return paginated adapters
        desticky_objects = get_all_desticky(limit=limit, page=page, states=states)
        desticky = [desticka.to_dict() for desticka in desticky_objects]
        return JsonResponse(desticky, status=200, safe=False)
    
    # Handle pagination errors
    except ValueError:
        return JsonResponse({"error": "Invalid pagination parameters. Limit and offset must be integers."}, status=400)

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

# Change state of publikovat
@api_view(['PATCH'])
@permission_classes([IsAuthenticated, IsInternalUser])
def desticka_publication_view(request, desticka_id):
    """
    This function changes the state of publikovat for a desticka.
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
    
    # Update desticka publication state
    success = desticka_publication(desticka_id, publikovat)
    
    if success:
        return JsonResponse({"message": f"Desticka kod - {desticka_id} - publication state updated successfully"}, status=200)
    return JsonResponse({"error": "Failed to update desticka publication state"}, status=500)