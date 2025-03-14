# Brzdice RestAPI view definiton

# Imports
from django.http import JsonResponse
from GoldFrenAPI.Services.Desticka_Service import get_desticky as get_all_desticky

# Function to get all brzdice
def get_desticky(request):
    """
    This function will return all brzdice from the database
    """
    # Get all adapters
    desticky_objects = get_all_desticky()
    
    # Convert Adapter objects to dictionaries
    desticky = [desticka.to_dict() for desticka in desticky_objects]
    
    # Return JSON response
    return JsonResponse(desticky, status=200, safe=False)