# Business logic for the Vyrobce Service

# Imports
from datetime import datetime
from GoldFrenAPI.Models.Vyrobce import Vyrobce
from GoldFrenAPI.Models.Vozidlo import FilteredVozidlo
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

def get_vyrobce_by_kategorie(kategorie_id: int):
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
            aktualizovano=record["aktualizovano"] if isinstance(record["aktualizovano"], datetime) else None,
            aktualizoval=record["aktualizoval"]
        )
        
        # Append vyrobce object to list
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
    Loads data from multiple vozidlo views and returns only the ones with results.
    """
    views = {
        "adapter": ("v_vozidlo_adapter", VozidloAdapter),
        "desticka": ("v_vozidlo_desticka", VozidloDesticka),
        "brzdic": ("v_vozidlo_brzdic", VozidloBrzdic),
        "hadicka": ("v_vozidlo_hadicka", VozidloHadicka),
        "kotouc": ("v_vozidlo_kotouc", VozidloKotouc),
        "prislusenstvi": ("v_vozidlo_prislusenstvi", VozidloPrislusenstvi),
        "pumpa": ("v_vozidlo_pumpa", VozidloPumpa),
    }

    result = {}

    for key, (view_name, model_class) in views.items():
        sql_query = f"SELECT * FROM {view_name} WHERE vozidlo = %s"
        raw_records = get_filtered_records(sql_query, [vozidlo_id])
        
        if raw_records:
            result[key] = [model_class(**record).to_dict() for record in raw_records]

    return result if result else None