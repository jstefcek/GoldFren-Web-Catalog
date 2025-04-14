# Business logic for the Hadicky Service

# Imports
from datetime import datetime
from GoldFrenAPI.Models.Hadicky import Hadicka
from GoldFrenAPI.Services.Service_utils import (
    set_publication_state, 
    get_all_items,
    get_item_by_id,
    execute_update,
    insert_record
)

# Function to get all hadicky from database
def get_hadicky(limit: int = None, page: int = None, states: bool = False):
    # Get all items from the database
    records = get_all_items(sql_view="v_hadicky_detail", limit=limit, page=page, states=states)
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
        VALUES (3, %s, %s, %s, %s, %s, %s, %s, NOW(), %s)
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