from rest_framework.permissions import BasePermission

class IsInternalUser(BasePermission):
    """
    Allows access only to users in the 'Internal' group.
    """
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.groups.filter(name='Internal').exists()
        )

class IsExternalUser(BasePermission):
    """
    Allows access only to users in the 'External' group.
    """
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.groups.filter(name='External').exists()
        )
