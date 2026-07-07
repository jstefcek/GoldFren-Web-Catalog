# Business logic for the Adapter Service

# Imports
from datetime import datetime
from GoldFrenAPI.Models.Adaptery import Adapter, VozidloAdapter
from GoldFrenAPI.Services.Service_utils import (
    set_publication_state, 
    get_item_by_id,
    execute_update,
    insert_record,
    get_records
)
from Components.MySQL import connection
from GoldFrenAPI.utils.utils import prepare_sql_filters, change_category_label

# Function to get all adapters
def get_adapters(limit: int = None, page: int = None, states: bool = False):
    # Get all items from the database
    query = """
        SELECT *
        FROM v_adapter_detail
        """
    query += " WHERE Publikovat in (0,1)" if states else " WHERE Publikovat = 1"
    records = get_records(sql_query=query, limit=limit, page=page)
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
        
        # Change adapter category
        adapter.kategorie = change_category_label(adapter.kategorie)

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
    adapter_query = """
        INSERT INTO d_adapter (sortiment, kategorie, obrazek, vektor,
            cislo_dilu, typ, prumer, popis, poznamka, publikovat, aktualizovano, aktualizoval)
        VALUES (6, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), %s)
    """
    attachment_query = """
        INSERT INTO d_adapter_attachment (adapter_kod, typ_uchyceni, roztec_brzdic)
        VALUES (%s, %s, %s)
    """

    try:
        with connection(commit=True) as conn:
            if conn is None:
                print("Connection failed")
                return None

            cursor = None
            try:
                cursor = conn.cursor()
                cursor.execute(adapter_query, (
                    data["kategorie"], data["obrazek"], data["vektor"],
                    data["cislo_dilu"], data["typ"], data.get("prumer"), data["popis"],
                    data["poznamka"], data["publikovat"], data["aktualizoval"]
                ))
                new_id = cursor.lastrowid
                cursor.execute(attachment_query, (
                    new_id, data["typ_uchyceni"], data["roztec_brzdic"]
                ))
                return new_id
            finally:
                if cursor is not None:
                    cursor.close()
    except Exception as ex:
        print(ex)
        return None

# Change state of publikovat
def adapter_publication(adapter_id: int, publikovat: int):
    state = set_publication_state(sql_table="d_adapter", publikovat=publikovat, item_id=adapter_id)
    return state

# Find specific adapter by given parameters
def get_filtered_adapters(limit: int = None, page: int = None, states: bool = False, filters: dict = None):
    # Prepare SQL query and add kod
    query = """
    SELECT DISTINCT kod, cislo_dilu, obrazek, vektor, pozice, prumer, typ_uchyceni, roztec_brzdic
    FROM v_vozidlo_adapter
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
    
    adapters = []
    for record in records:
        adapter = {
            "kod": record["kod"],
            "cislo_dilu": record["cislo_dilu"],
            "obrazek": record["obrazek"],
            "vektor": record["vektor"],
            "pozice": record["pozice"],
            "prumer": float(record["prumer"]) if record["prumer"] is not None else None,
            "typ_uchyceni": record["typ_uchyceni"],
            "roztec_brzdic": float(record["roztec_brzdic"]) if record["roztec_brzdic"] is not None else None,
        }
        
        adapters.append(adapter)
    
    # Return list of matching adapter dictionaries
    return adapters if adapters else None

# Get vozidla for specific adapter
def get_vozidla_for_adapter(limit: int = None, page: int = None, states: bool = False, adapter_id: int = None):
    # Prepare SQL query and add kod
    query = """
    SELECT *
    FROM v_vozidlo_adapter
    WHERE kod = %s
    """
    params = [adapter_id]
    query += " AND publikovat in (0,1)" if states else " AND Publikovat = 1"

    # Execute query and get records
    records = get_records(sql_query=query, params=params, limit=limit, page=page)
    if not records:
        return None

    adapters = []
    for record in records:
        # Create adapter object
        adapter = VozidloAdapter(
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
            prumer=float(record["prumer"]) if record["prumer"] is not None else None,
            typ_uchyceni=record["typ_uchyceni"],
            roztec_brzdic=float(record["roztec_brzdic"]) if record["roztec_brzdic"] is not None else None,
            specialni_oznaceni=record["specialni_oznaceni"],
            rok_od=record["rok_od"],
            rok_do=record["rok_do"],
            pozice=record["pozice"],
            publikovat=bool(record["publikovat"]) if record["publikovat"] is not None else None,
        )
            
        # Append adapter object to list
        adapters.append(adapter)
        
    # Return list of matching adapters objects
    return adapters if adapters else None
