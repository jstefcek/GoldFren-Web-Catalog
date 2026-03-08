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
    
class VozidloHadicka():
    def __init__(self, kod, cislo_dilu, kategorie, subkategorie, vyrobce, vozidlo, oznaceni_vozidla, typ, objem, obrazek, vektor, poznamka, specialni_oznaceni, rok_od, rok_do, pozice, publikovat):
        self.kod = kod
        self.cislo_dilu = cislo_dilu
        self.kategorie = kategorie
        self.subkategorie = subkategorie
        self.vyrobce = vyrobce
        self.vozidlo = vozidlo
        self.oznaceni_vozidla = oznaceni_vozidla
        self.typ = typ
        self.objem = objem
        self.obrazek = obrazek
        self.vektor = vektor
        self.poznamka = poznamka
        self.specialni_oznaceni = specialni_oznaceni
        self.rok_od = rok_od
        self.rok_do = rok_do
        self.pozice = pozice
        self.publikovat = publikovat
    
    def to_dict(self):
        return self.__dict__