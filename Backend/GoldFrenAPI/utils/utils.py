# Utils function used trhoughout the project

# Imports
import os
from Components.MySQL import connect

PAGINATION_DEFAULT_LIMIT = os.getenv("PAGINATION_DEFAULT_PAGE_SIZE", 25)

def get_pagination(request):
    """
    This function returns pagination parameters from the request.
    """
    # Get limit and page from request
    req_limit = request.GET.get('limit')
    req_page = request.GET.get('page', 1)
    
    # Validate and convert parameters
    limit = int(req_limit) if req_limit is not None else int(PAGINATION_DEFAULT_LIMIT)
    page = int(req_page) if req_page is not None else 1
    
    # Ensure positive values
    limit = max(0, limit)
    page = max(0, page)
    return limit, page

def get_total_count(sql_table: str, states: bool) -> int:
    """
    This function returns the total count of records in the specified SQL table.
    """
    try:
        # Execute SQL query to get the count
        conn = connect()
        with conn.cursor() as cursor:
            # Prepare SQL query
            query = f"SELECT COUNT(*) as pocet FROM {sql_table}"
            query += " WHERE Publikovat in (0,1)" if states else " WHERE Publikovat = 1"
            
            # Execute query and fetch result
            cursor.execute(query)
            result = cursor.fetchone()
            return result["pocet"] if result else 0
    
    except Exception as e:
        print(f"Error getting total count from {sql_table}: {e}")
        return 0
    
def get_total_count_with_params(query: str, states: bool, filters: dict = None) -> int:
    """
    Returns the total count of records in the specified SQL table with dynamic filters.
    """
    try:
        # Execute SQL query to get the count
        conn = connect()
        with conn.cursor() as cursor:
            filter_condition = []
            parameters = []

            # Apply publication filter 
            filter_condition.append("publikovat in (0,1)" if states else "Publikovat = 1")
            filter_condition, parameters = prepare_sql_filters(filters=filters, filter_condition=filter_condition, params=parameters)

            # Append filters to base query
            if filter_condition:
                query += " WHERE " + " AND ".join(filter_condition)
            
            # Wrap query and return count
            count_query = f"SELECT COUNT(*) as pocet FROM ({query}) AS sub"
            
            # Execute query with parameters if any
            cursor.execute(count_query, parameters)
            result = cursor.fetchone()
            return result["pocet"] if result else 0
    
    except Exception as ex:
        print(f"Error getting total count: {ex}")
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

def prepare_sql_filters(filters: dict, filter_condition: list, params: list):
    """
    This function prepare sql filters based on type of instance
    """
    # Check for filters and return 
    if filters:
        for column, value in filters.items():
            # Check for tuple and then set it for minimum and maximum value
            if isinstance(value, tuple) and len(value) == 2:
                if value[0] is not None and value[1] is not None:
                    filter_condition.append(f"{column} BETWEEN %s AND %s")
                    params.extend(value)
                    
            # Check for list value and then add find is set 
            if isinstance(value, list) and len(value) > 0:
                for col_value in value:
                    filter_condition.append(f"FIND_IN_SET(REPLACE(%s, ' ', ''), REPLACE({column}, ' ', '')) > 0")
                    params.append(col_value)
                    
            # Find in multiple columns
            if isinstance(value, dict) and value["search_value"] is not None:
                filter_condition.append(f"%s IN ({value['search_in_columns']})")
                params.append(value["search_value"])
            
            # Just add column condition and param 
            else:
                if value is not None and not isinstance(value, dict) and not isinstance(value, list) and not isinstance(value, tuple):
                    filter_condition.append(f"{column} = %s")
                    params.append(value)
       
    # Return filter condition and params  
    return filter_condition, params

def change_category_label(kategorie: str):
    """Change category label to label inside DB"""
    if kategorie == "Auto":
        return "Automobily"
    elif kategorie == "Motocykl":
        return "Motocykly"
    elif kategorie == "Kolo":
        return "Jízdní kola"
    elif kategorie == "Letadlo":
        return "Letadla"
    
def change_sortiment_label(kategorie: str):
    """Change sortiment label to match DB label"""
    if kategorie == "adaptery":
        return "adapter"
    elif kategorie == "brzdice":
        return "brzdic"
    elif kategorie == "desticky":
        return "desticka"
    elif kategorie == "hadicky":
        return "hadicka"
    elif kategorie == "kotouce":
        return "kotouc"
    elif kategorie == "pumpy":
        return "pumpa"
    elif kategorie == "prislusenstvi":
        return "prislusenstvi"