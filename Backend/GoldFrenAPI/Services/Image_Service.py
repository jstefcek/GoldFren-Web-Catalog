import os
from django.conf import settings
from Components.MySQL import connect

def save_image_file(sortiment: str, file_object, file_type: str, component_id: str):
    # Validate file type
    if file_type not in ['image', 'vector']:
        raise ValueError("Invalid file type. Must be 'image' or 'vector'.")

    # Gets media category from the database and validates it
    media_category = get_sortiment_image_category(sortiment)
    if not media_category:
        raise ValueError("Sortiment does not exist in the database.")

    # Validate file file extension
    ext = os.path.splitext(file_object.name)[1].lower()
    if file_type == 'image':
        if ext not in ['.jpg', '.jpeg', '.png']:
            raise ValueError("Unsupported file extension for image")
    elif file_type == 'vector':
        if ext not in ['.svg', '.jpg', '.jpeg', '.png']:
            raise ValueError("Unsupported file extension for vector")
    else:
        raise ValueError("Unsupported file type")

    # Use component_id as filename
    filename = f"{component_id}{ext}"
    
    dir_path = os.path.join(settings.MEDIA_ROOT, media_category, file_type)
    file_path = os.path.join(dir_path, filename)

    # Create the directory and save the file
    os.makedirs(dir_path, exist_ok=True)
    
    # Remove existing file with different extension if it exists
    for existing_ext in ['.jpg', '.jpeg', '.png', '.svg']:
        if existing_ext != ext:
            existing_file = os.path.join(dir_path, f"{component_id}{existing_ext}")
            if os.path.exists(existing_file):
                os.remove(existing_file)
    
    with open(file_path, 'wb+') as file:
        for chunk in file_object.chunks():
            file.write(chunk)

    # Return the URL of the saved file
    return f"{settings.MEDIA_URL}{media_category}/{file_type}/{filename}"

def get_sortiment_image_category(sortiment: str) -> str:
    """This function retrieves the image category for a given sortiment from the database.""" 
    conn = connect()
    if conn is not None:
        # Create a cursor and execute the query
        cursor = conn.cursor()
        cursor.execute("SELECT image_categories FROM c_sortiment WHERE nazev = %s", (sortiment,))
        record = cursor.fetchone()
        cursor.close()
        conn.close()
        # Returns image category if it exists, otherwise None
        return record["image_categories"] if record and record["image_categories"] else None
    else:
        print("Connection failed")
        return None
