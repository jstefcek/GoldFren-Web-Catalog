from rest_framework.permissions import IsAuthenticated
from GoldFrenAPI.Authentication.Auth_Permissions import IsInternalUser
from rest_framework.views import APIView
from rest_framework.response import Response
from GoldFrenAPI.Services.Image_Service import save_image_file
import logging

logger = logging.getLogger(__name__)

class ImageUploadView(APIView):
    permission_classes = [IsAuthenticated, IsInternalUser]

    def post(self, request):
        # Get data from request
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
        except ValueError as ex:
            return Response({'error': str(ex)}, status=400)
        except Exception as ex:
            logger.exception("Image upload failed: %s", type(ex).__name__)
            return Response({'error': 'Failed to upload image'}, status=500)

        # Return the URL of the saved image
        return Response({'url': absolute_url, 'image_url_path': image_url}, status=200)
