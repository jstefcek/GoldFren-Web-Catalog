# Business logic for the Adapter Service

# Imports
from datetime import datetime
from Components.MySQL import connect
from GoldFrenAPI.Models.Adapter import Adapter

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
                kod=record["kod"],
                sortiment=record["sortiment"],
                kategorie=record["kategorie"],
                obrazek=record["obrazek"],
                vektor=record["vektor"],
                cislo_dilu=record["cislo_dilu"],
                typ=record["typ"],
                prumer=float(record["prumer"]) if record["prumer"] is not None else None,
                popis=record["popis"],
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