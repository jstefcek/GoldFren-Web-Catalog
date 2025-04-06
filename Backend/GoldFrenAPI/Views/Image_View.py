from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from GoldFrenAPI.Authentication.Auth_Permissions import IsInternalUser
from rest_framework.views import APIView
from rest_framework.response import Response
from GoldFrenAPI.Services.Image_Service import save_image_file

class ImageUploadView(APIView):

    @permission_classes([IsAuthenticated, IsInternalUser])
    def post(self, request):
        # Get data from requestß
        sortiment = request.data.get('sortiment')
        file_type = request.data.get('file_type')
        component_id = request.data.get('component_id')
        file_object = request.FILES.get('file_object')

        # Validate required fields
        if not all([sortiment, file_type, component_id, file_object]):
            return Response({'error': 'Missing fields'}, status=400)

        # Try to save the image file and get the URL
        try: 
            image_url = save_image_file(sortiment, file_object, file_type, component_id)
            absolute_url = request.build_absolute_uri(image_url)
        except Exception as ex:
            return Response({'error': str(ex)}, status=500)

        # Return the URL of the saved image
        return Response({'url': absolute_url}, status=200)
