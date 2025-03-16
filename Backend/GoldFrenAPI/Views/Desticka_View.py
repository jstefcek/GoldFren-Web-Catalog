# Brzdice RestAPI view definiton

# Imports
import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from GoldFrenAPI.Authentication.Auth_Permissions import IsInternalUser
from django.http import JsonResponse, HttpResponseBadRequest
from GoldFrenAPI.Services.Desticka_Service import get_desticky as get_all_desticky

# Function to get all brzdice
@api_view(['GET'])
def get_desticky(request):
    """
    This function will return all brzdice from the database
    """
    # Get all adapters
    desticky_objects = get_all_desticky()
    desticky = [desticka.to_dict() for desticka in desticky_objects]
    return JsonResponse(desticky, status=200, safe=False)