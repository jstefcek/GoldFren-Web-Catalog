# Business logic for the Vyrobce Service

# Imports
from GoldFrenAPI.Models.Vyrobce import Vyrobce
from GoldFrenAPI.Models.Vozidlo import (
    FilteredVozidlo, 
    Vozidlo
)
from GoldFrenAPI.Models.Adaptery import VozidloAdapter
from GoldFrenAPI.Models.Desticky import VozidloDesticka
from GoldFrenAPI.Models.Brzdice import VozidloBrzdic
from GoldFrenAPI.Models.Hadicky import VozidloHadicka
from GoldFrenAPI.Models.Kotouce import VozidloKotouc
from GoldFrenAPI.Models.Pumpy import VozidloPumpa
from GoldFrenAPI.Models.Prislusenstvi import VozidloPrislusenstvi
from GoldFrenAPI.Services.Service_utils import (
    get_filtered_records,
    execute_update,
    insert_record
)
from GoldFrenAPI.utils.utils import change_category_label

def get_vyrobce_by_kategorie(kategorie_id: int, all_params: bool = False):
    """
    Function to get all vyrobce by kategorie ID
    """
    # Prepare SQL query
    query = """SELECT dv.kod, dv.kategorie, ck.nazev as kategorie_nazev, dv.nazev, dv.aktualizovano , dv.aktualizoval
from d_vyrobce dv 
left join c_kategorie ck on dv.kategorie = ck.kod"""
    
    # Add filtering for specific kategorie
    if kategorie_id != "All":
        query += " WHERE kategorie = %s"

    # Add ordering
    query += " ORDER BY nazev ASC"

    # Get all vyrobce from the database based on kategorie ID or all vyrobce when not provided (set as "All")
    if kategorie_id == "All":
        records = get_filtered_records(sql_query=query, params=[])
    else:
        records = get_filtered_records(sql_query=query, params=[kategorie_id])
    vyrobce = []
    
    # Iterate through records
    for record in records:
        # Create vyrobce object
        vyrobce_obj = Vyrobce(
            kod=record["kod"],
            kategorie=record["kategorie"],
            kategorie_nazev=record["kategorie_nazev"],
            nazev=record["nazev"],
            aktualizoval=record["aktualizoval"],
            aktualizovano=record["aktualizovano"]
        )

        # Change category name
        vyrobce_obj.kategorie_nazev = change_category_label(record["kategorie_nazev"])

        # Append vyrobce object to list without unnecessary attributes
        if not all_params:
            del vyrobce_obj.aktualizoval
            del vyrobce_obj.aktualizovano
            del vyrobce_obj.kategorie
        vyrobce.append(vyrobce_obj)
        
    # Return list of vyrobce objects
    return vyrobce

# Update vyrobce data from API
def update_vyrobce(kod:int, data: dict):
    """
    Function to update vyrobce data
    """
    # Prepare SQL query for updating vyrobce
    sql_query = """
        UPDATE d_vyrobce
        SET kategorie = %s, nazev = %s, aktualizovano = NOW(), aktualizoval = %s
        WHERE kod = %s
    """
    # Prepare parameters for the query
    params = [
        data.get("kategorie"), data.get("nazev"), data.get("aktualizoval"), kod
    ]
    
    # Execute the update query
    status = execute_update(sql_query=sql_query, params=params)
    return status

def create_vyrobce(data: dict):
    """
    Create new vyrobce in DB
    """
    # Prepare SQL query for inserting new vyrobce
    sql_query = """
        INSERT INTO d_vyrobce (kategorie, nazev, aktualizovano, aktualizoval)
        VALUES (%s, %s, NOW(), %s)
    """
    # Prepare parameters for the query
    params = [
        data.get("kategorie"), data.get("nazev"), data.get("aktualizoval")
    ]

    # Execute the insert query
    new_id = insert_record(sql_query=sql_query, params=params, return_id=True)
    return new_id

def get_vozidlo_filtered(kategorie_kod: int, vyrobce_kod: int = None, objem: str = None, model: str = None, rok_vyroby: str = None):
    """
    Function to get vozidlo by optional filters
    """
    # Prepare SQL query
    query = "SELECT * FROM v_vozidla WHERE kategorie_kod = %s AND vyrobce_kod = %s"
    params = [kategorie_kod, vyrobce_kod]

    # Add optional filters to the query
    if objem:
        query += " AND objem = %s"
        params.append(objem)
    if model:
        query += " AND model = %s"
        params.append(model)
    if rok_vyroby:
        query += " AND rok_vyroby = %s"
        params.append(rok_vyroby)

    # Execute the query and fetch records
    records = get_filtered_records(sql_query=query, params=params)
    return_vozidlo = []

    # Check if records are found
    if records:
        for vozidlo in records:
            vozidlo_obj = FilteredVozidlo(
                vozidlo_kod=vozidlo["vozidlo_kod"],
                kategorie_kod=vozidlo["kategorie_kod"],
                vyrobce_kod=vozidlo["vyrobce_kod"],
                vyrobce=vozidlo["vyrobce"],
                objem=vozidlo["objem"],
                model=vozidlo["model"],
                rok_vyroby=vozidlo["rok_vyroby"]
            )
            return_vozidlo.append(vozidlo_obj)

    # Return list of vozidlo objects
    return return_vozidlo if return_vozidlo else None

