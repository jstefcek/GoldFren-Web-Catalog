from django.http import JsonResponse
from rest_framework.decorators import api_view
from GoldFrenAPI.Services.Sortiment_Service import (
    get_sortiment_for_vyrobce
)

@api_view(['GET'])
def get_sortiment_for_vyrobce_view(request):
    # Get the vozidlo_kod from the request
    vyrobce_kod = request.GET.get("vyrobce_kod")
    if not vyrobce_kod:
        return JsonResponse({"error": "vyrobce_kod is required"}, status=400)

    try:
        vozidlo_id = int(vyrobce_kod)
    except ValueError:
        return JsonResponse({"error": "vyrobce_kod must be an integer"}, status=400)

    # Fetch the sortiment for specific vyrobce name
    data = get_sortiment_for_vyrobce(vozidlo_id)
    if not data:
        return JsonResponse({"message": "No sortiment data found for vyrobce"}, status=404)
    return JsonResponse(data, safe=False, status=200)