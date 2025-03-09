# Adapter RestAPI view definiton

# Imports
from django.http import JsonResponse
from GoldFrenAPI.Services.Adapter_Service import get_adapters as get_all_adapters

# Function to get all adapters
def get_adapters(request):
    """
    This function will return all adapters from the database
    """
    adapter_objects = get_all_adapters()
    
    # Convert Adapter objects to dictionaries
    adapters = [adapter.to_dict() for adapter in adapter_objects]
    
    return JsonResponse(adapters, status=200, safe=False)