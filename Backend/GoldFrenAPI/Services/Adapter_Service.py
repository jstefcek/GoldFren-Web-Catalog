# Business logic for the Adapter Service

# Imports
from datetime import datetime
from GoldFrenAPI.Models.Adaptery import Adapter
from GoldFrenAPI.Services.Service_utils import (
    set_publication_state, 
    get_all_items,
    get_item_by_id,
    execute_update,
    insert_record
)

# Function to get all adapters
def get_adapters(limit: int = None, page: int = None, states: bool = False):
    # Get all items from the database
    records = get_all_items(sql_view="v_adapter_detail", limit=limit, page=page, states=states)
    adapters = []
    
    # Iterate through records
    for record in records:
        # Create adapter object
        adapter = Adapter(
            kod=record["kod"],
            sortiment=record["sortiment"],
            kategorie=record["kategorie"],
            obrazek=record["obrazek"],
            vektor=record["vektor"],
            cislo_dilu=record["cislo_dilu"],
            typ=record["typ"],
            prumer=float(record["prumer"]) if record["prumer"] is not None else None,
            popis=record["popis"],
            typ_uchyceni=record["typ_uchyceni"],
            roztec_brzdice=float(record["roztec_brzdic"]) if record["roztec_brzdic"] is not None else None,
            poznamka=record["poznamka"],
            publikovat=bool(record["publikovat"]),
            aktualizovano=record["aktualizovano"] if isinstance(record["aktualizovano"], datetime) else None,
            aktualizoval=record["aktualizoval"]
        )
        
        # Append adapter object to list
        adapters.append(adapter)
    
    # Return list of adapter objects
    return adapters
    
# Function to get a single adapter by ID
def get_adapter(adapter_id):
    # Get item by ID from the database
    record = get_item_by_id(sql_view="v_adapter_detail", item_id=adapter_id)
        
    # Check if record exists
    if record:
        return Adapter(
            kod=record["kod"],
            sortiment=record["sortiment"],
            kategorie=record["kategorie"],
            obrazek=record["obrazek"],
            vektor=record["vektor"],
            cislo_dilu=record["cislo_dilu"],
            typ=record["typ"],
            prumer=float(record["prumer"]) if record["prumer"] is not None else None,
            popis=record["popis"],
            typ_uchyceni=record["typ_uchyceni"],
            roztec_brzdice=float(record["roztec_brzdic"]) if record["roztec_brzdic"] is not None else None,
            poznamka=record["poznamka"],
            publikovat=bool(record["publikovat"]),
            aktualizovano=record["aktualizovano"] if isinstance(record["aktualizovano"], datetime) else None,
            aktualizoval=record["aktualizoval"]
        )

# Function to update an existing adapter
def update_adapter(adapter_id, data):
    # Update data about adapter in the database
    query = """
        UPDATE d_adapter 
        SET kategorie = %s, obrazek = %s, vektor = %s, 
            cislo_dilu = %s, typ = %s, prumer = %s, popis = %s, 
            poznamka = %s, publikovat = %s, aktualizovano = NOW(), aktualizoval = %s 
        WHERE kod = %s
    """
    status = execute_update(sql_query=query, params=(
        data["kategorie"], data["obrazek"], data["vektor"],
        data["cislo_dilu"], data["typ"], data.get("prumer"), data["popis"],
        data["poznamka"], data["publikovat"], data["aktualizoval"], adapter_id
    ))
    
    # Update info about adapter attachment to database
    query_attachment = """
        UPDATE d_adapter_attachment 
        SET typ_uchyceni = %s, roztec_brzdic = %s 
        WHERE adapter_kod = %s
    """
    status = execute_update(sql_query=query_attachment, params=(
        data["typ_uchyceni"], data["roztec_brzdic"], adapter_id
    ))
    
    return status

# Function to create a new adapter
def create_adapter(data):
    # Prepare SQL query for adapter
    query = """
        INSERT INTO d_adapter (sortiment, kategorie, obrazek, vektor, 
            cislo_dilu, typ, prumer, popis, poznamka, publikovat, aktualizovano, aktualizoval) 
        VALUES (6, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), %s)
    """
    new_id = insert_record(sql_query=query, 
        params=(data["kategorie"], data["obrazek"], data["vektor"],
        data["cislo_dilu"], data["typ"], data.get("prumer"), data["popis"],
        data["poznamka"], data["publikovat"], data["aktualizoval"]
    ), 
    return_id=True)
        
    # Insert info about adapter attachment to database
    query_attachment = """
        INSERT INTO d_adapter_attachment (typ_uchyceni, roztec_brzdic) 
        VALUES (%s, %s)
    """
    insert_record(sql_query=query_attachment, 
        params=(data["typ_uchyceni"], data["roztec_brzdic"]
    ))
    return new_id

# Change state of publikovat
def adapter_publication(adapter_id: int, publikovat: int):
    state = set_publication_state(sql_table="d_adapter", publikovat=publikovat, item_id=adapter_id)
    return state