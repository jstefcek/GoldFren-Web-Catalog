# Business logic for the Brzdice Service

# Imports
from datetime import datetime
from GoldFrenAPI.Models.Brzdice import Brzdic
from GoldFrenAPI.Services.Service_utils import (
    set_publication_state, 
    get_all_items,
    get_item_by_id,
    execute_update,
    insert_record
)

# Function to get all brzdice
def get_brzdice(limit: int = None, page: int = None, states: bool = False):
    # Get all items from the database
    records = get_all_items(sql_view="v_brzdice_detail", limit=limit, page=page, states=states)
    brzdice = []
    
    # Iterate through records
    for record in records:
        # Create brzdic object
        brzdic = Brzdic(
            kod=record["kod"],
            sortiment=record["sortiment"],
            kategorie=record["kategorie"],
            obrazek=record["obrazek"],
            vektor=record["vektor"],
            cislo_dilu=record["cislo_dilu"],
            popis=record["popis"],
            typ_uchyceni=record["typ_uchyceni"],
            pocet_pistku=record["pocet_pistku"],
            poznamka=record["poznamka"],
            publikovat=bool(record["publikovat"]),
            aktualizovano=record["aktualizovano"] if isinstance(record["aktualizovano"], datetime) else None,
            aktualizoval=record["aktualizoval"]
        )
        
        # Append brzdice object to list
        brzdice.append(brzdic)
        
    # Return list of brzdice objects
    return brzdice
    
# Function to get a single brzidc by ID
def get_brzdic(brzdic_id: int):
    # Get item by ID from the database
    record = get_item_by_id(sql_view="v_adapter_detail", item_id=brzdic_id)
        
    # Check if record exists
    if record:
        return Brzdic(
            kod=record["kod"],
            sortiment=record["sortiment"],
            kategorie=record["kategorie"],
            obrazek=record["obrazek"],
            vektor=record["vektor"],
            cislo_dilu=record["cislo_dilu"],
            popis=record["popis"],
            typ_uchyceni=record["typ_uchyceni"],
            pocet_pistku=record["pocet_pistku"],
            poznamka=record["poznamka"],
            publikovat=bool(record["publikovat"]),
            aktualizovano=record["aktualizovano"] if isinstance(record["aktualizovano"], datetime) else None,
            aktualizoval=record["aktualizoval"]
        )
    
# Function to update an existing brzdic
def update_brzdic(brzdic_id: int, data: dict):
    # Prepare SQL query
    query = """
        UPDATE d_brzdice 
        SET kategorie = %s, obrazek = %s, vektor = %s, 
            cislo_dilu = %s, popis = %s, typ_uchyceni = %s, pocet_pistku = %s, poznamka = %s, 
            publikovat = %s, aktualizovano = NOW(), aktualizoval = %s 
        WHERE kod = %s
    """
    status = execute_update(sql_query=query, params=(
                data["kategorie"], data["obrazek"], data["vektor"],
                data["cislo_dilu"], data["popis"], data["typ_uchyceni"], data["pocet_pistku"], data["poznamka"], 
                data["publikovat"], data["aktualizoval"], brzdic_id
            ))
    
    # Return status
    return status
    
# Function to create a new brzdic
def create_brzdic(data: dict):
    # Prepare SQL query for inserting new brzdic to database
    query = """
        INSERT INTO d_brzdice (sortiment, kategorie, obrazek, vektor, 
            cislo_dilu, popis, typ_uchyceni, poznamka, pocet_pistku, publikovat, aktualizovano, aktualizoval) 
        VALUES (3, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), %s)
    """
    new_id = insert_record(sql_query=query, 
        params=(data["kategorie"], data["obrazek"], data["vektor"],
        data["cislo_dilu"], data["popis"], data["typ_uchyceni"], data["pocet_pistku"], data["poznamka"], 
        data["publikovat"], data["aktualizoval"]),
        return_id=True
    )
    return new_id

# Change state of publikovat
def brzdice_publication(brzdic_id, publikovat):
    state = set_publication_state(sql_table="d_brzdice", publikovat=publikovat, item_id=brzdic_id)
    return state