# Business logic for the Brzdice Service

# Imports
from Components.MySQL import connect
from GoldFrenAPI.Models.Brzdice import Brzdic

# Function to get all brzdice
def get_brzdice():
    # Connect to MySQL database
    conn = connect()
    
    # Check if connection is successful
    if conn is not None:
        # Create cursor object
        cursor = conn.cursor()
        
        # Execute query
        cursor.execute("SELECT * FROM v_brzdice_detail Where Publikovat = 1")
        
        # Fetch all records
        records = cursor.fetchall()
        
        # Create list to store brzdice objects
        brzdice = []
        
        # Iterate through records
        for record in records:
            # Create brzdic object
            brzdic = Brzdic(
                sortiment=record[1],
                kategorie=record[2],
                obrazek=record[3],
                vektor=record[4],
                cislo_dilu=record[5],
                popis=record[6],
                poznamka=record[7],
                publikovat=bool(record[8]),
                aktualizovano=record[9],
                aktualizoval=record[10]
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