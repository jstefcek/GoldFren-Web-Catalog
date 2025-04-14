# Class definition
class Pumpa():
    def __init__(self, kod, sortiment, kategorie, obrazek, vektor, cislo_dilu, prumer, popis, publikovat, aktualizovano, aktualizoval, poznamka):
        self.kod = kod
        self.sortiment = sortiment
        self.kategorie = kategorie
        self.obrazek = obrazek
        self.vektor = vektor
        self.cislo_dilu = cislo_dilu
        self.prumer = prumer
        self.popis = popis
        self.publikovat = publikovat
        self.aktualizovano = aktualizovano
        self.aktualizoval = aktualizoval
        self.poznamka = poznamka
        
    def to_dict(self):
        return self.__dict__