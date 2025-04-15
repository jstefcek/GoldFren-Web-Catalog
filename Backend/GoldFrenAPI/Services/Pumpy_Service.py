# Business logic for the Pumpy Service

# Imports
from datetime import datetime
from GoldFrenAPI.Models.Pumpy import Pumpa
from GoldFrenAPI.Services.Service_utils import (
    set_publication_state, 
    get_all_items,
    get_item_by_id,
    execute_update,
    insert_record
)

# Function to get all pumpy from database
def get_pumpy(limit: int = None, page: int = None, states: bool = False):
    # Get all items from the database
    records = get_all_items(sql_view="v_pumpy_detail", limit=limit, page=page, states=states)
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