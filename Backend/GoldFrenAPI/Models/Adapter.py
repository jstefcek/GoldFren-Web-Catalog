# Adapter model definiton
from datetime import datetime

# Class definition
class Adapter():
    def __init__(self, sortiment: str, kategorie: str, obrazek: str, vektor: str, cislo_dilu: str, typ: str, prumer: float, popis: str, poznamka: str, publikovat: bool, aktualizovano: datetime, aktualizoval: str):
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
        return {
            'sortiment': self.sortiment,
            'kategorie': self.kategorie,
            'obrazek': self.obrazek,
            'vektor': self.vektor,
            'cislo_dilu': self.cislo_dilu,
            'typ': self.typ,
            'prumer': self.prumer,
            'popis': self.popis,
            'poznamka': self.poznamka,
            'publikovat': self.publikovat,
            'aktualizovano': self.aktualizovano,
            'aktualizoval': self.aktualizoval
        }