def get_vozidlo_sortiment_all(vozidlo_id):
    """
    Load sortiment data for specific vozidlo id 
    """
    views = {
        "adaptery": ("v_vozidlo_adapter", VozidloAdapter),
        "desticky": ("v_vozidlo_desticka", VozidloDesticka),
        "brzdice": ("v_vozidlo_brzdic", VozidloBrzdic),
        "hadicky": ("v_vozidlo_hadicka", VozidloHadicka),
        "kotouce": ("v_vozidlo_kotouc", VozidloKotouc),
        "prislusenstvi": ("v_vozidlo_prislusenstvi", VozidloPrislusenstvi),
        "pumpy": ("v_vozidlo_pumpa", VozidloPumpa),
    }
    # Initialize result dictionary
    result = {}

    # Iterate through views and fetch records
    for key, (view_name, model_class) in views.items():
        sql_query = f"SELECT * FROM {view_name} WHERE vozidlo = %s"
        raw_records = get_filtered_records(sql_query, [vozidlo_id])
        
        # If records are found, create model instances and add to result
        if raw_records:
            items = [model_class(**record).to_dict() for record in raw_records]
            result[key] = {
                "count": len(items),
                "items": items
            }

    # If any records are found, return the result
    return result if result else None

def get_vozidlo_by_category(kategorie_kod: int):
    """
    Function would return all vehicles (vozidla) for a given category (kategorie_kod).
    Categories are given from c_kategorie table 
    """
    # Prepare SQL query
    sql_query = """select * from v_vozidla_detail v 
                    where kategorie = %s"""
    params = [kategorie_kod]
    
    # Fetch records from the database
    records = get_filtered_records(sql_query=sql_query, params=params)
    vozidla = []

    # Check if records are found
    if records:
        
        # Loop through each record and create Vozidlo objects
        for vozidlo in records:
            vozidlo_obj = Vozidlo(
                kod=vozidlo["kod"],
                kategorie=vozidlo["kategorie"],
                nazev_modelu=vozidlo["nazev_modelu"],
                subkategorie=vozidlo["subkategorie"],
                vyrobce=vozidlo["vyrobce"],
                model=vozidlo["model"],
                typ=vozidlo["typ"],
                oznaceni=vozidlo["oznaceni"],
                rok_od=vozidlo["rok_od"],
                rok_do=vozidlo["rok_do"],
                vykon=vozidlo["vykon"],
                objem=vozidlo["objem"],
                poznamka=vozidlo["poznamka"],
                publikovat=bool(vozidlo["publikovat"]),
                aktualizovano=vozidlo["aktualizovano"],
                aktualizoval=vozidlo["aktualizoval"]
            )
            
            # Change vozidlo category
            vozidlo_obj.kategorie = change_category_label(vozidlo_obj.kategorie)
                
            # Append vozidlo object to the list
            vozidla.append(vozidlo_obj)

    # Return list of vozidlo objects
    return vozidla if vozidla else None

def update_vozidlo(vozidlo_id: int, data: dict):
    """
    Function to would update vozidlo data
    """
    # Prepare SQL query for updating vozidlo
    sql_query = """
        UPDATE d_vozidlo
        SET subkategorie = %s, vyrobce = %s,  
            typ = %s, oznaceni = %s, rok_od = %s, rok_do = %s, vykon = %s, 
            objem = %s, poznamka = %s, publikovat = %s 
        WHERE kod = %s
    """
    # Prepare parameters for the query
    params = [
        data.get("subkategorie"), data.get("vyrobce"), data.get("typ"), 
        data.get("oznaceni"), data.get("rok_od"), data.get("rok_do"),
        data.get("vykon"), data.get("objem"), data.get("poznamka"), data.get("publikovat", False), vozidlo_id
    ]
    
    # Execute the update query
    status = execute_update(sql_query=sql_query, params=params)
    return status

def create_vozidlo(data: dict):
    """
    Function would create a new vozidlo record in the database.
    """
    # Prepare SQL query for inserting new vozidlo
    sql_query = """
        INSERT INTO d_vozidlo (subkategorie, vyrobce, typ, oznaceni, rok_od, rok_do, vykon, objem, poznamka, publikovat, aktualizoval)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    
    # Prepare parameters for the query
    new_id = insert_record(sql_query=sql_query,
        params=(data["subkategorie"], data["vyrobce"], data["typ"],
        data["oznaceni"], data["rok_od"], data["rok_do"],
        data["vykon"], data["objem"], data["poznamka"],
        data["publikovat"], data["aktualizoval"]),
        return_id=True
    )
    
    return new_id