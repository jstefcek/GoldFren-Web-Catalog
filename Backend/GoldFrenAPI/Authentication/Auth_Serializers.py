from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
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
        # Remove the refresh token from the response.
        data.pop('refresh', None)
        token = self.get_token(self.user)
        data.update({
            'user': {
                'id': self.user.id,
                'first_name': self.user.first_name,
                'last_name': self.user.last_name,
                'email': self.user.email,
                'group': token['group'],
            },
            'generated': timezone.now(),
            'expire': token['exp'],
            'lifetime_seconds': token['lifetime_seconds'],
            'expire_date': timezone.now() + timedelta(seconds=token['lifetime_seconds']),
        })
        return data

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Check user groups and set token lifetime accordingly.
        if user.groups.filter(name="External").exists():
            lifetime_seconds = int(os.getenv("EXTERNAL_TOKEN_LIFETIME", "300"))
            group = "External"
        elif user.groups.filter(name="Internal").exists():
            lifetime_seconds = int(os.getenv("INTERNAL_TOKEN_LIFETIME", "1800"))
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
        
        # Add user to the 'External' group
        external_group = Group.objects.get(name='Internal')
        user.groups.add(external_group)
        
        # Return user object
        return user