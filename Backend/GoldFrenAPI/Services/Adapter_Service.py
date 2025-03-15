# Business logic for the Adapter Service

# Imports
from datetime import datetime
from Components.MySQL import connect
from GoldFrenAPI.Models.Adapter import Adapter

# Function to get all adapters
def get_adapters():
    # Connect to MySQL database
    conn = connect()
    
    # Check if connection is successful
    if conn is not None:
        # Create cursor object
        cursor = conn.cursor()
        
        # Execute query
        cursor.execute("SELECT * FROM v_adapter_detail Where Publikovat = 1")
        
        # Fetch all records
        records = cursor.fetchall()
        
        # Create list to store adapter objects
        adapters = []
        
        # Iterate through records
        for record in records:
            # Create adapter object
            adapter = Adapter(
                id=record[0],
                sortiment=record[1],
                kategorie=record[2],
                obrazek=record[3],
                vektor=record[4],
                cislo_dilu=record[5],
                typ=record[6],
                prumer=float(record[7]) if record[7] is not None else None,
                popis=record[8],
                poznamka=record[9],
                publikovat=bool(record[10]),
                aktualizovano=record[11] if isinstance(record[8], datetime) else None,
                aktualizoval=record[12]
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
                id=record[0],
                sortiment=record[1],
                kategorie=record[2],
                obrazek=record[3],
                vektor=record[4],
                cislo_dilu=record[5],
                typ=record[6],
                prumer=float(record[7]) if record[7] is not None else None,
                popis=record[8],
                poznamka=record[9],
                publikovat=bool(record[10]),
                aktualizovano=record[11] if isinstance(record[11], datetime) else None,
                aktualizoval=record[12]
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
        
        # Execute query
        try:
            cursor.execute(query, (
                data["kategorie"], data["obrazek"], data["vektor"],
                data["cislo_dilu"], data["typ"], data.get("prumer"), data["popis"],
                data["poznamka"], data["publikovat"], data["aktualizoval"], adapter_id
            ))
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
        sql_query = """
            INSERT INTO d_adapter (sortiment, kategorie, obrazek, vektor, 
                cislo_dilu, typ, prumer, popis, poznamka, publikovat, aktualizovano, aktualizoval) 
            VALUES (6, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), %s)
        """
        
        # Execute query
        try:
            cursor.execute(sql_query, (
                data["kategorie"], data["obrazek"], data["vektor"],
                data["cislo_dilu"], data["typ"], data.get("prumer"), data["popis"],
                data["poznamka"], data["publikovat"], data["aktualizoval"]
            ))
            conn.commit()
            new_id = cursor.lastrowid

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