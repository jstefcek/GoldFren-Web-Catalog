# Kotouc RestAPI view definiton

# Imports
import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from GoldFrenAPI.Authentication.Auth_Permissions import IsInternalUser
from django.http import JsonResponse, HttpResponseBadRequest
from GoldFrenAPI.utils.utils import (
    get_pagination,
    get_pagination_urls,
    get_total_count_with_params,
    get_total_count,                
)
from GoldFrenAPI.Services.Kotouc_Service import (
    get_kotouce as get_all_kotouce,
    get_kotouc,
    update_kotouc,
    create_kotouc,
    kotouc_publication,
    get_filtered_kotouce,
    get_vozidla_for_kotouc
)

# Function to get all koutce
@api_view(['GET'])
def get_kotouce(request):
    """
    This function will return all kotouce from the database with optional pagination.
    """
    try:
        # Get pagination parameters from request
        limit, page = get_pagination(request)
        
        # Try to get state parameter from request
        states = bool(request.GET.get("states", False))
    
        # If limit is set to 0 return all adapters
        if limit == 0:
            kotouce_objects = get_all_kotouce(states=states)
            if kotouce_objects:
                kotouce = [kotouc.to_dict() for kotouc in kotouce_objects]
                return JsonResponse({
                        "count": len(kotouce),
                        "data": kotouce
                    }, status=200)
                
        # Get destickas count
        total_kotouce = get_total_count("d_kotouce", states=states)
        
        # If limit is set to a number, return paginated destickas
        kotouce_objects = get_all_kotouce(limit=limit, page=page, states=states)
        kotouce = [kotouc.to_dict() for kotouc in kotouce_objects]
        
        # Construct next and previous page URLs
        next_url, prev_url = get_pagination_urls(request, limit, page, total_kotouce)
        return JsonResponse({
            "count": total_kotouce,
            "next": next_url,
            "previous": prev_url,
            "data": kotouce
        }, status=200)
    
    # Handle pagination errors
    except ValueError:
        return JsonResponse({"error": "Invalid pagination parameters. Limit and offset must be integers."}, status=400)

# Function to get a single kotouc by ID
@api_view(['GET'])
def get_kotouc_by_id(request, kotouc_id):
    """
    This function returns a single kotouc by ID.
    """
    kotouc = get_kotouc(kotouc_id)
    if kotouc:
        return JsonResponse(kotouc.to_dict(), status=200)
    return JsonResponse({"error": "Kotouc not found"}, status=404)

# Function to return kotouc that match specific parameters
@api_view(['GET'])
def get_filtered_kotouc_view(request):
    """
    This function returns kotouc that match specific parameters.
    """
    try:    
        # Get parameters from request
        vnejsi_prumer_min = request.GET.get("vnejsi_prumer_min", None)
        vnejsi_prumer_max = request.GET.get("vnejsi_prumer_max", None)
        roztecny_prumer_min = request.GET.get("roztecny_prumer_min", None)
        roztecny_prumer_max = request.GET.get("roztecny_prumer_max", None)
        vnitrni_prumer_min = request.GET.get("vnitrni_prumer_min", None)
        vnitrni_prumer_max = request.GET.get("vnitrni_prumer_max", None)
        tloustka_min = request.GET.get("tloustka_min", None)
        tloustka_max = request.GET.get("tloustka_max", None)
        typ = request.GET.get("typ", None)
        
        # Store params to dict
        filters = {
            "vnejsi_prumer": (vnejsi_prumer_min, vnejsi_prumer_max),
            "roztecny_prumer": (roztecny_prumer_min, roztecny_prumer_max),
            "vnitrni_prumer": (vnitrni_prumer_min, vnitrni_prumer_max),
            "tloustka": (tloustka_min, tloustka_max),
            "typ": typ
        }
        
        # Get pagination parameters from request 
        limit, page = get_pagination(request)
        
        # Try to get state parameter from request
        states = bool(request.GET.get("states", False))
    
        # If limit is set to 0 return all kotouce
        if limit == 0:
            kotouce_objects = get_filtered_kotouce(states=states, filters=filters)
            if kotouce_objects:
                kotouce = [kotouc for kotouc in kotouce_objects]
                return JsonResponse({
                    "count": len(kotouce),
                    "data": kotouce
                }, status=200)
        
        # If limit is set to a number, return paginated kotouce
        kotouce_objects = get_filtered_kotouce(limit=limit, page=page, states=states, filters=filters)
        if kotouce_objects:
            kotouce = [kotouc for kotouc in kotouce_objects]
            
            # Get filtered destickas count
            total_kotouce = get_total_count_with_params("""SELECT DISTINCT kod, cislo_dilu, obrazek, vektor, vnejsi_prumer, roztecny_prumer, vnitrni_prumer, tloustka, typ, pozice
                                                            FROM v_vozidlo_kotouc""", 
                                                        states=states, filters=filters)
            
            # Construct next and previous page URLs
            next_url, prev_url = get_pagination_urls(request, limit, page, total_kotouce)
            return JsonResponse({
                "count": total_kotouce,
                "next": next_url,
                "previous": prev_url,
                "data": kotouce
            }, status=200)
        else:
            return JsonResponse({"error": "No kotouce has been found.."}, status=404)

    # Handle pagination errors
    except ValueError:
        return JsonResponse({"error": "Invalid pagination parameters. Limit and offset must be integers."}, status=400)
    
