# Business logic for the Desticka Service

# Imports
from GoldFrenAPI.Models.Desticky import Desticka, MaterialInfo, KonkurenceDetail, VozidloDesticka
from datetime import datetime
from GoldFrenAPI.Services.Service_utils import (
    set_publication_state, 
    get_item_by_id,
    execute_update,
    insert_record,
    get_records
)
from GoldFrenAPI.utils.utils import (
    prepare_sql_filters
)

# Function to get all desticka records
def get_desticky(limit: int = None, page: int = None, states: bool = False):
    # Get all items from the database
    query = """
        SELECT *
        FROM v_desticka_detail"""
    query += " WHERE Publikovat in (0,1)" if states else " WHERE Publikovat = 1"
    records = get_records(sql_query=query, limit=limit, page=page)
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

    return desticky

# Get desticka by ID
def get_desticka(desticka_id: int):
    # Get item by ID from the database
    record = get_item_by_id(sql_view="v_desticka_detail", item_id=desticka_id)

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
    
# Function to update an existing desticka
def update_desticka(desticka_id: int, data: dict): 
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
    status = execute_update(sql_query=query, params=(data["kategorie"], data["obrazek"], data["vektor"], data["cislo_dilu"], data["typ"], 
                data["material"]["plech_a"]["material"], data["material"]["plech_a"]["tloustka"], data["material"]["plech_a"]["matrice"],
                data["material"]["plech_b"]["material"], data["material"]["plech_b"]["tloustka"], data["material"]["plech_b"]["matrice"],
                data["material"]["izolator_a"]["material"], data["material"]["izolator_a"]["tloustka"], data["material"]["izolator_a"]["matrice"],
                data["material"]["izolator_b"]["material"], data["material"]["izolator_b"]["tloustka"], data["material"]["izolator_b"]["matrice"],
                data["material"]["segment_a"]["material"], data["material"]["segment_a"]["tloustka"], data["material"]["segment_a"]["matrice"],
                data["material"]["segment_b"]["material"], data["material"]["segment_b"]["tloustka"], data["material"]["segment_b"]["matrice"],
                data["konkurence"]["sbs"], data["konkurence"]["ebc"], data["konkurence"]["ferodo"], data["konkurence"]["a2z"],
                data["konkurence"]["rapco"], data["konkurence"]["grove"], data["konkurence"]["cleveland"], data["konkurence"]["matco"], 
                data["material_text"], data["poznamka"], data["oem_cisla"], data["obchodni_nazev"],
                data["publikovat"], data["aktualizoval"], desticka_id))
    
    # Return status
    return status
    
# Function to create a new desticka
def create_desticka(data: dict):
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
    new_id = insert_record(sql_query=sql_query, params=(
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
        data["publikovat"], data["aktualizoval"]
    ), 
    return_id=True)
    return new_id

# Change state of publikovat
def desticka_publication(desticka_id: int, publikovat: int):
    state = set_publication_state(sql_table="d_desticka", publikovat=publikovat, item_id=desticka_id)
    return state

# Find specific brzdic by given parameters
def get_filtered_desticky(limit: int = None, page: int = None, states: bool = False, filters: dict = None):
    # Prepare SQL query and add kod
    query = """
    SELECT kod, cislo_dilu, obrazek, vektor, material, konkurence_sbs, konkurence_ebc, konkurence_ferodo, 
    konkurence_a2z, konkurence_rapco, konkurence_grove, konkurence_cleveland, konkurence_matco, 
    oem_cisla, pozice
    FROM v_desticka_detail
    """
    params = []
    filter_condition = []

    # Apply publication filter 
    filter_condition.append("publikovat in (0,1)" if states else "Publikovat = 1")
    filter_condition, params = prepare_sql_filters(filters=filters, filter_condition=filter_condition, params=params)

    # Append filters to base query
    if filter_condition:
        query += " WHERE " + " AND ".join(filter_condition)
    
    # Execute query and get records
    records = get_records(sql_query=query, params=params, limit=limit, page=page)
    if not records:
        return None
    
    # Prepare data and return if someting found
    desticky = []
    for record in records:
        desticka = {
            "kod": record["kod"],
            "cislo_dilu": record["cislo_dilu"],
            "obrazek": record["obrazek"],
            "vektor": record["vektor"],
            "pozice": record["pozice"],
            "oem_cisla": record["oem_cisla"],
            "material": record["material"],
            "konkurence_sbs": record["konkurence_sbs"],
            "konkurence_ebc": record["konkurence_ebc"],
            "konkurence_ferodo": record["konkurence_ferodo"],
            "konkurence_a2z": record["konkurence_a2z"],
            "konkurence_rapco": record["konkurence_rapco"],
            "konkurence_grove": record["konkurence_grove"],
            "konkurence_cleveland": record["konkurence_cleveland"],
            "konkurence_matco": record["konkurence_matco"],
        }
        desticky.append(desticka)
    
    # Return list of matching desticky dictionaries
    return desticky if desticky else None

# Get vozidla for specific desticka
def get_vozidla_for_desticka(limit: int = None, page: int = None, states: bool = False, desticka_id: int = None):
    # Prepare SQL query and add kod
    query = """
    SELECT *
    FROM v_vozidlo_desticka
    WHERE kod = %s
    """
    params = [desticka_id]
    query += " AND publikovat in (0,1)" if states else " AND Publikovat = 1"
    query += " ORDER BY vyrobce ASC, oznaceni_vozidla ASC"

    # Execute query and get records
    records = get_records(sql_query=query, params=params, limit=limit, page=page)
    if not records:
        return None

    desticky = []
    for record in records:
        desticka = VozidloDesticka(
            kod=record["kod"],
            cislo_dilu=record["cislo_dilu"],
            kategorie=record["kategorie"],
            subkategorie=record["subkategorie"],
            vyrobce=record["vyrobce"],
            vozidlo=record["vozidlo"],
            oznaceni_vozidla=record["oznaceni_vozidla"],
            typ=record["typ"],
            objem=record["objem"],
            obrazek=record["obrazek"],
            vektor=record["vektor"],
            konkurence_sbs=record["konkurence_sbs"],
            konkurence_ebc=record["konkurence_ebc"],
            konkurence_ferodo=record["konkurence_ferodo"],
            konkurence_a2z=record["konkurence_a2z"],
            konkurence_rapco=record["konkurence_rapco"],
            konkurence_grove=record["konkurence_grove"],
            konkurence_cleveland=record["konkurence_cleveland"],
            konkurence_matco=record["konkurence_matco"],
            material=record["material"],
            oem_cisla=record["oem_cisla"],
            specialni_oznaceni=record["specialni_oznaceni"],
            rok_od=record["rok_od"],
            rok_do=record["rok_do"],
            pozice=record["pozice"],
            publikovat=bool(record["publikovat"]) if record["publikovat"] is not None else None
        )

        # Append desticka object to list
        desticky.append(desticka)
        
    # Return list of matching desticky objects
    return desticky if desticky else None