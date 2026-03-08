# Business logic for the Hadicky Service

# Imports
from collections import defaultdict
from datetime import datetime
from GoldFrenAPI.Models.Hadicky import Hadicka, VozidloHadicka, Hadicka_Trubicka_Detail, Hadicka_Prislusenstvi_Detail
from GoldFrenAPI.Services.Service_utils import (
    set_publication_state, 
    get_item_by_id,
    execute_update,
    insert_record,
    get_records
)
from GoldFrenAPI.utils.utils import (
    prepare_sql_filters, change_category_label
)

# Function to get all hadicky from database
def get_hadicky(limit: int = None, page: int = None, states: bool = False):
    # Prepare list for hadicky objects
    hadicky = []
    
    # Get all data items from the database
    data_query = """SELECT
            kod,
            sortiment,
            kategorie,
            obrazek,
            vektor,
            cislo_dilu,
            typ,
            is_superbike,
            is_homologation,
            homologacni_cislo,
            is_brake_active,
            system_brzdy,
            fitting,
            tuv_certifikat,
            kod_sady,
            zavit_hlavni_valec,
            zavit_trmen_roztec,
            zavit_roztec,
            montazni_navod,
            pocet_hadicek,
            poznamka,
            publikovat,
            aktualizovano,
            aktualizoval
        FROM v_hadicky_detail"""
    data_query += " WHERE Publikovat in (0,1)" if states else " WHERE Publikovat = 1"
    data_query += " ORDER BY cislo_dilu ASC"
    records = get_records(sql_query=data_query, limit=limit, page=page)
    if not records:
        return []
    
    # Prepare hadicka_kod list
    hadicka_kody = [record["kod"] for record in records]
    hadicka_kody_placeholder = ", ".join(["%s"] * len(hadicka_kody))
    
    # Get hadicky - detail trubicek
    trubicka_query = f"""SELECT DISTINCT 
            hadicka, 
            delka, 
            fitting_kontektoru_a, 
            fitting_kontektoru_b, 
            zapojeni_a, 
            zapojeni_b
        FROM d_hadicka_trubicka 
        WHERE hadicka IN ({hadicka_kody_placeholder})
        """
    trubicka_records = get_records(sql_query=trubicka_query, params=hadicka_kody)
    
    # Get hadicky - detail prislusenstvi
    prislusenstvi_query = f"""SELECT DISTINCT 
            hadicka, 
            nazev, 
            pocet
        FROM d_hadicka_prislusenstvi 
        WHERE hadicka IN ({hadicka_kody_placeholder})
        """
    prislusenstvi_records = get_records(sql_query=prislusenstvi_query, params=hadicka_kody)
    
    # Group trubicka by hadicka
    trubicka_map = defaultdict(list)
    for trubicka in trubicka_records:
        trubicka_map[trubicka["hadicka"]].append(
            Hadicka_Trubicka_Detail(
                delka=float(trubicka.get("delka") or 0),
                fitting_kontektoru_a=trubicka["fitting_kontektoru_a"],
                fitting_kontektoru_b=trubicka["fitting_kontektoru_b"],
                zapojeni_a=trubicka["zapojeni_a"],
                zapojeni_b=trubicka["zapojeni_b"]
            )
        )

    # Group prislusenstvi by hadicka
    prislusenstvi_map = defaultdict(list)
    for prislusenstvi in prislusenstvi_records:
        prislusenstvi_map[prislusenstvi["hadicka"]].append(
            Hadicka_Prislusenstvi_Detail(
                nazev=prislusenstvi["nazev"],
                pocet=int(prislusenstvi.get("pocet") or 0)
            )
        )
    
    # Iterate through records
    for record in records:
        kod = record["kod"]
        
        # Create brzdic object
        hadicka = Hadicka(
            kod=kod,
            sortiment=record["sortiment"],
            kategorie=record["kategorie"],
            obrazek=record["obrazek"],
            vektor=record["vektor"],
            cislo_dilu=record["cislo_dilu"],
            typ=record["typ"],
            is_superbike=bool(record["is_superbike"]),
            is_homologation=bool(record["is_homologation"]),
            homologacni_cislo=record["homologacni_cislo"],
            is_brake_active=bool(record["is_brake_active"]),
            system_brzdy=record["system_brzdy"],
            fitting=record["fitting"],
            tuv_certifikat=bool(record["tuv_certifikat"]),
            kod_sady=record["kod_sady"],
            zavit_hlavni_valec=record["zavit_hlavni_valec"],
            zavit_trmen_roztec=record["zavit_trmen_roztec"],
            zavit_roztec=record["zavit_roztec"],
            montazni_navod=record["montazni_navod"],
            pocet_hadicek=record["pocet_hadicek"],
            detail_trubicek=trubicka_map.get(kod, []),
            detail_prislusenstvi=prislusenstvi_map.get(kod, []),
            poznamka=record["poznamka"],
            publikovat=bool(record["publikovat"]),
            aktualizovano=record["aktualizovano"] if isinstance(record["aktualizovano"], datetime) else None,
            aktualizoval=record["aktualizoval"]
        )

        # Change hadicka category and append trubicka details to hadicka object
        hadicka.kategorie = change_category_label(hadicka.kategorie)
        hadicky.append(hadicka)
        
    # Return list of hadicky objects
    return hadicky

