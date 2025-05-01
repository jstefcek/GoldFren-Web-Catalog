# Business logic for the Kotouc Service

# Imports
from datetime import datetime
from GoldFrenAPI.Models.Kotouce import Kotouc, VozidloKotouc
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

# Function to get all kotouce
def get_kotouce(limit: int = None, page: int = None, states: bool = False):
    # Get all items from the database
    query = """
        SELECT *
        FROM v_kotouc_detail"""
    query += " WHERE Publikovat in (0,1)" if states else " WHERE Publikovat = 1"
    query += " ORDER BY cislo_dilu ASC"
    records = get_records(sql_query=query, limit=limit, page=page)
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
        
    # Return list of adapter objects
    return kotouce
    
# Function to get a single kotouc by ID
def get_kotouc(kotouc_id):
    # Get item by ID from the database
    record = get_item_by_id(sql_view="v_kotouc_detail", item_id=kotouc_id)

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

# Function to update an existing kotouc
def update_kotouc(kotouc_id, data):   
    # Prepare SQL query
    query = """
        UPDATE d_kotouce
        SET kategorie = %s, obrazek = %s, vektor = %s, 
            cislo_dilu = %s, typ = %s, konkurence_braking = %s, konkurence_ngbrakes = %s, 
            od = %s, hd = %s, id = %s, thk = %s, poznamka = %s, publikovat = %s, 
            aktualizovano = NOW(), aktualizoval = %s 
        WHERE kod = %s
    """
    status = execute_update(sql_query=query, params=(
        data["kategorie"], data["obrazek"], data["vektor"],
        data["cislo_dilu"], data["typ"], data["konkurence_braking"], data["konkurence_ngbrakes"],
        data.get("od"), data.get("hd"), data.get("id"), data.get("thk"),
        data["poznamka"], data["publikovat"], data["aktualizoval"], kotouc_id
    ))
    return status

# Function to create a new kotouc
def create_kotouc(data):
    # Prepare SQL query
    query = """
        INSERT INTO d_kotouce (sortiment, kategorie, obrazek, vektor, cislo_dilu, typ, konkurence_braking, 
        konkurence_ngbrakes, od, hd, id, thk, poznamka, publikovat, aktualizovano, aktualizoval) 
        VALUES (2, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), %s)
    """
    new_id = insert_record(sql_query=query, params=(
        data["kategorie"], data["obrazek"], data["vektor"],
        data["cislo_dilu"], data["typ"], data["konkurence_braking"], data["konkurence_ngbrakes"],
        data.get("od"), data.get("hd"), data.get("id"), data.get("thk"),
        data["poznamka"], data["publikovat"], data["aktualizoval"]
    ), return_id=True)
    return new_id

# Change state of publikovat
def kotouc_publication(kotouc_id: int, publikovat: int):
    state = set_publication_state(sql_table="d_kotouce", publikovat=publikovat, item_id=kotouc_id)
    return state

# Find specific kotouce by given parameters
def get_filtered_kotouce(limit: int = None, page: int = None, states: bool = False, filters: dict = None):
    # Prepare SQL query and add kod
    query = """
    SELECT kod, cislo_dilu, obrazek, vektor, vnejsi_prumer, roztecny_prumer, vnitrni_prumer, tloustka, typ, pozice
    FROM v_kotouc_detail
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
    kotouce = []
    for record in records:
        kotouc = {
            "kod": record["kod"],
            "cislo_dilu": record["cislo_dilu"],
            "obrazek": record["obrazek"],
            "vektor": record["vektor"],
            "vnejsi_prumer": float(record["vnejsi_prumer"]) if record["vnejsi_prumer"] is not None else None,
            "roztecny_prumer": float(record["roztecny_prumer"]) if record["roztecny_prumer"] is not None else None,
            "vnitrni_prumer": float(record["vnitrni_prumer"]) if record["vnitrni_prumer"] is not None else None,
            "tloustka": float(record["tloustka"]) if record["tloustka"] is not None else None,
            "typ": record["typ"],
            "pozice": record["pozice"]
        }
        kotouce.append(kotouc)
    
    # Return list of matching kotouce dictionaries
    return kotouce if kotouce else None

# Get vozidla for specific kotouce
def get_vozidla_for_kotouc(limit: int = None, page: int = None, states: bool = False, kotouc_id: int = None):
    # Prepare SQL query and add kod
    query = """
    SELECT *
    FROM v_vozidlo_kotouc
    WHERE kod = %s
    """
    params = [kotouc_id]
    query += " AND publikovat in (0,1)" if states else " AND Publikovat = 1"
    query += " ORDER BY vyrobce ASC, oznaceni_vozidla ASC"
    
    # Execute query and get records
    records = get_records(sql_query=query, params=params, limit=limit, page=page)
    if not records:
        return None

    kotouce = []
    for record in records:
        kotouc = VozidloKotouc(
            kod=record["kod"],
            cislo_dilu=record["cislo_dilu"],
            kategorie=record["kategorie"],
            subkategorie=record["subkategorie"],
            vyrobce=record["vyrobce"],
            vozidlo=record["vozidlo"],
            oznaceni_vozidla=record["oznaceni_vozidla"],
            typ_vozidla=record["typ_vozidla"],
            objem=float(record["objem"]) if record["objem"] is not None else None,
            obrazek=record["obrazek"],
            vektor=record["vektor"],
            vnejsi_prumer=float(record["vnejsi_prumer"]) if record["vnejsi_prumer"] is not None else None,
            roztecny_prumer=float(record["roztecny_prumer"]) if record["roztecny_prumer"] is not None else None,
            vnitrni_prumer=float(record["vnitrni_prumer"]) if record["vnitrni_prumer"] is not None else None,
            tloustka=float(record["tloustka"]) if record["tloustka"] is not None else None,
            typ=record["typ"],
            rok_od=record["rok_od"],
            rok_do=record["rok_do"],
            pozice=record["pozice"],
            publikovat=bool(record["publikovat"])
        )

        # Append kotouc object to list
        kotouce.append(kotouc)
        
    # Return list of matching kotouce objects
    return kotouce if kotouce else None