# Function to get vozidla for a specific kotouc
@api_view(['GET'])
def get_vozidla_for_kotouc_view(request):
    """
    This function returns vozidla for a specific kotouc.
    """
    try:
        # Get parameters from request
        kotouc_id = request.GET.get("kotouc_id", None)
        if not kotouc_id:
            return JsonResponse({"error": "Missing kotouc_id parameter"}, status=400)
        
        # Get pagination parameters from request
        limit, page = get_pagination(request)
        
        # Try to get state parameter from request
        states = bool(request.GET.get("states", False))
        
        # If limit is set to 0 return all kotouc
        if limit == 0:
            vozidla_objects = get_vozidla_for_kotouc(kotouc_id=kotouc_id)
            if vozidla_objects:
                vozidla = [vozidlo.to_dict() for vozidlo in vozidla_objects]
                return JsonResponse({
                    "count": len(vozidla),
                    "data": vozidla
                }, status=200)
        
        # Get vozidla for the kotouc
        vozidla_objects = get_vozidla_for_kotouc(limit=limit, page=page, states=states, kotouc_id=kotouc_id)
        if vozidla_objects:
            vozidla = [vozidlo.to_dict() for vozidlo in vozidla_objects]
        
            # Get filtered kotouc count
            total_kotouce = get_total_count_with_params("SELECT * FROM v_vozidlo_kotouc",
                                                        states=states, filters={"kod": kotouc_id})
            
            # Construct next and previous page URLs
            next_url, prev_url = get_pagination_urls(request, limit, page, total_kotouce)
            return JsonResponse({
                "count": total_kotouce,
                "next": next_url,
                "previous": prev_url,
                "data": vozidla
            }, status=200)
            
        return JsonResponse({"error": "No vozidla found for this kotouc"}, status=404)
    
    except Exception as ex:
        return JsonResponse({"error": f"Error fetching vozidla: {str(ex)}"}, status=500)

# Function to update an kotouc
@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsInternalUser])
def update_kotouc_view(request, kotouc_id):
    """
    This function updates an existing adapter.
    """
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
        success = update_kotouc(kotouc_id, data)
    except Exception as ex:
        print(ex)

    if success:
        return JsonResponse({"message": "Kotouc updated successfully"}, status=200)
    return JsonResponse({"error": "Failed to update adapter"}, status=500)

# Function to create a new adapter
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsInternalUser])
def create_kotouc_view(request):
    """
    This function creates a new kotouc.
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
    
    # Create adapter
    new_id = create_kotouc(data)
    if new_id:
        return JsonResponse({"message": "Kotouc created successfully", "adapter_id": new_id}, status=201)
    return JsonResponse({"error": "Failed to create adapter"}, status=500)

# Change state of publikovat
@api_view(['PATCH'])
@permission_classes([IsAuthenticated, IsInternalUser])
def kotouc_publication_view(request, kotouc_id):
    """
    This function changes the state of publikovat for a kotouc.
    """
    if request.method != "PATCH":
        return HttpResponseBadRequest("Invalid request method")

    # Get params from request
    try:
        publikovat = request.GET.get("pbl", None)
        if publikovat is None:
            return JsonResponse({"error": "publikovat parameter is required"}, status=400)
    except Exception as ex:
        return JsonResponse({"error": f"There was a error getting publikovat parameter. Error: {ex}"}, status=400)
    
    # Update kotouc publication state
    success = kotouc_publication(kotouc_id, publikovat)
    
    if success:
        return JsonResponse({"message": f"Kotouc kod - {kotouc_id} - publication state updated successfully"}, status=200)
    return JsonResponse({"error": "Failed to update kotouc publication state"}, status=500)