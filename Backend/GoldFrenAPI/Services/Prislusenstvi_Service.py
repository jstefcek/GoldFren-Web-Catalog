# Business logic for the Hadicky Service

# Imports
from datetime import datetime
from GoldFrenAPI.Models.Prislusenstvi import Prislusenstvi
from GoldFrenAPI.Services.Service_utils import (
    set_publication_state, 
    get_all_items,
    get_item_by_id,
    execute_update,
    insert_record
)

# Function to get all prislusenstvi from database
def get_prislusenstvi(limit: int = None, page: int = None, states: bool = False):
    # Get all items from the database
    records = get_all_items(sql_view="v_prislusenstvi_detail", limit=limit, page=page, states=states)
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
        VALUES (3, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), %s)
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