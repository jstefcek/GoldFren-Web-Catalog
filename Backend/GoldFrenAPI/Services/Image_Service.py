import os
import io
import re
from django.conf import settings
from django.core.files.uploadedfile import InMemoryUploadedFile
from PIL import Image

ALLOWED_SORTIMENT = {
    "adaptery",
    "brzdice",
    "desticky",
    "hadicky",
    "kotouce",
    "pumpy",
    "prislusenstvi",
}
ALLOWED_FILE_TYPES = {"image", "vector"}
SAFE_COMPONENT_ID = re.compile(r"^[A-Za-z0-9_-]+$")


def save_image_file(sortiment: str, file_object, file_type: str, component_id: str) -> str:
    """Save an image or vector file to the server file system"""
    sortiment = str(sortiment).strip()
    file_type = str(file_type).strip()
    component_id = str(component_id).strip()

    # Validate file type
    if file_type not in ALLOWED_FILE_TYPES:
        raise ValueError("Invalid file type. Must be 'image' or 'vector'.")

    # Gets sortiment
    if sortiment not in ALLOWED_SORTIMENT:
        raise ValueError("Invalid sortiment.")

    if not SAFE_COMPONENT_ID.fullmatch(component_id):
        raise ValueError("Invalid component ID.")

    # Validate file file extension
    file_ext = os.path.splitext(file_object.name)[1].lower()
    if file_type == 'image':
        if file_ext not in ['.jpg', '.jpeg', '.png']:
            raise ValueError("Unsupported file extension for image")
    elif file_type == 'vector':
        if file_ext not in ['.svg', '.jpg', '.jpeg', '.png']:
            raise ValueError("Unsupported file extension for vector")
    else:
        raise ValueError("Unsupported file type")

    # Use component_id as filename
    filename = f"{component_id}{file_ext}"
    
    media_root = os.path.abspath(settings.MEDIA_ROOT)
    dir_path = os.path.abspath(os.path.join(media_root, sortiment, file_type))
    if not dir_path.startswith(media_root + os.sep):
        raise ValueError("Invalid upload path.")

    file_path = os.path.join(dir_path, filename)

    # Create the directory
    os.makedirs(dir_path, exist_ok=True)
    
    # Remove existing file with different extension if it exists 
    for existing_ext in ['.jpg', '.jpeg', '.png', '.svg']:
        if existing_ext != file_ext:
            existing_file = os.path.join(dir_path, f"{component_id}{existing_ext}")
            if os.path.exists(existing_file):
                os.remove(existing_file)
    
    # Optimize the file
    file_object = optimize_image(file_object, file_ext)
    
    # Save as new file
    with open(file_path, 'wb+') as file:
        for chunk in file_object.chunks():
            file.write(chunk)

    # Return the URL of the saved file
    return f"{settings.MEDIA_URL}{sortiment}/{file_type}/{filename}"

def optimize_image(file_object, file_ext: str):
    """Optimize file for optimal file size"""
    file_ext = file_ext.removeprefix('.')
    
    # Check which file extension we are working with and optimize file
    if file_ext == 'png':
        image = Image.open(file_object)
        output = io.BytesIO()
        image.save(output, format='PNG', optimize=True, compress_level=7)
        output.seek(0)
        return InMemoryUploadedFile(output, 'ImageField', file_object.name, 'image/png', output.getvalue().__len__(), None)
    
    elif file_ext in ['jpg', 'jpeg']:
        image = Image.open(file_object)
        output = io.BytesIO()
        image.save(output, format='JPEG', optimize=True, quality=75)
        output.seek(0)
        return InMemoryUploadedFile(output, 'ImageField', file_object.name, 'image/jpeg', output.getvalue().__len__(), None)
    
    # Do not optimize SVG files
    elif file_ext == 'svg':
        return file_object
    
    return file_object