# Function to get a single hadicka by ID
def get_hadicka(hadicka_id: int):
    # Get item by ID from the database
    record = get_item_by_id(sql_view="v_hadicky_detail", item_id=hadicka_id)
        
    # Check if record exists
    if record:
        hadicka = Hadicka(
            kod=record["kod"],
            sortiment=record["sortiment"],
            kategorie=record["kategorie"],
            obrazek=record["obrazek"],
            vektor=record["vektor"],
            cislo_dilu=record["cislo_dilu"],
            typ=record["typ"],
            is_superbike=bool(record["is_superbike"]),
            is_homologation=bool(record["is_homologation"]),
            homologacni_cislo=record["homologacni_cislo"],
            is_brake_active=bool(record["is_brake_active"]),
            system_brzdy=record["system_brzdy"],
            fitting=record["fitting"],
            tuv_certifikat=bool(record["tuv_certifikat"]),
            kod_sady=record["kod_sady"],
            zavit_hlavni_valec=record["zavit_hlavni_valec"],
            zavit_trmen_roztec=record["zavit_trmen_roztec"],
            zavit_roztec=record["zavit_roztec"],
            montazni_navod=record["montazni_navod"],
            pocet_hadicek=record["pocet_hadicek"],
            detail_trubicek=[],
            detail_prislusenstvi=[],  
            poznamka=record["poznamka"],
            publikovat=bool(record["publikovat"]),
            aktualizovano=record["aktualizovano"] if isinstance(record["aktualizovano"], datetime) else None,
            aktualizoval=record["aktualizoval"]
        )
        
        # Check for hadicka - detail trubicek
        query = """SELECT DISTINCT delka, fitting_kontektoru_a, fitting_kontektoru_b, zapojeni_a, zapojeni_b
        FROM d_hadicka_trubicka
        WHERE hadicka = %s"""
        records = get_records(sql_query=query, params=(hadicka_id,))
        
        for record in records:
            trubicka_detail = Hadicka_Trubicka_Detail(
                delka=float(record["delka"]),
                fitting_kontektoru_a=record["fitting_kontektoru_a"],
                fitting_kontektoru_b=record["fitting_kontektoru_b"],
                zapojeni_a=record["zapojeni_a"],
                zapojeni_b=record["zapojeni_b"]
            )
            hadicka.detail_trubicek.append(trubicka_detail)
        
        # Check for hadicka - detail prislusenstvi
        query = """SELECT DISTINCT nazev, pocet
        FROM d_hadicka_prislusenstvi
        WHERE hadicka = %s"""
        records = get_records(sql_query=query, params=(hadicka_id,))
        
        for record in records:
            prislusenstvi_detail = Hadicka_Prislusenstvi_Detail(
                nazev=record["nazev"],
                pocet=int(record["pocet"])
            )
            hadicka.detail_prislusenstvi.append(prislusenstvi_detail)   
        
        # Return hadicka object
        return hadicka
        
