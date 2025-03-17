# Business logic for the Desticka Service

# Imports
from Components.MySQL import connect
from GoldFrenAPI.Models.Desticka import Desticka, MaterialInfo, KonkurenceDetail
from datetime import datetime

# Function to get all desticka records
def get_desticky():
    # Connect to MySQL database
    conn = connect()

    # Check if connection is successful
    if conn is not None:
        cursor = conn.cursor()

        # Execute query
        cursor.execute("SELECT * FROM v_desticka_detail WHERE Publikovat = 1")

        # Fetch all records
        records = cursor.fetchall()

        # Create list to store desticka objects
        desticky = []

        for record in records:
            # Create desticka object with main attributes
            desticka = Desticka(
                kod=record[0],
                sortiment=record[1],
                kategorie=record[2],
                obrazek=record[3],
                vektor=record[4],
                cislo_dilu=record[5],
                typ=record[6],
                publikovat=bool(record[37]),
                aktualizovano=record[38] if isinstance(record[38], datetime) else None,
                aktualizoval=record[39]
            )

            # Populate material dictionary
            desticka.material = {
                'plech_a': MaterialInfo(material=record[7], tloustka=float(record[8]) if record[8] is not None else None, matrice=record[9]),
                'plech_b': MaterialInfo(material=record[10], tloustka=float(record[11]) if record[11] is not None else None, matrice=record[12]),
                'izolator_a': MaterialInfo(material=record[13], tloustka=float(record[14]) if record[14] is not None else None, matrice=record[15]),
                'izolator_b': MaterialInfo(material=record[16], tloustka=float(record[17]) if record[17] is not None else None, matrice=record[18]),
                'segment_a': MaterialInfo(material=record[19], tloustka=float(record[20]) if record[20] is not None else None, matrice=record[21]),
                'segment_b': MaterialInfo(material=record[22], tloustka=float(record[23]) if record[23] is not None else None, matrice=record[24])
            }

            # Populate konkurence details
            desticka.konkurence = KonkurenceDetail(
                sbs=record[25], ebc=record[26], ferodo=record[27], a2z=record[28],
                rapco=record[29], grove=record[30], cleveland=record[31], matco=record[32]
            )

            # Assign additional attributes
            desticka.material_text = record[33]
            desticka.poznamka = record[34]
            desticka.oem_cisla = record[35]
            desticka.obchodni_nazev = record[36]

            # Append desticka object to list
            desticky.append(desticka)

        # Close cursor and connection
        cursor.close()
        conn.close()

        return desticky

    else:
        print("Connection failed")
        return None


# Get desticka by ID
def get_desticka(desticka_id):
    # Connect to MySQL database
    conn = connect()

    # Check if connection is successful
    if conn is not None:
        cursor = conn.cursor()

        # Execute query
        cursor.execute("SELECT * FROM v_desticka_detail WHERE kod = %s AND Publikovat = 1", (desticka_id,))

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
            # Create desticka object with main attributes
            desticka = Desticka(
                kod=record[0],
                sortiment=record[1],
                kategorie=record[2],
                obrazek=record[3],
                vektor=record[4],
                cislo_dilu=record[5],
                typ=record[6],
                publikovat=bool(record[37]),
                aktualizovano=record[38] if isinstance(record[38], datetime) else None,
                aktualizoval=record[39]
            )

            # Populate material dictionary
            desticka.material = {
                'plech_a': MaterialInfo(material=record[7], tloustka=float(record[8]) if record[8] is not None else None, matrice=record[9]),
                'plech_b': MaterialInfo(material=record[10], tloustka=float(record[11]) if record[11] is not None else None, matrice=record[12]),
                'izolator_a': MaterialInfo(material=record[13], tloustka=float(record[14]) if record[14] is not None else None, matrice=record[15]),
                'izolator_b': MaterialInfo(material=record[16], tloustka=float(record[17]) if record[17] is not None else None, matrice=record[18]),
                'segment_a': MaterialInfo(material=record[19], tloustka=float(record[20]) if record[20] is not None else None, matrice=record[21]),
                'segment_b': MaterialInfo(material=record[22], tloustka=float(record[23]) if record[23] is not None else None, matrice=record[24])
            }

            # Populate konkurence details
            desticka.konkurence = KonkurenceDetail(
                sbs=record[25], ebc=record[26], ferodo=record[27], a2z=record[28],
                rapco=record[29], grove=record[30], cleveland=record[31], matco=record[32]
            )

            # Assign additional attributes
            desticka.material_text = record[33]
            desticka.poznamka = record[34]
            desticka.oem_cisla = record[35]
            desticka.obchodni_nazev = record[36]

            # Return desticka
            return desticka

    else:
        print("Connection failed")
        return None
    
# Function to update an existing desticka
def update_desticka(desticka_id, data):
    # Connect to MySQL database
    conn = connect()
    
    # Check if connection is successful
    if conn is not None:
        # Create cursor object
        cursor = conn.cursor()
        
        # Prepare SQL query
        query = """
            UPDATE d_desticka
            SET kategorie=%s, obrazek=%s, vektor=%s, cislo_dilu=%s, typ=%s, plech_a_material=%s, plech_a_tloustka=%s, 
                plech_a_matrice=%s, plech_b_material=%s, plech_b_tloustka=%s, plech_b_matrice=%s, izolator_a_material=%s, 
                izolator_a_tloustka=%s, izolator_a_matrice=%s, izolator_b_material=%s, izolator_b_tloustka=%s, izolator_b_matrice=%s, 
                segment_a_material=%s, segment_a_tloustka=%s, segment_a_matrice=%s, segment_b_material=%s, segment_b_tloustka=%s, 
                segment_b_matrice=%s, konkurence_sbs=%s, konkurence_ebc=%s, konkurence_ferodo=%s, konkurence_a2z=%s, 
                konkurence_rapco=%s, konkurence_grove=%s, konkurence_cleveland=%s, konkurence_matco=%s, material=%s, poznamka=%s, 
                oem_cisla=%s, obchodni_nazev=%s, publikovat=%s, aktualizovano=NOW(), aktualizoval=%s 
            WHERE kod = %s
        """
        
        # Execute query 
        try:
            cursor.execute(query, (
                data["kategorie"], data["obrazek"], data["vektor"], data["cislo_dilu"], data["typ"], 
                data["material"]["plech_a"]["tloustka"], data["material"]["plech_a"]["material"], data["material"]["plech_a"]["matrice"],
                data["material"]["plech_b"]["tloustka"], data["material"]["plech_b"]["material"], data["material"]["plech_b"]["matrice"],
                data["material"]["izolator_a"]["material"], data["material"]["izolator_a"]["tloustka"], data["material"]["izolator_a"]["matrice"],
                data["material"]["izolator_b"]["material"], data["material"]["izolator_b"]["tloustka"], data["material"]["izolator_b"]["matrice"],
                data["material"]["segment_a"]["material"], data["material"]["segment_a"]["tloustka"], data["material"]["segment_a"]["matrice"],
                data["material"]["segment_b"]["material"], data["material"]["segment_b"]["tloustka"], data["material"]["segment_b"]["matrice"],
                data["konkurence"]["sbs"], data["konkurence"]["ebc"], data["konkurence"]["ferodo"], data["konkurence"]["a2z"],
                data["konkurence"]["rapco"], data["konkurence"]["grove"], data["konkurence"]["cleveland"], data["konkurence"]["matco"], 
                data["material_text"], data["poznamka"], data["oem_cisla"], data["obchodni_nazev"],
                data["publikovat"], data["aktualizoval"], desticka_id
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