# Business logic for the Adapter Service

# Imports
from datetime import datetime
from Components.MySQL import connect
from GoldFrenAPI.Models.Adaptery import Adapter

# Change state of publikovat
def adapter_publication(adapter_id: int, publikovat: int):
    # Connect to MySQL database
    conn = connect()
    
    # Check if connection is successful
    if conn is not None:
        # Create cursor object
        cursor = conn.cursor()
        
        # Prepare SQL query
        query = "UPDATE d_adapter SET publikovat = %s WHERE kod = %s"
        
        # Execute query
        try:
            cursor.execute(query, (publikovat, adapter_id))
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

# Function to get all adapters
def get_adapters(limit: int = None, page: int = None, states: bool = False):
    # Connect to MySQL database
    conn = connect()
    
    # Check if connection is successful
    if conn is not None:
        # Create cursor object
        cursor = conn.cursor()
        
        # Execute query if limit and offset are provided
        if limit is not None and page is not None:
            # Calculate offset
            # If page is 1, offset is 0, otherwise calculate offset
            offset = 0 if page <= 1 else (page - 1) * limit
            
            # Prepare SQL query and execute it
            query = "SELECT * FROM v_adapter_detail"
            query += " WHERE Publikovat in (0,1)" if states else " WHERE Publikovat = 1"
            query += " LIMIT %s OFFSET %s"
            cursor.execute(query, (limit, offset))
        else:
            # Prepare SQL query without limit and offset and execute it
            query = "SELECT * FROM v_adapter_detail"
            query += " WHERE Publikovat in (0,1)" if states else " WHERE Publikovat = 1"
            cursor.execute(query)
        
        # Fetch all records and initialize list
        records = cursor.fetchall()
        adapters = []
        
        # Iterate through records
        for record in records:
            # Create adapter object
            adapter = Adapter(
                kod=record["kod"],
                sortiment=record["sortiment"],
                kategorie=record["kategorie"],
                obrazek=record["obrazek"],
                vektor=record["vektor"],
                cislo_dilu=record["cislo_dilu"],
                typ=record["typ"],
                prumer=float(record["prumer"]) if record["prumer"] is not None else None,
                popis=record["popis"],
                typ_uchyceni=record["typ_uchyceni"],
                roztec_brzdice=float(record["roztec_brzdic"]) if record["roztec_brzdic"] is not None else None,
                poznamka=record["poznamka"],
                publikovat=bool(record["publikovat"]),
                aktualizovano=record["aktualizovano"] if isinstance(record["aktualizovano"], datetime) else None,
                aktualizoval=record["aktualizoval"]
            )
            
            # Append adapter object to list
            adapters.append(adapter)
        
        # Close cursor and connection
        cursor.close()
        conn.close()
        
        # Return list of adapter objects
        return adapters
    
    # Return None if connection fails
    else:
        print("Connection failed")
        return None
    
# Function to get a single adapter by ID
def get_adapter(adapter_id):
    # Connect to MySQL database
    conn = connect()
    
    # Check if connection is successful
    if conn is not None:
        # Create cursor object
        cursor = conn.cursor()
        
        # Prepare SQL query
        cursor.execute("SELECT * FROM v_adapter_detail WHERE kod = %s AND Publikovat = 1", (adapter_id,))
        
        # Fetch single record
        try:
            record = cursor.fetchone()
        
        except Exception as ex:
            print(ex)
            record = None
        
        finally:
            # Close cursor and connection
            cursor.close()
            conn.close()
        
        # Check if record exists
        if record:
            return Adapter(
                kod=record["kod"],
                sortiment=record["sortiment"],
                kategorie=record["kategorie"],
                obrazek=record["obrazek"],
                vektor=record["vektor"],
                cislo_dilu=record["cislo_dilu"],
                typ=record["typ"],
                prumer=float(record["prumer"]) if record["prumer"] is not None else None,
                popis=record["popis"],
                typ_uchyceni=record["typ_uchyceni"],
                roztec_brzdice=float(record["roztec_brzdic"]) if record["roztec_brzdic"] is not None else None,
                poznamka=record["poznamka"],
                publikovat=bool(record["publikovat"]),
                aktualizovano=record["aktualizovano"] if isinstance(record["aktualizovano"], datetime) else None,
                aktualizoval=record["aktualizoval"]
            )
    
    # Return None if connection fails
    else:
        print("Connection failed")
        return None

# Function to update an existing adapter
def update_adapter(adapter_id, data):
    # Connect to MySQL database
    conn = connect()
    
    # Check if connection is successful
    if conn is not None:
        # Create cursor object
        cursor = conn.cursor()
        
        # Prepare SQL query
        query = """
            UPDATE d_adapter 
            SET kategorie = %s, obrazek = %s, vektor = %s, 
                cislo_dilu = %s, typ = %s, prumer = %s, popis = %s, 
                poznamka = %s, publikovat = %s, aktualizovano = NOW(), aktualizoval = %s 
            WHERE kod = %s
        """
        
        # Update info about adapter attachment to database
        query_attachment = """
            UPDATE d_adapter_attachment 
            SET typ_uchyceni = %s, roztec_brzdice = %s 
            WHERE adapter_kod = %s
        """
        
        # Execute query
        try:
            cursor.execute(query, (
                data["kategorie"], data["obrazek"], data["vektor"],
                data["cislo_dilu"], data["typ"], data.get("prumer"), data["popis"],
                data["poznamka"], data["publikovat"], data["aktualizoval"], adapter_id
            ))
            conn.commit()
            
            cursor.execute(query_attachment, (data["typ_uchyceni"], data["roztec_brzdic"], adapter_id))
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

# Function to create a new adapter
def create_adapter(data):
    # Connect to MySQL database
    conn = connect()
    
    # Check if connection is successful
    if conn is not None:
        # Create cursor object
        cursor = conn.cursor()
        
        # Prepare SQL query
        query = """
            INSERT INTO d_adapter (sortiment, kategorie, obrazek, vektor, 
                cislo_dilu, typ, prumer, popis, poznamka, publikovat, aktualizovano, aktualizoval) 
            VALUES (6, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), %s)
        """
        
        # Insert info about adapter attachment to database
        query_attachment = """
            INSERT INTO d_adapter_attachment (adapter_kod, typ_uchyceni, roztec_brzdic) 
            VALUES (%s, %s, %s)
        """
        
        # Execute queries
        try:
            cursor.execute(query, (
                data["kategorie"], data["obrazek"], data["vektor"],
                data["cislo_dilu"], data["typ"], data.get("prumer"), data["popis"],
                data["poznamka"], data["publikovat"], data["aktualizoval"]
            ))
            conn.commit()
            new_id = cursor.lastrowid
            
            cursor.execute(query_attachment, (new_id, data["typ_uchyceni"], data["roztec_brzdic"]))
            conn.commit()

        except Exception as ex:
            print(ex)
        
        finally:
            cursor.close()
            conn.close()
        
        return new_id
    
    # Return None if connection fails
    else:
        print("Connection failed")
        return None