import base64
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
from .Auth_Serializers import GroupBasedTokenObtainPairSerializer, RegisterUserSerializer

class Login_View(TokenObtainPairView):
    serializer_class = GroupBasedTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        
        if not auth_header.startswith('Basic '):
            return JsonResponse({'Error': 'Nepřihlášený uživatel se pokusil o provolání API.'},
                                status=status.HTTP_401_UNAUTHORIZED)
        try:
            # Remove 'Basic ' prefix and decode credentials
            base64_credentials = auth_header.split(' ')[1]
            decoded_credentials = base64.b64decode(base64_credentials).decode('utf-8')
            username, password = decoded_credentials.split(':', 1)
        
        except Exception:
            return JsonResponse({'Error': 'Nepřihlášený uživatel se pokusil o provolání API.'},
                                status=status.HTTP_401_UNAUTHORIZED)
        
        # Create a mutable copy of request.data and inject the credentials.
        request_data = {'username': username, 'password': password}
        request._full_data = request_data
        
        return super().post(request, *args, **kwargs)
    
@api_view(['POST'])
@permission_classes([IsAdminUser])
def Register_User(request):
    """
    Register a new user. Only accessible by staff or superusers.
    """
    serializer = RegisterUserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response(
            {"message": "User created successfully", "user_id": user.id},
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)