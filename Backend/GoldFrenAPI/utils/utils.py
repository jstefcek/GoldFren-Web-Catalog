# Utils function used trhoughout the project

from Components.MySQL import connect

def get_pagination(request):
    """
    This function returns pagination parameters from the request.
    """
    # Get limit and page from request
    req_limit = request.GET.get('limit')
    req_page = request.GET.get('page', 1)
    
    # Validate and convert parameters
    limit = int(req_limit) if req_limit is not None else 25
    page = int(req_page) if req_page is not None else 1
    
    # Ensure positive values
    limit = max(0, limit)
    page = max(0, page)
    
    return limit, page

def get_total_count(sql_table: str) -> int:
    """
    This function returns the total count of records in the specified SQL table.
    """
    try:
        # Execute SQL query to get the count
        conn = connect()
        with conn.cursor() as cursor:
            cursor.execute(f"SELECT COUNT(*) as pocet FROM {sql_table} where Publikovat = 1")
            result = cursor.fetchone()
            return result["pocet"] if result else 0
    
    except Exception as e:
        print(f"Error getting total count from {sql_table}: {e}")
        return 0

def get_pagination_urls(request, limit: int, page: int, total_count: int):
    """
    This function constructs the next and previous page URLs for pagination.
    """
    base_url = request.build_absolute_uri().split('?')[0]
    if base_url.endswith("/"): base_url = base_url[:-1]
    
    # Calculate next and previous pages
    next_page = page + 1 if page * limit < total_count else None
    previous_page = page - 1 if page > 1 else None
    
    # Construct URLs
    next_url = f"{base_url}?limit={limit}&page={next_page}" if next_page else None
    prev_url = f"{base_url}?limit={limit}&page={previous_page}" if previous_page else None
    return next_url, prev_url