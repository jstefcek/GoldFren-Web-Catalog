# Business logic for the Hadicky Service

# Imports
from datetime import datetime
from GoldFrenAPI.Models.Hadicky import Hadicka, VozidloHadicka
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

# Function to get all hadicky from database
def get_hadicky(limit: int = None, page: int = None, states: bool = False):
    # Get all items from the database
    query = """
        SELECT *
        FROM v_hadicky_detail"""
    query += " WHERE Publikovat in (0,1)" if states else " WHERE Publikovat = 1"
    query += " ORDER BY cislo_dilu ASC"
    records = get_records(sql_query=query, limit=limit, page=page)
    hadicky = []
    
    # Iterate through records
    for record in records:
        # Create brzdic object
        hadicka = Hadicka(
            kod=record["kod"],
            sortiment=record["sortiment"],
            kategorie=record["kategorie"],
            obrazek=record["obrazek"],
            vektor=record["vektor"],
            cislo_dilu=record["cislo_dilu"],
            popis=record["popis"],
            poznamka=record["poznamka"],
            publikovat=bool(record["publikovat"]),
            aktualizovano=record["aktualizovano"] if isinstance(record["aktualizovano"], datetime) else None,
            aktualizoval=record["aktualizoval"]
        )
        
        # Append hadicka object to list
        hadicky.append(hadicka)
        
    # Return list of hadicky objects
    return hadicky

# Function to get a single hadicka by ID
def get_hadicka(hadicka_id: int):
    # Get item by ID from the database
    record = get_item_by_id(sql_view="v_hadicky_detail", item_id=hadicka_id)
        
    # Check if record exists
    if record:
        return Hadicka(
            kod=record["kod"],
            sortiment=record["sortiment"],
            kategorie=record["kategorie"],
            obrazek=record["obrazek"],
            vektor=record["vektor"],
            cislo_dilu=record["cislo_dilu"],
            popis=record["popis"],
            poznamka=record["poznamka"],
            publikovat=bool(record["publikovat"]),
            aktualizovano=record["aktualizovano"] if isinstance(record["aktualizovano"], datetime) else None,
            aktualizoval=record["aktualizoval"]
        )
        
# Function to update an existing hadicka
def update_hadicka(hadicka_id: int, data: dict):
    # Prepare SQL query
    query = """
        UPDATE d_hadicka 
        SET kategorie = %s, obrazek = %s, vektor = %s, 
            cislo_dilu = %s, popis = %s, poznamka = %s, 
            publikovat = %s, aktualizovano = NOW(), aktualizoval = %s 
        WHERE kod = %s
    """
    status = execute_update(sql_query=query, params=(
                data["kategorie"], data["obrazek"], data["vektor"],
                data["cislo_dilu"], data["popis"], data["poznamka"], 
                data["publikovat"], data["aktualizoval"], hadicka_id
            ))
    
    # Return status
    return status

# Function to create a new hadicka
def create_hadicka(data: dict):
    # Prepare SQL query for inserting new hadicka to database
    query = """
        INSERT INTO d_hadicka (sortiment, kategorie, obrazek, vektor, 
            cislo_dilu, popis, poznamka, publikovat, aktualizovano, aktualizoval) 
        VALUES (4, %s, %s, %s, %s, %s, %s, %s, NOW(), %s)
    """
    new_id = insert_record(sql_query=query, 
        params=(data["kategorie"], data["obrazek"], data["vektor"],
        data["cislo_dilu"], data["popis"], data["poznamka"], 
        data["publikovat"], data["aktualizoval"]),
        return_id=True
    )
    return new_id

# Change state of publikovat
def hadicka_publication(hadicka_id, publikovat):
    state = set_publication_state(sql_table="d_hadicka", publikovat=publikovat, item_id=hadicka_id)
    return state

# Find specific hadicky by given parameters
def get_filtered_hadicky(limit: int = None, page: int = None, states: bool = False, filters: dict = None):
    # Prepare SQL query and add kod
    query = """
    SELECT DISTINCT kod, cislo_dilu, obrazek, vektor, poznamka, pozice
    FROM v_vozidlo_hadicky
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
    hadicky = []
    for record in records:
        hadicka = {
            "kod": record["kod"],
            "cislo_dilu": record["cislo_dilu"],
            "obrazek": record["obrazek"],
            "vektor": record["vektor"],
            "poznamka": record["poznamka"],
            "pozice": record["pozice"],
        }
        hadicky.append(hadicka)
    
    # Return list of matching hadicky dictionaries
    return hadicky if hadicky else None

# Get vozidla for specific hadicka
def get_vozidla_for_hadicka(limit: int = None, page: int = None, states: bool = False, hadicka_id: int = None):
    # Prepare SQL query and add kod
    query = """
    SELECT *
    FROM v_vozidlo_hadicka
    WHERE kod = %s
    """
    params = [hadicka_id]
    query += " AND publikovat in (0,1)" if states else " AND Publikovat = 1"
    query += " ORDER BY vyrobce ASC, oznaceni_vozidla ASC"
    
    # Execute query and get records
    records = get_records(sql_query=query, params=params, limit=limit, page=page)
    if not records:
        return None

    hadicky = []
    for record in records:
        hadicka = VozidloHadicka(
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
            poznamka=record["poznamka"],
            specialni_oznaceni=record["specialni_oznaceni"],
            rok_od=record["rok_od"],
            rok_do=record["rok_do"],
            pozice=record["pozice"],
            publikovat=bool(record["publikovat"]) if record["publikovat"] is not None else None
        )

        # Append hadicka object to list
        hadicky.append(hadicka)
        
    # Return list of matching hadicka objects
    return hadicky if hadicky else None