class Hadicka():
    def __init__(self, kod, sortiment, kategorie, obrazek, vektor, cislo_dilu, popis, poznamka, publikovat, aktualizovano, aktualizoval):
       self.kod = kod
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
    
class VozidloHadicka():
    def __init__(self, cislo_dilu, kategorie, subkategorie, vyrobce, vozidlo, oznaceni_vozidla, typ, objem, obrazek, vektor, specialni_oznaceni, rok_od, rok_do, pozice, publikovat):
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
        self.specialni_oznaceni = specialni_oznaceni
        self.rok_od = rok_od
        self.rok_do = rok_do
        self.pozice = pozice
        self.publikovat = publikovat
    
    def to_dict(self):
        return self.__dict__