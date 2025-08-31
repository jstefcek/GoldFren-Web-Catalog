from GoldFrenAPI.Models.Adaptery import VozidloAdapter
from GoldFrenAPI.Models.Desticky import VozidloDesticka
from GoldFrenAPI.Models.Brzdice import VozidloBrzdic
from GoldFrenAPI.Models.Hadicky import VozidloHadicka
from GoldFrenAPI.Models.Kotouce import VozidloKotouc
from GoldFrenAPI.Models.Pumpy import VozidloPumpa
from GoldFrenAPI.Models.Prislusenstvi import VozidloPrislusenstvi
from GoldFrenAPI.Services.Service_utils import (
    get_filtered_records,
)

def get_sortiment_for_vyrobce(vyrobce_kod: str):
    """
    Function to get sortiment items for a specific vyrobce name
    """
    # Defines DB tables and their models
    config = {
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
    for key, (view_name, model_class) in config.items():
        # Prepare SQL query
        sql_query = f"""SELECT * FROM {view_name} WHERE vyrobce = 
        (SELECT nazev FROM d_vyrobce WHERE kod = %s) 
        ORDER BY oznaceni_vozidla ASC"""
        
        # Get records
        raw_records = get_filtered_records(sql_query, [vyrobce_kod])
        
        # If records are found, create model instances and add to result
        if raw_records:
            items = [model_class(**record).to_dict() for record in raw_records]
            result[key] = {
                "count": len(items),
                "items": items
            }

    # If any records are found, return the result
    return result if result else None