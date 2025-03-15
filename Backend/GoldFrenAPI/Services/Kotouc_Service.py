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
                kod=record[0],
                sortiment=record[1],
                kategorie=record[2],
                obrazek=record[3],
                vektor=record[4],
                cislo_dilu=record[5],
                typ=record[6],
                konkurence_braking=record[7],
                konkurence_ngbrakes=record[8],
                od=float(record[9]) if record[9] is not None else None,
                hd=float(record[10]) if record[10] is not None else None,
                id=float(record[11]) if record[11] is not None else None,
                thk=float(record[12]) if record[12] is not None else None,
                poznamka=record[13],
                publikovat=bool(record[14]),
                aktualizovano=record[15] if isinstance(record[15], datetime) else None,
                aktualizoval=record[16]
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