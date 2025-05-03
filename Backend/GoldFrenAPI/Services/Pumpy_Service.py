# Business logic for the Pumpy Service

# Imports
from datetime import datetime
from GoldFrenAPI.Models.Pumpy import Pumpa, VozidloPumpa
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

# Function to get all pumpy from database
def get_pumpy(limit: int = None, page: int = None, states: bool = False):
    # Get all items from the database
    query = """
            SELECT *
            FROM v_pumpy_detail
            """
    query += " WHERE Publikovat in (0,1)" if states else " WHERE Publikovat = 1"
    query += " ORDER BY cislo_dilu ASC"
    records = get_records(sql_query=query, limit=limit, page=page)
    pumpy = []
    
    # Iterate through records
    for record in records:
        # Create brzdic object
        pumpa = Pumpa(
            kod=record["kod"],
            sortiment=record["sortiment"],
            kategorie=record["kategorie"],
            obrazek=record["obrazek"],
            vektor=record["vektor"],
            cislo_dilu=record["cislo_dilu"],
            prumer=record["prumer"],
            popis=record["popis"],
            poznamka=record["poznamka"],
            publikovat=bool(record["publikovat"]),
            aktualizovano=record["aktualizovano"] if isinstance(record["aktualizovano"], datetime) else None,
            aktualizoval=record["aktualizoval"]
        )
        
        # Append pumpy object to list
        pumpy.append(pumpa)
        
    # Return list of pumpy objects
    return pumpy

# Function to get a single hadicka by ID
def get_pumpa(pumpa_id: int):
    # Get item by ID from the database
    record = get_item_by_id(sql_view="v_pumpy_detail", item_id=pumpa_id)
        
    # Check if record exists
    if record:
        return Pumpa(
            kod=record["kod"],
            sortiment=record["sortiment"],
            kategorie=record["kategorie"],
            obrazek=record["obrazek"],
            vektor=record["vektor"],
            cislo_dilu=record["cislo_dilu"],
            prumer=float(record["prumer"]) if record["prumer"] is not None else None,
            popis=record["popis"],
            poznamka=record["poznamka"],
            publikovat=bool(record["publikovat"]),
            aktualizovano=record["aktualizovano"] if isinstance(record["aktualizovano"], datetime) else None,
            aktualizoval=record["aktualizoval"]
        )
        
# Function to update an existing pumpa
def update_pumpa(pumpa_id: int, data: dict):
    # Prepare SQL query
    query = """
        UPDATE d_pumpa
        SET kategorie = %s, obrazek = %s, vektor = %s, 
            cislo_dilu = %s, prumer = %s, popis = %s, poznamka = %s, 
            publikovat = %s, aktualizovano = NOW(), aktualizoval = %s 
        WHERE kod = %s
    """
    status = execute_update(sql_query=query, params=(
                data["kategorie"], data["obrazek"], data["vektor"],
                data["cislo_dilu"], data["prumer"], data["popis"], data["poznamka"], 
                data["publikovat"], data["aktualizoval"], pumpa_id
            ))
    
    # Return status
    return status

# Function to create a new pumpa
def create_pumpa(data: dict):
    # Prepare SQL query for inserting new pumpa to database
    query = """
        INSERT INTO d_pumpa (sortiment, kategorie, obrazek, vektor, 
            cislo_dilu, prumer, popis, poznamka, publikovat, aktualizovano, aktualizoval) 
        VALUES (7, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), %s)
    """
    new_id = insert_record(sql_query=query, 
        params=(data["kategorie"], data["obrazek"], data["vektor"],
        data["cislo_dilu"], data["prumer"], data["popis"], data["poznamka"], 
        data["publikovat"], data["aktualizoval"]),
        return_id=True
    )
    return new_id

# Change state of publikovat
def pumpa_publication(pumpa_id, publikovat):
    state = set_publication_state(sql_table="d_pumpa", publikovat=publikovat, item_id=pumpa_id)
    return state

# Find specific pumpy by given parameters
def get_filtered_pumpy(limit: int = None, page: int = None, states: bool = False, filters: dict = None):
    # Prepare SQL query and add kod
    query = """
    SELECT DISTINCT kod, obrazek, vektor, cislo_dilu, typ, prumer, popis, poznamka, pozice
    FROM v_vozidlo_pumpa
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
    pumpy = []
    for record in records:
        pumpa = {
            "kod": record["kod"],
            "cislo_dilu": record["cislo_dilu"],
            "obrazek": record["obrazek"],
            "vektor": record["vektor"],
            "typ": record["typ"],
            "prumer": float(record["prumer"]) if record["prumer"] is not None else None,
            "poznamka": record["poznamka"],
            "pozice": record["pozice"]
        }
        pumpy.append(pumpa)
    
    # Return list of matching pumpy dictionaries
    return pumpy if pumpy else None

# Get vozidla for specific pumpa
def get_vozidla_for_pumpa(limit: int = None, page: int = None, states: bool = False, pumpa_id: int = None):
    # Prepare SQL query and add kod
    query = """
    SELECT *
    FROM v_vozidlo_pumpa
    WHERE kod = %s
    """
    params = [pumpa_id]
    query += " AND publikovat in (0,1)" if states else " AND Publikovat = 1"
    query += " ORDER BY vyrobce ASC, oznaceni_vozidla ASC"
    
    # Execute query and get records
    records = get_records(sql_query=query, params=params, limit=limit, page=page)
    if not records:
        return None

    prislusenstvi = []
    for record in records:
        obj_prislusenstvi = VozidloPumpa(
            kod=record["kod"],
            cislo_dilu=record["cislo_dilu"],
            kategorie=record["kategorie"],
            subkategorie=record["subkategorie"],
            vyrobce=record["vyrobce"],
            vozidlo=record["vozidlo"],
            oznaceni_vozidla=record["oznaceni_vozidla"],
            typ=record["typ"],
            objem=float(record["objem"]) if record["objem"] is not None else None,
            obrazek=record["obrazek"],
            vektor=record["vektor"],
            prumer=float(record["prumer"]) if record["prumer"] is not None else None,
            popis=record["popis"],
            poznamka=record["poznamka"],
            specialni_oznaceni=record["specialni_oznaceni"],
            rok_od=record["rok_od"],
            rok_do=record["rok_do"],
            pozice=record["pozice"],
            publikovat=bool(record["publikovat"])
        )

        # Append prislusenstvi object to list
        prislusenstvi.append(obj_prislusenstvi)
        
    # Return list of matching prislusenstvi objects
    return prislusenstvi if prislusenstvi else None