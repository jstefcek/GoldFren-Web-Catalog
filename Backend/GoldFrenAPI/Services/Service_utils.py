# Service utility functions for the GoldFrenAPI

# Imports
from Components.MySQL import connection


def _close_cursor(cursor):
    if cursor is not None:
        try:
            cursor.close()
        except Exception:
            pass


def set_publication_state(sql_table: str, publikovat: int, item_id: int) -> bool | None:
    """
    Function to change the publication state of an item in the database.
    """
    query = f"UPDATE {sql_table} SET publikovat = %s WHERE kod = %s"
    try:
        with connection(commit=True) as conn:
            if conn is None:
                print("Connection failed")
                return None

            cursor = None
            try:
                cursor = conn.cursor()
                cursor.execute(query, (publikovat, item_id))
                return True
            finally:
                _close_cursor(cursor)
    except Exception as ex:
        print(ex)
        return None
    
def get_all_items(sql_view: str, limit: int = None, page: int = None, states: bool = False) -> list | None:
    """
    Function to get all items from the database
    """
    try:
        with connection() as conn:
            if conn is None:
                print("Connection failed")
                return None

            cursor = None
            try:
                # Create cursor object
                cursor = conn.cursor()

                # Execute query if limit and offset are provided
                if limit is not None and page is not None:
                    # Calculate offset
                    # If page is 1, offset is 0, otherwise calculate offset
                    offset = 0 if page <= 1 else (page - 1) * limit

                    # Prepare SQL query and execute it
                    query = f"SELECT * FROM {sql_view}"
                    query += " WHERE Publikovat in (0,1)" if states else " WHERE Publikovat = 1"
                    query += " LIMIT %s OFFSET %s"
                    cursor.execute(query, (limit, offset))
                else:
                    # Prepare SQL query without limit and offset and execute it
                    query = f"SELECT * FROM {sql_view}"
                    query += " WHERE Publikovat in (0,1)" if states else " WHERE Publikovat = 1"
                    cursor.execute(query)

                # Fetch all records to dict object
                records = cursor.fetchall()
                return records
            finally:
                _close_cursor(cursor)
    
    except Exception as ex:
        print(ex)
        return None
        
def get_item_by_id(sql_view: str, item_id: int) -> dict | None:
    """
    Function to get a single item by ID
    """
    try:
        with connection() as conn:
            if conn is None:
                print("Connection failed")
                return None

            cursor = None
            try:
                cursor = conn.cursor()
                cursor.execute(f"SELECT * FROM {sql_view} WHERE kod = %s AND Publikovat = 1", (item_id,))
                return cursor.fetchone()
            finally:
                _close_cursor(cursor)
    except Exception as ex:
        print(ex)
        return None
    
def execute_update(sql_query: str, params: tuple) -> bool | None:
    """
    Function to execute an update query
    """
    try:
        with connection(commit=True) as conn:
            if conn is None:
                print("Connection failed")
                return None

            cursor = None
            try:
                cursor = conn.cursor()
                cursor.execute(sql_query, params)
                return True
            finally:
                _close_cursor(cursor)
    except Exception as ex:
        print(ex)
        return None
    
def insert_record(sql_query: str, params: tuple, return_id: bool = False) -> int | None:
    """
    Function to insert a record into the database
    """
    try:
        with connection(commit=True) as conn:
            if conn is None:
                print("Connection failed")
                return None

            cursor = None
            try:
                cursor = conn.cursor()
                cursor.execute(sql_query, params)
                if return_id:
                    return cursor.lastrowid
                return True
            finally:
                _close_cursor(cursor)
    except Exception as ex:
        print(ex)
        return None
    
def get_filtered_records(sql_query: str, params: list) -> list | None:
    """
    Function to get filtered records from the database
    """
    try:
        with connection() as conn:
            if conn is None:
                print("Connection failed")
                return None

            cursor = None
            try:
                cursor = conn.cursor()
                cursor.execute(sql_query, params)
                return cursor.fetchall()
            finally:
                _close_cursor(cursor)
    except Exception as ex:
        print(ex)
        return None
    
def get_records(sql_query: str, params: list = None, limit: int = None, page: int = None) -> list | None:
    """
    Executes a fully provided SQL query with optional Publikovat filtering amd pagination (LIMIT/OFFSET).

    Args:
        sql_query (str): SQL query
        params (list, optional): SQL Parameters
        limit (int, optional): Number of records to fetch.
        page (int, optional): Page number for pagination (starts from 1).

    Returns:
        list: List of result records, or None if failed.
    """
    try:
        with connection() as conn:
            if conn is None:
                print("Connection failed")
                return None

            cursor = None
            try:
                cursor = conn.cursor()
                # Add LIMIT/OFFSET if needed for pagination
                if limit is not None and page is not None:
                    offset = 0 if page <= 1 else (page - 1) * limit
                    sql_query += " LIMIT %s OFFSET %s"
                    params = list(params or []) + [limit, offset]

                # Execute the final query with parameters
                cursor.execute(sql_query, params or [])
                return cursor.fetchall()
            finally:
                _close_cursor(cursor)

    except Exception as ex:
        print(ex)
        return None
