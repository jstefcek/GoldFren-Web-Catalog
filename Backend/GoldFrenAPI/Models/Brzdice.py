# Brzdice model definiton
from datetime import datetime

# Class definition
class Brzdic():
    def __init__(self, sortiment: str, kategorie: str, obrazek: str, vektor: str, cislo_dilu: str, popis: str, poznamka: str, publikovat: bool, aktualizovano: datetime, aktualizoval: str):
        self.sortiment = sortiment
        self.kategorie = kategorie
        self.obrazek = obrazek
        self.vektor = vektor
        self.cislo_dilu = cislo_dilu
        self.popis = popis
        self.poznamka = poznamka
        self.publikovat = publikovat
        self.aktualizovano = aktualizovano
        self.aktualizoval = aktualizoval
    
    def to_dict(self):  
        return self.__dict__