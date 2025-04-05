# Business logic for the Desticka Service

# Imports
from Components.MySQL import connect
from GoldFrenAPI.Models.Desticka import Desticka, MaterialInfo, KonkurenceDetail
from datetime import datetime

# Change state of publikovat
def desticka_publication(desticka_id: int, publikovat: int):
    # Connect to MySQL database
    conn = connect()
    
    # Check if connection is successful
    if conn is not None:
        # Create cursor object
        cursor = conn.cursor()
        
        # Prepare SQL query
        query = "UPDATE d_desticka SET publikovat = %s WHERE kod = %s"
        
        # Execute query
        try:
            cursor.execute(query, (publikovat, desticka_id))
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
                kod=record["kod"],
                sortiment=record["sortiment"],
                kategorie=record["kategorie"],
                obrazek=record["obrazek"],
                vektor=record["vektor"],
                cislo_dilu=record["cislo_dilu"],
                typ=record["typ"],
                publikovat=bool(record["publikovat"]),
                aktualizovano=record["aktualizovano"] if isinstance(record["aktualizovano"], datetime) else None,
                aktualizoval=record["aktualizoval"]
            )

            # Populate material dictionary
            desticka.material = {
                'plech_a': MaterialInfo(material=record["plech_a_material"], 
                                        tloustka=float(record["plech_a_tloustka"]) if record["plech_a_tloustka"] is not None else None, 
                                        matrice=record["plech_a_matrice"]),
                'plech_b': MaterialInfo(material=record["plech_b_material"], 
                                        tloustka=float(record["plech_b_tloustka"]) if record["plech_b_tloustka"] is not None else None, 
                                        matrice=record["plech_b_matrice"]),
                'izolator_a': MaterialInfo(material=record["izolator_a_material"], 
                                           tloustka=float(record["izolator_a_tloustka"]) if record["izolator_a_tloustka"] is not None else None, 
                                           matrice=record["izolator_a_matrice"]),
                'izolator_b': MaterialInfo(material=record["izolator_b_material"], 
                                           tloustka=float(record["izolator_b_tloustka"]) if record["izolator_b_tloustka"] is not None else None, 
                                           matrice=record["izolator_a_matrice"]),
                'segment_a': MaterialInfo(material=record["segment_a_material"], 
                                          tloustka=float(record["segment_a_tloustka"]) if record["segment_a_tloustka"] is not None else None, 
                                          matrice=record["segment_a_matrice"]),
                'segment_b': MaterialInfo(material=record["segment_b_material"], 
                                          tloustka=float(record["segment_b_tloustka"]) if record["segment_b_tloustka"] is not None else None, 
                                          matrice=record["segment_b_matrice"])
            }

            # Populate konkurence details
            desticka.konkurence = KonkurenceDetail(
                sbs=record["konkurence_sbs"], ebc=record["konkurence_ebc"], ferodo=record["konkurence_ferodo"], a2z=record["konkurence_a2z"],
                rapco=record["konkurence_rapco"], grove=record["konkurence_grove"], cleveland=record["konkurence_cleveland"], matco=record["konkurence_matco"]
            )

            # Assign additional attributes
            desticka.material_text = record["material"]
            desticka.poznamka = record["poznamka"]
            desticka.oem_cisla = record["oem_cisla"]
            desticka.obchodni_nazev = record["obchodni_nazev"]

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
def get_desticka(desticka_id: int):
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
                kod=record["kod"],
                sortiment=record["sortiment"],
                kategorie=record["kategorie"],
                obrazek=record["obrazek"],
                vektor=record["vektor"],
                cislo_dilu=record["cislo_dilu"],
                typ=record["typ"],
                publikovat=bool(record["publikovat"]),
                aktualizovano=record["aktualizovano"] if isinstance(record["aktualizovano"], datetime) else None,
                aktualizoval=record["aktualizoval"]
            )

            # Populate material dictionary
            desticka.material = {
                'plech_a': MaterialInfo(material=record["plech_a_material"], 
                                        tloustka=float(record["plech_a_tloustka"]) if record["plech_a_tloustka"] is not None else None, 
                                        matrice=record["plech_a_matrice"]),
                'plech_b': MaterialInfo(material=record["plech_b_material"], 
                                        tloustka=float(record["plech_b_tloustka"]) if record["plech_b_tloustka"] is not None else None, 
                                        matrice=record["plech_b_matrice"]),
                'izolator_a': MaterialInfo(material=record["izolator_a_material"], 
                                           tloustka=float(record["izolator_a_tloustka"]) if record["izolator_a_tloustka"] is not None else None, 
                                           matrice=record["izolator_a_matrice"]),
                'izolator_b': MaterialInfo(material=record["izolator_b_material"], 
                                           tloustka=float(record["izolator_b_tloustka"]) if record["izolator_b_tloustka"] is not None else None, 
                                           matrice=record["izolator_a_matrice"]),
                'segment_a': MaterialInfo(material=record["segment_a_material"], 
                                          tloustka=float(record["segment_a_tloustka"]) if record["segment_a_tloustka"] is not None else None, 
                                          matrice=record["segment_a_matrice"]),
                'segment_b': MaterialInfo(material=record["segment_b_material"], 
                                          tloustka=float(record["segment_b_tloustka"]) if record["segment_b_tloustka"] is not None else None, 
                                          matrice=record["segment_b_matrice"])
            }

            # Populate konkurence details
            desticka.konkurence = KonkurenceDetail(
                sbs=record["konkurence_sbs"], ebc=record["konkurence_ebc"], ferodo=record["konkurence_ferodo"], a2z=record["konkurence_a2z"],
                rapco=record["konkurence_rapco"], grove=record["konkurence_grove"], cleveland=record["konkurence_cleveland"], matco=record["konkurence_matco"]
            )

            # Assign additional attributes
            desticka.material_text = record["material"]
            desticka.poznamka = record["poznamka"]
            desticka.oem_cisla = record["oem_cisla"]
            desticka.obchodni_nazev = record["obchodni_nazev"]

            # Return desticka
            return desticka

    else:
        print("Connection failed")
        return None
    
