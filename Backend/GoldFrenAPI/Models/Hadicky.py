from dataclasses import dataclass
from datetime import datetime

@dataclass
class Hadicka_Trubicka_Detail:
    delka: float
    fitting_kontektoru_a: str
    fitting_kontektoru_b: str
    zapojeni_a: str
    zapojeni_b: str
    
    def to_dict(self):
        return self.__dict__
        
@dataclass
class Hadicka_Prislusenstvi_Detail:
    nazev: str
    pocet: int
    
    def to_dict(self):  
        return self.__dict__

@dataclass
class Hadicka:
    kod: str 
    sortiment: str
    kategorie: str
    obrazek: str
    vektor: str
    cislo_dilu: str
    typ: str
    is_superbike: bool
    is_homologation: bool
    homologacni_cislo: str
    is_brake_active: bool
    system_brzdy: str
    fitting: str
    tuv_certifikat: bool
    kod_sady: str
    zavit_hlavni_valec: float
    zavit_trmen_roztec: float
    zavit_roztec: float
    montazni_navod: str
    pocet_hadicek: int
    detail_trubicek: list[Hadicka_Trubicka_Detail]
    detail_prislusenstvi: list[Hadicka_Prislusenstvi_Detail]
    poznamka: str
    publikovat: bool
    aktualizovano: datetime
    aktualizoval: str
       
    def to_dict(self):
        result = {}
        for key, value in self.__dict__.items():
            if isinstance(value, list):
                result[key] = [
                    item.to_dict() if hasattr(item, 'to_dict') else item 
                    for item in value
                ]
            elif hasattr(value, 'to_dict'):
                result[key] = value.to_dict()
            else:
                result[key] = value
        return result
    
@dataclass
class VozidloHadicka():
    kod: str
    cislo_dilu: str
    kategorie: str
    subkategorie: str
    vyrobce: str
    vozidlo: str
    oznaceni_vozidla: str
    typ: str
    objem: int
    obrazek: str
    vektor: str
    hadicka_typ: str
    zavit_hlavni_valec: float
    zavit_trmen_roztec: float
    zavit_roztec: float
    pocet_hadicek: int
    specialni_oznaceni: str
    rok_od: int
    rok_do: int
    pozice: str
    publikovat: bool

    def to_dict(self):
        return self.__dict__