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
    
class VozidloPumpa():
    def __init__(self, kod, cislo_dilu, kategorie, subkategorie, vyrobce, vozidlo, oznaceni_vozidla, typ, objem, prumer, obrazek, vektor, specialni_oznaceni, rok_od, rok_do, pozice, publikovat):
        self.kod = kod
        self.cislo_dilu = cislo_dilu
        self.kategorie = kategorie
        self.subkategorie = subkategorie
        self.vyrobce = vyrobce
        self.vozidlo = vozidlo
        self.oznaceni_vozidla = oznaceni_vozidla
        self.typ = typ
        self.objem = objem
        self.prumer = prumer
        self.obrazek = obrazek
        self.vektor = vektor
        self.specialni_oznaceni = specialni_oznaceni
        self.rok_od = rok_od
        self.rok_do = rok_do
        self.pozice = pozice
        self.publikovat = publikovat
    
    def to_dict(self):
        return self.__dict__