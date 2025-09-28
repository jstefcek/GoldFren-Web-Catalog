import base64
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.exceptions import AuthenticationFailed, PermissionDenied
import logging
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.views import TokenVerifyView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework import status
from .Auth_Serializers import GroupBasedTokenObtainPairSerializer, RegisterUserSerializer, ChangePasswordSerializer
from GoldFrenAPI.Authentication.Auth_Permissions import IsInternalUser
from GoldFrenAPI.Authentication.Auth_Serializers import UserSerializer
from django.contrib.auth.models import User, Group

class Login_View(TokenObtainPairView):
    serializer_class = GroupBasedTokenObtainPairSerializer
    
    def post(self, request, *args, **kwargs):
        logger = logging.getLogger(__name__)
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        
        error_response = Response( {'error': 'Unauthorized access attempt'},  status=status.HTTP_401_UNAUTHORIZED)
        
        # Check is Basic auth header is present
        if not auth_header.startswith('Basic '):
            logger.warning("Authentication attempt without Basic auth header")
            return error_response
        
        try:
            # Remove 'Basic ' prefix and decode credentials
            base64_credentials = auth_header.split(' ')[1]
            decoded_credentials = base64.b64decode(base64_credentials).decode('utf-8')
            
            # Verify if there is : separator in the decoded credentials
            if ':' not in decoded_credentials:
                logger.warning("Malformed credentials: missing separator")
                return error_response
            
            # Gets username and password from decoded credentials
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
    
    # Check if the serializer is valid
    if serializer.is_valid():
        user = serializer.save()
        return Response({"message": "User created successfully", "user_id": user.id}, status=status.HTTP_201_CREATED)
    
    # Return the errors if the serializer is not valid
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsInternalUser])  
def change_user_password(request):
    """
    Allows an authenticated user to change their own password.
    """
    serializer = ChangePasswordSerializer(data=request.data, context={'request': request})

    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Password changed successfully"}, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAdminUser, IsAuthenticated])
def get_users(request):
    """
    Returns a list of all users with their details.
    Optional query param 'group' can filter users by group name.
    Example: group=Internal or group=External
    """
    # Get the group name from query params
    group_name = request.query_params.get('group', None)

    # Check if group name is specified
    if group_name:
        try:
            group = Group.objects.get(name=group_name)
            users = User.objects.filter(groups=group)
            
            # Remove user that made request
            users = users.exclude(id=request.user.id)
        except Group.DoesNotExist:
            return Response({"detail": f"Group '{group_name}' not found."}, status=status.HTTP_404_NOT_FOUND)
    else:
        users = User.objects.all()

    serializer = UserSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


class AdminTokenVerifyView(TokenVerifyView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated, IsAdminUser)

    def post(self, request, *args, **kwargs):
        token = request.data.get("token")
        if not token:
            raise AuthenticationFailed("Token payload is required.")

        try:
            UntypedToken(token)
        except InvalidToken as exc:
            raise AuthenticationFailed("Invalid or expired token supplied.") from exc

        if request.auth is None:
            raise AuthenticationFailed("Missing authentication token in request.")

        request_token = getattr(request.auth, "token", None)
        if request_token is None:
            request_token = str(request.auth)

        if request_token != token:
            raise AuthenticationFailed("Supplied token does not match the authenticated session.")

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        if not user.is_active:
            raise PermissionDenied("User account is inactive.")

        return Response({
            "detail": "Token is valid",
            "user": {
                "username": user.username,
                "is_active": user.is_active,
                "is_staff": user.is_staff,
            }
        }, status=status.HTTP_200_OK)

