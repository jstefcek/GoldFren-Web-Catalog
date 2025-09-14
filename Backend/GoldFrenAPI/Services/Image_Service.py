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
        if ext not in ['.svg']:
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

    # Update the database with the filename
    update_component_image(sortiment, component_id, file_type, filename)

    # Return the URL of the saved file
    return f"{settings.MEDIA_URL}{media_category}/{file_type}/{filename}"

def update_component_image(sortiment: str, component_id: str, file_type: str, filename: str):
    """Update the component record with the image filename."""
    conn = connect()
    if conn is not None:
        try:
            cursor = conn.cursor()
            
            # Determine the column name based on file type
            column_name = "obrazek" if file_type == "image" else "vektor"
            
            # Update the record
            query = f"UPDATE {sortiment} SET {column_name} = %s WHERE id = %s"
            cursor.execute(query, (filename, component_id))
            conn.commit()
            
        except Exception as e:
            print(f"Error updating component image: {e}")
            conn.rollback()
        finally:
            cursor.close()
            conn.close()
    else:
        print("Connection failed")

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
