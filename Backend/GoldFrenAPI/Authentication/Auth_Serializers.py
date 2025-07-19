from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.contrib.auth.models import User, Group
from django.utils import timezone
from datetime import timedelta
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Custom TokenObtainPairSerializer to add user details to the response.
class GroupBasedTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
       
        # Remove the refresh token from the response
        data.pop('refresh', None)
        token = self.get_token(self.user)
        group = token['group']
        
        # Base response data that's common for all users
        base_data = {
            'generated': timezone.now(),
            'expire': token['exp'],
            'lifetime_seconds': token['lifetime_seconds'],
            'expire_date': timezone.now() + timedelta(seconds=token['lifetime_seconds']),
        }
        
        # Only add user information if the user is not in the External group
        if group != "External":
            base_data['user'] = {
                'id': self.user.id,
                'username': self.user.username,
                'first_name': self.user.first_name,
                'last_name': self.user.last_name,
                'email': self.user.email,
                'isAdmin': self.user.is_staff,
                'isActive': self.user.is_active,
                'isInternal': self.user.groups.filter(name="Internal").exists(),
                }
        
        # Update the response data with our customized fields
        data.update(base_data)
        return data

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Check user groups and set token lifetime accordingly.
        if user.groups.filter(name="External").exists():
            lifetime_seconds = int(os.getenv("EXTERNAL_TOKEN_LIFETIME", "1800"))
            group = "External"
        elif user.groups.filter(name="Internal").exists():
            lifetime_seconds = int(os.getenv("INTERNAL_TOKEN_LIFETIME", "10800"))
            group = "Internal"
        else:
            raise ValueError("User is not in a valid group")
        token.set_exp(from_time=timezone.now(), lifetime=timedelta(seconds=lifetime_seconds))
        
        # Add token lifetime and group to token
        token['lifetime_seconds'] = lifetime_seconds
        token['group'] = group
        
        # Return updated token
        return token

# Register User    
class RegisterUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('username', 'password', 'first_name', 'last_name', 'email')
    
    def create(self, validated_data):
        # Create a new user with the validated data
        user = User.objects.create_user(**validated_data)
        
        # Add user to the 'Internal' group
        external_group = Group.objects.get(name='Internal')
        user.groups.add(external_group)
        
        # Return user object
        return user
    
# Custom class to change password
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate(self, data):
        user = self.context['request'].user
        # Validate old password
        if not user.check_password(data['old_password']):
            raise serializers.ValidationError({"old_password": "Old password is incorrect"})

        # Validate new password
        if data['old_password'] == data['new_password']:
            raise serializers.ValidationError({"new_password": "New password cannot be the same as old password"})
        
        # Validate new password against Django's password validation rules
        try:
            validate_password(data['new_password'], user)
        except DjangoValidationError as e:
            raise serializers.ValidationError({"new_password": e.messages})

        return data

    def save(self):
        # Get the user from the request context and save the new password
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user
    
# Custom serializer to return user details for admin dashboard
class UserSerializer(serializers.ModelSerializer):
    """
    Returns user details including groups and validity status for display in admin dashboard
    """
    groups = serializers.SlugRelatedField(
        many=True, slug_field='name', read_only=True
    )
    is_valid = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'is_staff', 'groups', 'is_valid', 'date_joined', 'last_login']

    def get_is_valid(self, obj):
        return obj.is_active