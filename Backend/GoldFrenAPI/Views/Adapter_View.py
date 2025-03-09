# Adapter RestAPI view definiton

# Imports
from django.http import JsonResponse
from GoldFrenAPI.Services.Adapter_Service import get_adapters as get_all_adapters

# Function to get all adapters
def get_adapters(request):
    """
    This function will return all adapters from the database
    """
    # Get all adapters
    adapter_objects = get_all_adapters()
    
    # Convert Adapter objects to dictionaries
    adapters = [adapter.to_dict() for adapter in adapter_objects]
    
    # Return JSON response
    return JsonResponse(adapters, status=200, safe=False)