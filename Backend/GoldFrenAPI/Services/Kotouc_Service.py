# Business logic for the Kotouc Service

# Imports
from datetime import datetime
from Components.MySQL import connect
from GoldFrenAPI.Models.Kotouce import Kotouc
from GoldFrenAPI.Services.Service_utils import (
    set_publication_state, 
    get_all_items,
    get_item_by_id,
    execute_update,
    insert_record
)

# Function to get all adapters
def get_kotouce(limit: int = None, page: int = None, states: bool = False):
    # Get all items from the database
    records = get_all_items(sql_view="v_kotouc_detail", limit=limit, page=page, states=states)
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