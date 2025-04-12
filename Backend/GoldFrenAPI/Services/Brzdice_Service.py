# Business logic for the Brzdice Service

# Imports
from datetime import datetime
from Components.MySQL import connect
from GoldFrenAPI.Models.Brzdice import Brzdic

# Change state of publikovat
def brzdice_publication(brzdic_id, publikovat):
    # Connect to MySQL database
    conn = connect()
    
    # Check if connection is successful
    if conn is not None:
        # Create cursor object
        cursor = conn.cursor()
        
        # Prepare SQL query
        query = "UPDATE d_brzdice SET publikovat = %s WHERE kod = %s"
        
        # Execute query
        try:
            cursor.execute(query, (publikovat, brzdic_id))
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

# Function to get all brzdice
def get_brzdice(limit: int = None, page: int = None):
    # Connect to MySQL database
    conn = connect()
    
    # Check if connection is successful
    if conn is not None:
        # Create cursor object
        cursor = conn.cursor()
        
        # Execute query if limit and offset are provided
        if limit is not None and page is not None:
            offset = 0 if page <= 1 else (page - 1) * limit
            cursor.execute("SELECT * FROM v_brzdice_detail Where Publikovat = 1 LIMIT %s OFFSET %s", (limit, offset))
        else:
            cursor.execute("SELECT * FROM v_brzdice_detail Where Publikovat = 1")
        
        # Fetch all records
        records = cursor.fetchall()
        
        # Create list to store brzdice objects
        brzdice = []
        
        # Iterate through records
        for record in records:
            # Create brzdic object
            brzdic = Brzdic(
                kod=record["kod"],
                sortiment=record["sortiment"],
                kategorie=record["kategorie"],
                obrazek=record["obrazek"],
                vektor=record["vektor"],
                cislo_dilu=record["cislo_dilu"],
                popis=record["popis"],
                poznamka=record["poznamka"],
                publikovat=bool(record["publikovat"]),
                aktualizovano=record["aktualizovano"] if isinstance(record["aktualizovano"], datetime) else None,
                aktualizoval=record["aktualizoval"]
            )
            
            # Append brzdice object to list
            brzdice.append(brzdic)
        
        # Close cursor and connection
        cursor.close()
        conn.close()
        
        # Return list of brzdice objects
        return brzdice
    
    # Return None if connection fails
    else:
        print("Connection failed")
        return None
    
# Function to get a single brzidc by ID
def get_brzdic(brzdic_id: int):
    # Connect to MySQL database
    conn = connect()
    
    # Check if connection is successful
    if conn is not None:
        # Create cursor object
        cursor = conn.cursor()
        
        # Prepare SQL query
        cursor.execute("SELECT * FROM v_brzdice_detail WHERE kod = %s AND Publikovat = 1", (brzdic_id,))
        
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
            return Brzdic(
                kod=record["kod"],
                sortiment=record["sortiment"],
                kategorie=record["kategorie"],
                obrazek=record["obrazek"],
                vektor=record["vektor"],
                cislo_dilu=record["cislo_dilu"],
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
    
# Function to update an existing brzdic
def update_brzdic(brzdic_id: int, data: dict):
    # Connect to MySQL database
    conn = connect()
    
    # Check if connection is successful
    if conn is not None:
        # Create cursor object
        cursor = conn.cursor()
        
        # Prepare SQL query
        query = """
            UPDATE d_brzdice 
            SET kategorie = %s, obrazek = %s, vektor = %s, 
                cislo_dilu = %s, popis = %s, poznamka = %s, 
                publikovat = %s, aktualizovano = NOW(), aktualizoval = %s 
            WHERE kod = %s
        """
        
        # Execute query
        try:
            cursor.execute(query, (
                data["kategorie"], data["obrazek"], data["vektor"],
                data["cislo_dilu"], data["popis"],data["poznamka"], 
                data["publikovat"], data["aktualizoval"], brzdic_id
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
    
# Function to create a new brzdic
def create_brzdic(data: dict):
    # Connect to MySQL database
    conn = connect()
    
    # Check if connection is successful
    if conn is not None:
        # Create cursor object
        cursor = conn.cursor()
        
        # Prepare SQL query
        sql_query = """
            INSERT INTO d_brzdice (sortiment, kategorie, obrazek, vektor, 
                cislo_dilu, popis, poznamka, publikovat, aktualizovano, aktualizoval) 
            VALUES (3, %s, %s, %s, %s, %s, %s, %s, NOW(), %s)
        """
        
        # Execute query
        try:
            cursor.execute(sql_query, (
                data["kategorie"], data["obrazek"], data["vektor"],
                data["cislo_dilu"], data["popis"],data["poznamka"], 
                data["publikovat"], data["aktualizoval"]
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