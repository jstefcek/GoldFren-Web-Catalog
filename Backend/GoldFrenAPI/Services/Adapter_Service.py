# Business logic for the Adapter Service

# Imports
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
        cursor.execute("SELECT * FROM goldfren.d_adapter Where Publikovat = 1")
        
        # Fetch all records
        records = cursor.fetchall()
        
        # Create list to store adapter objects
        adapters = []
        
        # Iterate through records
        for record in records:
            # Create adapter object
            adapter = Adapter(
                Sortiment=record[1],
                Kategorie=record[2],
                Obrazek=record[3],
                Cislo_Dilu=record[4],
                Typ=record[5],
                Prumer=record[6],
                Popis=record[7],
                Poznamka=record[8],
                Publikovat=record[9],
                Aktualizovano=record[10],
                Aktualizoval=record[11]
            )
            
            # Append adapter object to list
            adapters.append(adapter)
        
        # Close cursor and connection
        cursor.close()
        conn.close()
        
        # Return list of adapter objects
        print(adapters)
        return adapters
    
    # Return None if connection fails
    else:
        print("Connection failed")
        return None