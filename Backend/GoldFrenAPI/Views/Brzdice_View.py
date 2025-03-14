# Brzdice RestAPI view definiton

# Imports
from django.http import JsonResponse
from GoldFrenAPI.Services.Brzdice_Service import get_brzdice as get_all_brzdice

# Function to get all brzdice
def get_brzdice(request):
    """
    This function will return all brzdice from the database
    """
    # Get all adapters
    brzdice_objects = get_all_brzdice()
    
    # Convert Adapter objects to dictionaries
    brzdice = [brzdic.to_dict() for brzdic in brzdice_objects]
    
    # Return JSON response
    return JsonResponse(brzdice, status=200, safe=False)