# Function to update an existing hadicka
def update_hadicka(hadicka_id: int, data: dict):
    # Prepare SQL query
    query = """
        UPDATE d_hadicka 
        SET kategorie = %s, obrazek = %s, vektor = %s, cislo_dilu = %s, 
            typ = %s, is_superbike = %s, is_homologation = %s, homologacni_cislo = %s, is_brake_active = %s, 
            system_brzdy = %s, fitting = %s, tuv_certifikat = %s, kod_sady = %s, zavit_hlavni_valec = %s, 
            zavit_trmen_roztec = %s, zavit_roztec = %s, montazni_navod = %s, pocet_hadicek = %s, 
            poznamka = %s, publikovat = %s, aktualizovano = NOW(), aktualizoval = %s 
        WHERE kod = %s
    """
    # Update hadicka data
    status = execute_update(sql_query=query, params=(
        data["kategorie"], data["obrazek"], data["vektor"], data["cislo_dilu"],
        data["typ"], data["is_superbike"], data["is_homologation"], data["homologacni_cislo"], data["is_brake_active"], 
        data["system_brzdy"], data["fitting"], data["tuv_certifikat"], data["kod_sady"], data["zavit_hlavni_valec"], 
        data["zavit_trmen_roztec"], data["zavit_roztec"], data["montazni_navod"], data["pocet_hadicek"],
        data["poznamka"], data["publikovat"], data["aktualizoval"], hadicka_id
    ))
    if not status:
        return False
    
    # Update hadicka - detail trubicek
    if data.get("detail_trubicek") is not None:
        # First delete all existing trubicka details for the hadicka
        delete_query = "DELETE FROM d_hadicka_trubicka WHERE hadicka = %s"
        status = execute_update(sql_query=delete_query, params=(hadicka_id,))
        if not status:
            return False
        
        # Then insert new trubicka details from the request data
        insert_query = """INSERT INTO d_hadicka_trubicka 
        (hadicka, delka, fitting_kontektoru_a, fitting_kontektoru_b, zapojeni_a, zapojeni_b)
        VALUES (%s, %s, %s, %s, %s, %s)"""
        for trubicka in data["detail_trubicek"]:
            status = execute_update(sql_query=insert_query, params=(
                hadicka_id, trubicka["delka"], trubicka["fitting_kontektoru_a"], trubicka["fitting_kontektoru_b"],
                trubicka["zapojeni_a"], trubicka["zapojeni_b"]
            ))
            if not status:
                return False
    
    # Update hadicka - detail prislusenstvi
    if data.get("detail_prislusenstvi") is not None:
        # First delete all existing prislusenstvi details for the hadicka
        delete_query = "DELETE FROM d_hadicka_prislusenstvi WHERE hadicka = %s"
        status = execute_update(sql_query=delete_query, params=(hadicka_id,))
        if not status:
            return False
        
        # Then insert new prislusenstvi details from the request data
        insert_query = """INSERT INTO d_hadicka_prislusenstvi 
        (hadicka, nazev, pocet)
        VALUES (%s, %s, %s)"""
        for prislusenstvi in data["detail_prislusenstvi"]:
            status = execute_update(sql_query=insert_query, params=(
                hadicka_id, prislusenstvi["nazev"], prislusenstvi["pocet"]
            ))
            if not status:
                return False

    # Return status
    return status

