# Business logic for the Hadicky Service

# Imports
from datetime import datetime
from GoldFrenAPI.Models.Prislusenstvi import Prislusenstvi, VozidloPrislusenstvi
from GoldFrenAPI.Services.Service_utils import (
    set_publication_state, 
    get_item_by_id,
    execute_update,
    insert_record,
    get_records,
)
from GoldFrenAPI.utils.utils import (
    prepare_sql_filters
)

# Function to get all prislusenstvi from database
def get_prislusenstvi(limit: int = None, page: int = None, states: bool = False):
    # Get all items from the database
    query = """
        SELECT *
        FROM v_prislusenstvi_detail"""
    query += " WHERE Publikovat in (0,1)" if states else " WHERE Publikovat = 1"
    query += " ORDER BY cislo_dilu ASC"
    records = get_records(sql_query=query, limit=limit, page=page)
    all_prislusenstvi = []
    
    # Iterate through records
    for record in records:
        # Create brzdic object
        prislusenstvi = Prislusenstvi(
            kod=record["kod"],
            sortiment=record["sortiment"],
            kategorie=record["kategorie"],
            obrazek=record["obrazek"],
            vektor=record["vektor"],
            cislo_dilu=record["cislo_dilu"],
            typ=record["typ"],
            popis=record["popis"],
            poznamka=record["poznamka"],
            publikovat=bool(record["publikovat"]),
            aktualizovano=record["aktualizovano"] if isinstance(record["aktualizovano"], datetime) else None,
            aktualizoval=record["aktualizoval"]
        )
        
        # Append prislusenstvi object to list
        all_prislusenstvi.append(prislusenstvi)
        
    # Return list of all prislusenstvi objects
    return all_prislusenstvi

# Function to get a single prislusenstvi by ID
def get_one_prislusenstvi(prislusenstvi_id: int):
    # Get item by ID from the database
    record = get_item_by_id(sql_view="v_prislusenstvi_detail", item_id=prislusenstvi_id)
        
    # Check if record exists
    if record:
        return Prislusenstvi(
            kod=record["kod"],
            sortiment=record["sortiment"],
            kategorie=record["kategorie"],
            obrazek=record["obrazek"],
            vektor=record["vektor"],
            cislo_dilu=record["cislo_dilu"],
            typ=record["typ"],
            popis=record["popis"],
            poznamka=record["poznamka"],
            publikovat=bool(record["publikovat"]),
            aktualizovano=record["aktualizovano"] if isinstance(record["aktualizovano"], datetime) else None,
            aktualizoval=record["aktualizoval"]
        )
        
# Function to update an existing prislusenstvi
def update_prislusenstvi(prislusenstvi_id: int, data: dict):
    # Prepare SQL query
    query = """
        UPDATE d_prislusenstvi
        SET kategorie = %s, obrazek = %s, vektor = %s, 
            cislo_dilu = %s, typ = %s, popis = %s, poznamka = %s, 
            publikovat = %s, aktualizovano = NOW(), aktualizoval = %s 
        WHERE kod = %s
    """
    status = execute_update(sql_query=query, params=(
                data["kategorie"], data["obrazek"], data["vektor"],
                data["cislo_dilu"], data["typ"], data["popis"], data["poznamka"], 
                data["publikovat"], data["aktualizoval"], prislusenstvi_id
            ))
    
    # Return status
    return status

# Function to create a new pumpa
def create_prislusenstvi(data: dict):
    # Prepare SQL query for inserting new prislusenstvi to database
    query = """
        INSERT INTO d_prislusenstvi (sortiment, kategorie, obrazek, vektor, 
            cislo_dilu, typ, popis, poznamka, publikovat, aktualizovano, aktualizoval) 
        VALUES (5, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), %s)
    """
    new_id = insert_record(sql_query=query, 
        params=(data["kategorie"], data["obrazek"], data["vektor"],
        data["cislo_dilu"], data["typ"], data["popis"], data["poznamka"], 
        data["publikovat"], data["aktualizoval"]),
        return_id=True
    )
    return new_id

# Change state of publikovat
def prislusenstvi_publication(prislusenstvi_id, publikovat):
    state = set_publication_state(sql_table="d_prislusenstvi", publikovat=publikovat, item_id=prislusenstvi_id)
    return state

# Find specific prisliusenstvi by given parameters
def get_filtered_prislusenstvi(limit: int = None, page: int = None, states: bool = False, filters: dict = None):
    # Prepare SQL query and add kod
    query = """
    SELECT DISTINCT kod, sortiment, kategorie, obrazek, vektor, cislo_dilu, typ, popis, poznamka 
    FROM v_prislusenstvi_detail
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
    prislusentsvi = []
    for record in records:
        obj_prislusenstvi = {
            "kod": record["kod"],
            "cislo_dilu": record["cislo_dilu"],
            "obrazek": record["obrazek"],
            "vektor": record["vektor"],
            "typ": record["typ"],
            "poznamka": record["poznamka"],
            "pozice": record["pozice"]
        }
        prislusentsvi.append(obj_prislusenstvi)
    
    # Return list of matching prislusenstvi dictionaries
    return prislusentsvi if prislusentsvi else None

# Get vozidla for specific prislusenstvi
def get_vozidla_for_prislusenstvi(limit: int = None, page: int = None, states: bool = False, prislusenstvi_id: int = None):
    # Prepare SQL query and add kod
    query = """
    SELECT *
    FROM v_vozidlo_prislusenstvi
    WHERE kod = %s
    """
    params = [prislusenstvi_id]
    query += " AND publikovat in (0,1)" if states else " AND Publikovat = 1"
    query += " ORDER BY vyrobce ASC, oznaceni_vozidla ASC"
    
    # Execute query and get records
    records = get_records(sql_query=query, params=params, limit=limit, page=page)
    if not records:
        return None

    prislusenstvi = []
    for record in records:
        obj_prislusenstvi = VozidloPrislusenstvi(
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
            typ=record["typ"],
            rok_od=record["rok_od"],
            rok_do=record["rok_do"],
            pozice=record["pozice"],
            publikovat=bool(record["publikovat"])
        )

        # Append prislusenstvi object to list
        prislusenstvi.append(obj_prislusenstvi)
        
    # Return list of matching prislusenstvi objects
    return prislusenstvi if prislusenstvi else None