# Adapter model definiton
from datetime import datetime

# Class definition
class Adapter():
    def __init__(self, kod: int, sortiment: str, kategorie: str, obrazek: str, vektor: str, cislo_dilu: str, typ: str, prumer: float, popis: str, typ_uchyceni: str, roztec_brzdice: float, poznamka: str, publikovat: bool, aktualizovano: datetime, aktualizoval: str):
        self.kod = kod
        self.sortiment = sortiment
        self.kategorie = kategorie
        self.obrazek = obrazek
        self.vektor = vektor
        self.cislo_dilu = cislo_dilu
        self.typ = typ
        self.prumer = prumer
        self.popis = popis
        self.typ_uchyceni = typ_uchyceni
        self.roztec_brzdice = roztec_brzdice
        self.poznamka = poznamka
        self.publikovat = publikovat
        self.aktualizovano = aktualizovano
        self.aktualizoval = aktualizoval
    
    def to_dict(self, filter=None):
        # Initialize filtered_dict
        filtered_data = {}
        
        # If attributes is None, return all attributes
        if filter is None:
            return self.__dict__
            
        # If attribute is in the list, return only those attributes
        for attribute in filter:
            if hasattr(self, attribute):
                filtered_data[attribute] = getattr(self, attribute)
        return filtered_data
    
class VozidloAdapter():
    def __init__(self, cislo_dilu, kategorie, subkategorie, vyrobce, vozidlo, oznaceni_vozidla, typ, objem, prumer, typ_uchyceni, roztec_brzdic, specialni_oznaceni, rok_od, rok_do, pozice, publikovat):
        self.cislo_dilu = cislo_dilu
        self.kategorie = kategorie
        self.subkategorie = subkategorie
        self.vyrobce = vyrobce
        self.vozidlo = vozidlo
        self.oznaceni_vozidla = oznaceni_vozidla
        self.typ = typ
        self.objem = objem
        self.prumer = prumer
        self.typ_uchyceni = typ_uchyceni
        self.roztec_brzdic = roztec_brzdic
        self.specialni_oznaceni = specialni_oznaceni
        self.rok_od = rok_od
        self.rok_do = rok_do
        self.pozice = pozice
        self.publikovat = publikovat
    
    def to_dict(self):
        return self.__dict__