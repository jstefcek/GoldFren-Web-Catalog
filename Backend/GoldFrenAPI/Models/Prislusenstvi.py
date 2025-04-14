# Class definition
class Prislusenstvi():
    def __init__(self, kod, sortiment, kategorie, obrazek, vektor, cislo_dilu, typ, popis, poznamka, publikovat, aktualizovano, aktualizoval):
        self.kod = kod
        self.sortiment = sortiment
        self.kategorie = kategorie
        self.obrazek = obrazek
        self.vektor = vektor
        self.cislo_dilu = cislo_dilu
        self.typ = typ
        self.popis = popis
        self.poznamka = poznamka
        self.publikovat = publikovat
        self.aktualizovano = aktualizovano
        self.aktualizoval = aktualizoval
        
    def to_dict(self):
        return self.__dict__