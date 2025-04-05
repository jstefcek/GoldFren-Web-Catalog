# Business logic for the Kotouc Service

# Imports
from datetime import datetime
from Components.MySQL import connect
from GoldFrenAPI.Models.Kotouc import Kotouc

# Function to get all adapters
def get_kotouce():
    # Connect to MySQL database
    conn = connect()
    
    # Check if connection is successful
    if conn is not None:
        # Create cursor object
        cursor = conn.cursor()
        
        # Execute query
        cursor.execute("SELECT * FROM v_kotouc_detail Where Publikovat = 1")
        
        # Fetch all records
        records = cursor.fetchall()
        
        # Create list to store adapter objects
        kotouce = []
        
        # Iterate through records
        for record in records:
            # Create Kotouc object
            kotouc = Kotouc(
                kod=int(record["kod"]),
                sortiment=record["sortiment"],
                kategorie=record["kategorie"],
                obrazek=record["obrazek"],
                vektor=record["vektor"],
                cislo_dilu=record["cislo_dilu"],
                typ=record["typ"],
                konkurence_braking=record["konkurence_braking"],
                konkurence_ngbrakes=record["konkurence_ngbrakes"],
                od=float(record["od"]) if record["od"] is not None else None,
                hd=float(record["hd"]) if record["hd"] is not None else None,
                id=float(record["id"]) if record["id"] is not None else None,
                thk=float(record["thk"]) if record["thk"] is not None else None,
                poznamka=record["poznamka"],
                publikovat=bool(record["publikovat"]),
                aktualizovano=record["aktualizovano"] if isinstance(record["aktualizovano"], datetime) else None,
                aktualizoval=record["aktualizoval"]
            )
            
            # Append adapter object to list
            kotouce.append(kotouc)
        
        # Close cursor and connection
        cursor.close()
        conn.close()
        
        # Return list of adapter objects
        return kotouce
    
    # Return None if connection fails
    else:
        print("Connection failed")
        return None
    
# Function to get a single kotouc by ID
def get_kotouc(kotouc_id):
    # Connect to MySQL database
    conn = connect()
    
    # Check if connection is successful
    if conn is not None:
        # Create cursor object
        cursor = conn.cursor()
        
        # Prepare SQL query
        cursor.execute("SELECT * FROM v_kotouc_detail WHERE kod = %s AND Publikovat = 1", (kotouc_id,))
        
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
            return Kotouc(
                kod=int(record["kod"]),
                sortiment=record["sortiment"],
                kategorie=record["kategorie"],
                obrazek=record["obrazek"],
                vektor=record["vektor"],
                cislo_dilu=record["cislo_dilu"],
                typ=record["typ"],
                konkurence_braking=record["konkurence_braking"],
                konkurence_ngbrakes=record["konkurence_ngbrakes"],
                od=float(record["od"]) if record["od"] is not None else None,
                hd=float(record["hd"]) if record["hd"] is not None else None,
                id=float(record["id"]) if record["id"] is not None else None,
                thk=float(record["thk"]) if record["thk"] is not None else None,
                poznamka=record["poznamka"],
                publikovat=bool(record["publikovat"]),
                aktualizovano=record["aktualizovano"] if isinstance(record["aktualizovano"], datetime) else None,
                aktualizoval=record["aktualizoval"]
            )
    
    # Return None if connection fails
    else:
        print("Connection failed")
        return None

# Function to update an existing kotouc
def update_kotouc(kotouc_id, data):
    # Connect to MySQL database
    conn = connect()
    
    # Check if connection is successful
    if conn is not None:
        # Create cursor object
        cursor = conn.cursor()
        
        # Prepare SQL query
        query = """
            UPDATE d_kotouce
            SET kategorie = %s, obrazek = %s, vektor = %s, 
                cislo_dilu = %s, typ = %s, konkurence_braking = %s, konkurence_ngbrakes = %s, 
                od = %s, hd = %s, id = %s, thk = %s, poznamka = %s, publikovat = %s, 
                aktualizovano = NOW(), aktualizoval = %s 
            WHERE kod = %s
        """
        
        # Execute query 
        try:
            cursor.execute(query, (
                data["kategorie"], data["obrazek"], data["vektor"],
                data["cislo_dilu"], data["typ"], data["konkurence_braking"], data["konkurence_ngbrakes"],
                data.get("od"), data.get("hd"), data.get("id"), data.get("thk"),
                data["poznamka"], data["publikovat"], data["aktualizoval"], kotouc_id
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

# Function to create a new kotouc
def create_kotouc(data):
    # Connect to MySQL database
    conn = connect()
    
    # Check if connection is successful
    if conn is not None:
        # Create cursor object
        cursor = conn.cursor()
        
        # Prepare SQL query
        sql_query = """
            INSERT INTO d_kotouce (sortiment, kategorie, obrazek, vektor, cislo_dilu, typ, konkurence_braking, 
            konkurence_ngbrakes, od, hd, id, thk, poznamka, publikovat, aktualizovano, aktualizoval) 
            VALUES (2, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), %s)
        """
        
        # Execute query
        try:
            cursor.execute(sql_query, (
                data["kategorie"], data["obrazek"], data["vektor"],
                data["cislo_dilu"], data["typ"], data["konkurence_braking"], data["konkurence_ngbrakes"],
                data.get("od"), data.get("hd"), data.get("id"), data.get("thk"),
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