# Function to create a new hadicka
def create_hadicka(data: dict):
    # Prepare SQL query for inserting new hadicka to database
    query = """
        INSERT INTO d_hadicka (sortiment, kategorie, obrazek, vektor, cislo_dilu, 
        typ, is_superbike, is_homologation, homologacni_cislo, is_brake_active, 
        system_brzdy, fitting, tuv_certifikat, kod_sady, zavit_hlavni_valec, 
        zavit_trmen_roztec, zavit_roztec, montazni_navod, pocet_hadicek, 
        poznamka, publikovat, aktualizovano, aktualizoval) 
        VALUES(4, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), %s)
    """
    new_id = insert_record(sql_query=query, 
        params=(data["kategorie"], data["obrazek"], data["vektor"],
        data["cislo_dilu"], data["typ"], data["is_superbike"], data["is_homologation"], data["homologacni_cislo"], data["is_brake_active"],
        data["system_brzdy"], data["fitting"], data["tuv_certifikat"], data["kod_sady"], data["zavit_hlavni_valec"],
        data["zavit_trmen_roztec"], data["zavit_roztec"], data["montazni_navod"], data["pocet_hadicek"],
        data["poznamka"], data["publikovat"], data["aktualizoval"]),
        return_id=True
    )
    
    # Insert hadicka - detail trubicek
    if data.get("detail_trubicek") is not None:
        # Then insert new trubicka details from the request data
        insert_query = """INSERT INTO d_hadicka_trubicka 
        (hadicka, delka, fitting_kontektoru_a, fitting_kontektoru_b, zapojeni_a, zapojeni_b)
        VALUES (%s, %s, %s, %s, %s, %s)"""
        for trubicka in data["detail_trubicek"]:
            status = execute_update(sql_query=insert_query, params=(
                new_id, trubicka["delka"], trubicka["fitting_kontektoru_a"], trubicka["fitting_kontektoru_b"],
                trubicka["zapojeni_a"], trubicka["zapojeni_b"]
            ))
    
    # Insert hadicka - detail prislusenstvi
    if data.get("detail_prislusenstvi") is not None:
        # Then insert new prislusenstvi details from the request data
        insert_query = """INSERT INTO d_hadicka_prislusenstvi 
        (hadicka, nazev, pocet)
        VALUES (%s, %s, %s)"""
        for prislusenstvi in data["detail_prislusenstvi"]:
            status = execute_update(sql_query=insert_query, params=(
                new_id, prislusenstvi["nazev"], prislusenstvi["pocet"]
            ))
    
    return new_id

# Change state of publikovat
def hadicka_publication(hadicka_id, publikovat):
    state = set_publication_state(sql_table="d_hadicka", publikovat=publikovat, item_id=hadicka_id)
    return state

# Find specific hadicky by given parameters
def get_filtered_hadicky(limit: int = None, page: int = None, states: bool = False, filters: dict = None):
    # Prepare SQL query and add kod
    query = """
    SELECT DISTINCT kod, cislo_dilu, obrazek, vektor, poznamka, pozice
    FROM v_vozidlo_hadicky
    """
    params = []
    filter_condition = []

    # Apply publication filter 
    filter_condition.append("publikovat in (0,1)" if states else "Publikovat = 1")
    filter_condition, params = prepare_sql_filters(filters=filters, filter_condition=filter_condition, params=params)

    # Append filters to base query
    if filter_condition:
        query += " WHERE " + " AND ".join(filter_condition)
    
    # Execute query and get records
    records = get_records(sql_query=query, params=params, limit=limit, page=page)
    if not records:
        return None
    
    # Prepare data and return if someting found
    hadicky = []
    for record in records:
        hadicka = {
            "kod": record["kod"],
            "cislo_dilu": record["cislo_dilu"],
            "obrazek": record["obrazek"],
            "vektor": record["vektor"],
            "poznamka": record["poznamka"],
            "pozice": record["pozice"],
        }
        hadicky.append(hadicka)
    
    # Return list of matching hadicky dictionaries
    return hadicky if hadicky else None

# Get vozidla for specific hadicka
def get_vozidla_for_hadicka(limit: int = None, page: int = None, states: bool = False, hadicka_id: int = None):
    # Prepare SQL query and add kod
    query = """
    SELECT *
    FROM v_vozidlo_hadicka
    WHERE kod = %s
    """
    params = [hadicka_id]
    query += " AND publikovat in (0,1)" if states else " AND Publikovat = 1"
    query += " ORDER BY vyrobce ASC, oznaceni_vozidla ASC"
    
    # Execute query and get records
    records = get_records(sql_query=query, params=params, limit=limit, page=page)
    if not records:
        return None

    hadicky = []
    for record in records:
        hadicka = VozidloHadicka(
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
            poznamka=record["poznamka"],
            specialni_oznaceni=record["specialni_oznaceni"],
            rok_od=record["rok_od"],
            rok_do=record["rok_do"],
            pozice=record["pozice"],
            publikovat=bool(record["publikovat"]) if record["publikovat"] is not None else None
        )

        # Append hadicka object to list
        hadicky.append(hadicka)
        
    # Return list of matching hadicka objects
    return hadicky if hadicky else None