# Function to update an existing desticka
def update_desticka(desticka_id: int, data: dict):
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
                data["material"]["plech_a"]["material"], data["material"]["plech_a"]["tloustka"], data["material"]["plech_a"]["matrice"],
                data["material"]["plech_b"]["material"], data["material"]["plech_b"]["tloustka"], data["material"]["plech_b"]["matrice"],
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
    
# Function to create a new desticka
def create_desticka(data: dict):
    # Connect to MySQL database
    conn = connect()
    
    # Check if connection is successful
    if conn is not None:
        # Create cursor object
        cursor = conn.cursor()
        
        # Prepare SQL query
        sql_query = """
            INSERT INTO d_desticka
                (sortiment, kategorie, obrazek, vektor, cislo_dilu, typ, plech_a_material, plech_a_tloustka, 
                plech_a_matrice, plech_b_material, plech_b_tloustka, plech_b_matrice, izolator_a_material, 
                izolator_a_tloustka, izolator_a_matrice, izolator_b_material, izolator_b_tloustka, izolator_b_matrice, 
                segment_a_material, segment_a_tloustka, segment_a_matrice, segment_b_material, segment_b_tloustka, 
                segment_b_matrice, konkurence_sbs, konkurence_ebc, konkurence_ferodo, konkurence_a2z, 
                konkurence_rapco, konkurence_grove, konkurence_cleveland, konkurence_matco, material, poznamka, 
                oem_cisla, obchodni_nazev, publikovat, aktualizovano, aktualizoval)
            VALUES(1, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), %s);
        """
        
        # Execute query
        try:
            cursor.execute(sql_query, (
                data["kategorie"], data["obrazek"], data["vektor"], data["cislo_dilu"], data["typ"], 
                data["material"]["plech_a"]["material"], data["material"]["plech_a"]["tloustka"], data["material"]["plech_a"]["matrice"],
                data["material"]["plech_b"]["material"], data["material"]["plech_b"]["tloustka"], data["material"]["plech_b"]["matrice"],
                data["material"]["izolator_a"]["material"], data["material"]["izolator_a"]["tloustka"], data["material"]["izolator_a"]["matrice"],
                data["material"]["izolator_b"]["material"], data["material"]["izolator_b"]["tloustka"], data["material"]["izolator_b"]["matrice"],
                data["material"]["segment_a"]["material"], data["material"]["segment_a"]["tloustka"], data["material"]["segment_a"]["matrice"],
                data["material"]["segment_b"]["material"], data["material"]["segment_b"]["tloustka"], data["material"]["segment_b"]["matrice"],
                data["konkurence"]["sbs"], data["konkurence"]["ebc"], data["konkurence"]["ferodo"], data["konkurence"]["a2z"],
                data["konkurence"]["rapco"], data["konkurence"]["grove"], data["konkurence"]["cleveland"], data["konkurence"]["matco"], 
                data["material_text"], data["poznamka"], data["oem_cisla"], data["obchodni_nazev"], data["publikovat"], data["aktualizoval"]
            ))
            conn.commit()
            new_id = cursor.lastrowid

        except Exception as ex:
            raise ex
        
        finally:
            cursor.close()
            conn.close()
        
        return new_id
    
    # Return None if connection fails
    else:
        print("Connection failed")
        return None