import json
from django.http import JsonResponse
from rest_framework.decorators import api_view
from GoldFrenAPI.Services.Vozidla_Service import (
    get_vyrobce_by_kategorie,
    get_vozidlo_filtered
)

# Function to return all vyrobce by kategorie ID
@api_view(['GET'])
def get_vyrobce_names(request):
    """
    This function returns all vyrobce by kategorie ID
    """
    kategorie_kod = request.GET.get("kategorie_kod")
    if not kategorie_kod:
        return JsonResponse({"error": "kategorie_kod is required"}, status=400)
    
    vyrobce_objects = get_vyrobce_by_kategorie(kategorie_kod)
    if vyrobce_objects:
        vyrobce_list = [vyrobce.to_dict() for vyrobce in vyrobce_objects]
        return JsonResponse(vyrobce_list, safe=False, status=200)
    return JsonResponse({"error": "Vyrobce not found"}, status=404)

# Function to get vozidlo filtered by kategorie_id, vyrobce_id, objem, model, rok_vyroby
@api_view(['GET'])
def get_vozidlo_filtered_view(request):
    """
    This function returns vozidlo or vozidla filtered by kategorie_kod, vyrobce_kod, objem, model, rok_vyroby
    """
    kategorie_kod = request.GET.get("kategorie_kod", None)
    vyrobce_kod = request.GET.get("vyrobce_kod", None)
    objem = request.GET.get("objem", None)
    model = request.GET.get("model", None)
    rok_vyroby = request.GET.get("rok_vyroby", None)
    
    if not kategorie_kod:
        return JsonResponse({"error": "kategorie_id is required"}, status=400)
    if not vyrobce_kod:
        return JsonResponse({"error": "vyrobce_id is required"}, status=400)
    
    vozidla_objects = get_vozidlo_filtered(kategorie_kod, vyrobce_kod, objem, model, rok_vyroby)
    if vozidla_objects:
        vozidla_list = [vozidlo.to_dict() for vozidlo in vozidla_objects]
        return JsonResponse(vozidla_list, safe=False, status=200)
    return JsonResponse({"error": "Vozidlo not found"}, status=404)