# Service utility functions for the GoldFrenAPI

# Imports
from Components.MySQL import connect

def set_publication_state(sql_table: str, publikovat: int, item_id: int):
    """
    Function to change the publication state of an item in the database.
    """
    # Connect to MySQL database
    conn = connect()
    
    # Check if connection is successful
    if conn is not None:
        # Create cursor object and prepare SQL query
        cursor = conn.cursor()
        query = f"UPDATE {sql_table} SET publikovat = %s WHERE kod = %s"
        
        # Execute query
        try:
            cursor.execute(query, (publikovat, item_id))
            conn.commit()
            return True
        
        except Exception as ex:
            print(ex)
        
        finally:
            cursor.close()
            conn.close()
    
    # Return None if connection fails
    else:
        print("Connection failed")
        return None 
    
def get_all_items(sql_view: str, limit: int = None, page: int = None, states: bool = False):
    """
    Function to get all items from the database
    """
    # Connect to MySQL database
    conn = connect()
    
    # Check if connection is successful
    try:
        if conn is not None:
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
        
        # Return None if connection fails
        else:
            print("Connection failed")
            return None
    
    except Exception as ex:
        print(ex)
        
    finally:
        cursor.close()
        conn.close()
        
def get_item_by_id(sql_view: str, item_id: int):
    """
    Function to get a single item by ID
    """
    # Connect to MySQL database
    conn = connect()
    
    # Check if connection is successful
    if conn is not None:
        # Create cursor object and prepare SQL query
        cursor = conn.cursor()
        cursor.execute(f"SELECT * FROM {sql_view} WHERE kod = %s AND Publikovat = 1", (item_id,))
        
        # Fetch single record
        try:
            record = cursor.fetchone()
            return record
        
        except Exception as ex:
            print(ex)
            record = None
        
        finally:
            cursor.close()
            conn.close()
    
    # Return None if connection fails
    else:
        print("Connection failed")
        return None
    
def execute_update(sql_query: str, params: tuple):
    """
    Function to execute an update query
    """
    # Connect to MySQL database
    conn = connect()
    
    # Check if connection is successful
    if conn is not None:
        cursor = conn.cursor()
        
        # Execute query
        try:
            cursor.execute(sql_query, params)
            conn.commit()
            return True
        
        except Exception as ex:
            print(ex)
        
        finally:
            cursor.close()
            conn.close()
    
    # Return None if connection fails
    else:
        print("Connection failed")
        return None
    
def insert_record(sql_query: str, params: tuple, return_id: bool = False):
    """
    Function to insert a record into the database
    """
    # Connect to MySQL database
    conn = connect()
    
    # Check if connection is successful
    if conn is not None:
        cursor = conn.cursor()
        
        # Execute query
        try:
            cursor.execute(sql_query, params)
            conn.commit()
            if return_id:
                new_id = cursor.lastrowid

        except Exception as ex:
            print(ex)
        
        finally:
            cursor.close()
            conn.close()
        
        # Return the new ID of the inserted record
        if return_id:
            return new_id

    
    # Return None if connection fails
    else:
        print("Connection failed")
        return None
    
def get_filtered_records(sql_query: str, params: list):
    """
    Function to get filtered records from the database
    """
    # Connect to MySQL database
    conn = connect()
    
    # Check if connection is successful
    if conn is not None:
        cursor = conn.cursor()
        
        # Execute query
        try:
            cursor.execute(sql_query, params)
            records = cursor.fetchall()
            return records
        
        except Exception as ex:
            print(ex)
        
        finally:
            cursor.close()
            conn.close()
    
    # Return None if connection fails
    else:
        print("Connection failed")
        return None