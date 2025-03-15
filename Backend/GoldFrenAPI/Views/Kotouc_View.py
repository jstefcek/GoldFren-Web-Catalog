# Kotouc RestAPI view definiton

# Imports
from django.http import JsonResponse
from GoldFrenAPI.Services.Kotouc_Service import get_kotouce as get_all_kotouce

# Function to get all adapters
def get_kotouce(request):
    """
    This function will return all kotouce from the database
    """
    # Get all adapters
    kotouce_objects = get_all_kotouce()
    
    # Convert Adapter objects to dictionaries
    kotouce = [kotouc.to_dict() for kotouc in kotouce_objects]
    
    # Return JSON response
    return JsonResponse(kotouce, status=200, safe=False)