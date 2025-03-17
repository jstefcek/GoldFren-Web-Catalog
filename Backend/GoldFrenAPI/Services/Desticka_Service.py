# Business logic for the Desticka Service

# Imports
from Components.MySQL import connect
from GoldFrenAPI.Models.Desticka import Desticka, MaterialInfo, KonkurenceDetail
from datetime import datetime

# Function to get all desticka records
def get_desticky():
    # Connect to MySQL database
    conn = connect()

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
                'plech_a': MaterialInfo(material=record[7], tloustka=record[8], matrice=record[9]),
                'plech_b': MaterialInfo(material=record[10], tloustka=record[11], matrice=record[12]),
                'izolator_a': MaterialInfo(material=record[13], tloustka=record[14], matrice=record[15]),
                'izolator_b': MaterialInfo(material=record[16], tloustka=record[17], matrice=record[18]),
                'segment_a': MaterialInfo(material=record[19], tloustka=record[20], matrice=record[21]),
                'segment_b': MaterialInfo(material=record[22], tloustka=record[23], matrice=record[24])
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

    if conn is not None:
        cursor = conn.cursor()

        # Execute query
        cursor.execute("SELECT * FROM v_desticka_detail WHERE Publikovat = 1")

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
                'plech_a': MaterialInfo(material=record[7], tloustka=record[8], matrice=record[9]),
                'plech_b': MaterialInfo(material=record[10], tloustka=record[11], matrice=record[12]),
                'izolator_a': MaterialInfo(material=record[13], tloustka=record[14], matrice=record[15]),
                'izolator_b': MaterialInfo(material=record[16], tloustka=record[17], matrice=record[18]),
                'segment_a': MaterialInfo(material=record[19], tloustka=record[20], matrice=record[21]),
                'segment_b': MaterialInfo(material=record[22], tloustka=record[23], matrice=record[24])
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