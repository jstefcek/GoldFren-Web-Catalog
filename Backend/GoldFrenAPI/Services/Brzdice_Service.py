# Business logic for the Brzdice Service

# Imports
from datetime import datetime
from GoldFrenAPI.Models.Brzdice import Brzdic, VozidloBrzdic
from GoldFrenAPI.Services.Service_utils import (
    set_publication_state, 
    get_all_items,
    get_item_by_id,
    execute_update,
    insert_record,
    get_records
)
from GoldFrenAPI.utils.utils import prepare_sql_filters

# Function to get all brzdice
def get_brzdice(limit: int = None, page: int = None, states: bool = False):
    # Get all items from the database
    query = """
        SELECT *
        FROM v_brzdice_detail"""
    query += " WHERE Publikovat in (0,1)" if states else " WHERE Publikovat = 1"
    records = get_records(sql_query=query, limit=limit, page=page)
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
    record = get_item_by_id(sql_view="v_brzdice_detail", item_id=brzdic_id)
        
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

# Find specific brzdic by given parameters
def get_filtered_brzdice(limit: int = None, page: int = None, states: bool = False, filters: dict = None):
    # Prepare SQL query and add kod
    query = """
    SELECT DISTINCT kod, cislo_dilu, obrazek, vektor, pozice, pocet_pistku, typ_uchyceni FROM v_vozidlo_brzdic
    """
    params = []
    filter_condition = []

    # Apply publication filter
    filter_condition.append("publikovat in (0,1)" if states else "Publikovat = 1")

    # Dynamic filters from dictionary
    filter_condition, params = prepare_sql_filters(filters=filters, filter_condition=filter_condition, params=params)

    # Append filters to base query
    if filter_condition:
        query += " WHERE " + " AND ".join(filter_condition)
    
    # Execute query and get records
    records = get_records(sql_query=query, params=params, limit=limit, page=page)
    if not records:
        return None
    
    brzdice = []
    for record in records:
        brzdic = {
            "kod": record["kod"],
            "cislo_dilu": record["cislo_dilu"],
            "obrazek": record["obrazek"],
            "vektor": record["vektor"],
            "pozice": record["pozice"],
            "pocet_pistku": record["pocet_pistku"],
            "typ_uchyceni": record["typ_uchyceni"],
        }
        
        brzdice.append(brzdic)
    
    # Return list of matching brzdice dictionaries
    return brzdice if brzdice else None

# Find specific vozidlo for brzdic
def get_vozidla_for_brzdic(limit: int = None, page: int = None, states: bool = False, brzdic_id: int = None):
    # Prepare SQL query and add kod
    query = """
    SELECT *
    FROM v_vozidlo_brzdic
    WHERE kod = %s
    """
    params = [brzdic_id]
    query += " AND publikovat in (0,1)" if states else " AND Publikovat = 1"
    query += " ORDER BY vyrobce ASC, oznaceni_vozidla ASC"

    # Execute query and get records
    records = get_records(sql_query=query, params=params, limit=limit, page=page)
    if not records:
        return None

    brzdice = []
    for record in records:
        # Create adapter object
        brzdic = VozidloBrzdic(
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
            typ_uchyceni=record["typ_uchyceni"],
            pocet_pistku=float(record["pocet_pistku"]) if record["pocet_pistku"] is not None else None,
            specialni_oznaceni=record["specialni_oznaceni"],
            rok_od=record["rok_od"],
            rok_do=record["rok_do"],
            pozice=record["pozice"],
            publikovat=record["publikovat"]
        )
            
        # Append brzdic object to list
        brzdice.append(brzdic)
        
    # Return list of matching brzdice objects
    return brzdice if brzdice else None