# Adapter model definiton
import base64

# Class definition
class Adapter():
    def __init__(self, Sortiment: str, Kategorie: str, Obrazek: str, Cislo_Dilu: str, Typ: str, Prumer: int, Popis: str, Poznamka: str, Publikovat: bool, Aktualizovano: str, Aktualizoval: str):
        self.Sortiment = Sortiment
        self.Kategorie = Kategorie
        self.Obrazek = Obrazek
        self.Cislo_Dilu = Cislo_Dilu
        self.Typ = Typ
        self.Prumer = Prumer
        self.Popis = Popis
        self.Poznamka = Poznamka
        self.Publikovat = Publikovat
        self.Aktualizovano = Aktualizovano
        self.Aktualizoval = Aktualizoval
    
    def to_dict(self):  
        return {
            'Sortiment': self.Sortiment,
            'Kategorie': self.Kategorie,
            'Obrazek': self.Obrazek,
            'Cislo_Dilu': self.Cislo_Dilu,
            'Typ': self.Typ,
            'Prumer': self.Prumer,
            'Popis': self.Popis,
            'Poznamka': self.Poznamka,
            'Publikovat': self.Publikovat,
            'Aktualizovano': self.Aktualizovano,
            'Aktualizoval': self.Aktualizoval
        }