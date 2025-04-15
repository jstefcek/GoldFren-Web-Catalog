# Class Definition
class Vozidlo():
    def __init__(self, kod, subkategorie, vyrobce, typ, objem, oznaceni, rok_od, mesic_od, rok_do, mesic_do, vykon, poznamka, index, publikovat, aktualizovano, aktualizoval):
        self.kod = kod
        self.subkategorie = subkategorie
        self.vyrobce = vyrobce
        self.typ = typ
        self.objem = objem
        self.oznaceni = oznaceni
        self.rok_od = rok_od
        self.mesic_od = mesic_od
        self.rok_do = rok_do
        self.mesic_do = mesic_do
        self.vykon = vykon
        self.poznamka = poznamka
        self.index = index
        self.publikovat = publikovat
        self.aktualizovano = aktualizovano
        self.aktualizoval = aktualizoval
    
    def to_dict(self):
        return self.__dict__
    
class FilteredVozidlo():
    def __init__(self, vozidlo_kod, kategorie_kod, vyrobce_kod, vyrobce, objem, model, rok_vyroby):
        self.vozidlo_kod = vozidlo_kod
        self.kategorie_kod = kategorie_kod
        self.vyrobce_kod = vyrobce_kod
        self.vyrobce = vyrobce
        self.objem = objem
        self.model = model
        self.rok_vyroby = rok_vyroby
    
    def to_dict(self):
        return self.__dict__