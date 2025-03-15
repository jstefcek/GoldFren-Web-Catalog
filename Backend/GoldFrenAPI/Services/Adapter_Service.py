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