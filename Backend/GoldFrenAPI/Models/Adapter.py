# Adapter model definiton
from datetime import datetime

# Class definition
class Adapter():
    def __init__(self, kod: int, sortiment: str, kategorie: str, obrazek: str, vektor: str, cislo_dilu: str, typ: str, prumer: float, popis: str, poznamka: str, publikovat: bool, aktualizovano: datetime, aktualizoval: str):
        self.kod = kod
        self.sortiment = sortiment
        self.kategorie = kategorie
        self.obrazek = obrazek
        self.vektor = vektor
        self.cislo_dilu = cislo_dilu
        self.typ = typ
        self.prumer = prumer
        self.popis = popis
        self.poznamka = poznamka
        self.publikovat = publikovat
        self.aktualizovano = aktualizovano
        self.aktualizoval = aktualizoval
    
    def to_dict(self):  
        return self.__dict__