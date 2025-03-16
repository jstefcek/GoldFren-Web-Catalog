import base64
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
import logging
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
from .Auth_Serializers import GroupBasedTokenObtainPairSerializer, RegisterUserSerializer

class Login_View(TokenObtainPairView):
    serializer_class = GroupBasedTokenObtainPairSerializer
    
    def post(self, request, *args, **kwargs):
        logger = logging.getLogger(__name__)
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        
        error_response = Response(
            {'error': 'Unauthorized access attempt'},  # Changed to English but keep as needed
            status=status.HTTP_401_UNAUTHORIZED
        )
        
        if not auth_header.startswith('Basic '):
            logger.warning("Authentication attempt without Basic auth header")
            return error_response
        
        try:
            # Remove 'Basic ' prefix and decode credentials
            base64_credentials = auth_header.split(' ')[1]
            decoded_credentials = base64.b64decode(base64_credentials).decode('utf-8')
            
            # Verify the decoded credentials contain a colon for splitting
            if ':' not in decoded_credentials:
                logger.warning("Malformed credentials: missing separator")
                return error_response
                
            username, password = decoded_credentials.split(':', 1)
            
            # Validate that username and password are not empty
            if not username or not password:
                logger.warning("Empty username or password provided")
                return error_response
        
        except (IndexError, base64.binascii.Error, UnicodeDecodeError) as e:
            logger.exception(f"Error decoding credentials: {type(e).__name__}")
            return error_response
        
        # Create a mutable copy of request.data and inject the credentials
        request._full_data = {'username': username, 'password': password}
        
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