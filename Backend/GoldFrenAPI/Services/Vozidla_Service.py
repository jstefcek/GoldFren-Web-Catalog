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
    get_filtered_records
)

def get_vyrobce_by_kategorie(kategorie_id: int, all_params: bool = False):
    """
    Function to get all vyrobce by kategorie ID
    """
    # Get all vyrobce from the database based on kategorie ID
    query = """
        SELECT *
        FROM d_vyrobce
        WHERE kategorie = %s
        ORDER BY nazev ASC
    """
    records = get_filtered_records(sql_query=query, params=[kategorie_id])
    vyrobce = []
    
    # Iterate through records
    for record in records:
        # Create vyrobce object
        vyrobce_obj = Vyrobce(
            kod=record["kod"],
            kategorie=record["kategorie"],
            nazev=record["nazev"],
            aktualizoval=record["aktualizoval"],
            aktualizovano=record["aktualizovano"]
        )
        
        # Append vyrobce object to list withozt unnecessary attributes
        if not all_params:
            del vyrobce_obj.aktualizoval
            del vyrobce_obj.aktualizovano
            del vyrobce_obj.kategorie
        vyrobce.append(vyrobce_obj)
        
    # Return list of vyrobce objects
    return vyrobce

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
            if vozidlo_obj.kategorie == "Auto":
                vozidlo_obj.kategorie = "Automobily"
            elif vozidlo_obj.kategorie == "Motocykl":
                vozidlo_obj.kategorie = "Motocykly"
            elif vozidlo_obj.kategorie == "Motokára":
                vozidlo_obj.kategorie = "Motokáry"
            elif vozidlo_obj.kategorie == "Kolo":
                vozidlo_obj.kategorie = "Jízdní kola"
            elif vozidlo_obj.kategorie == "Letadlo":
                vozidlo_obj.kategorie = "Letadla"
            elif vozidlo_obj.kategorie == "Průmysl":
                vozidlo_obj.kategorie = "Průmysl"
                
            # Append vozidlo object to the list
            vozidla.append(vozidlo_obj)

    # Return list of vozidlo objects
    return vozidla if vozidla else None
