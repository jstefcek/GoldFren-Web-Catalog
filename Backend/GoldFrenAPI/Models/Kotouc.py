# Kotouc model definiton
from datetime import datetime

# Class definition
class Kotouc():
    def __init__(self, kod: int, sortiment: str, kategorie: str, obrazek: str, vektor: str, cislo_dilu: str, typ: str, konkurence_braking: str, konkurence_ngbrakes: str,
                 od: int, hd: int, id: int, thk: int, poznamka: str, publikovat: bool, aktualizovano: datetime, aktualizoval: str):
        self.kod = kod
        self.sortiment = sortiment
        self.kategorie = kategorie
        self.obrazek = obrazek
        self.vektor = vektor
        self.cislo_dilu = cislo_dilu
        self.typ = typ
        self.konkurence_braking = konkurence_braking
        self.konkurence_ngbrakes = konkurence_ngbrakes
        self.od = od
        self.hd = hd
        self.id = id
        self.thk = thk
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