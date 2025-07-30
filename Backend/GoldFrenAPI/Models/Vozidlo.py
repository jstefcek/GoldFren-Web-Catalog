# Class Definition
class Vozidlo():
    def __init__(self, kod, kategorie, subkategorie, vyrobce, model, typ, oznaceni, rok_od, rok_do, vykon, objem, poznamka, publikovat, aktualizovano, aktualizoval):
        self.kod = kod
        self.kategorie = kategorie
        self.subkategorie = subkategorie
        self.vyrobce = vyrobce
        self.model = model
        self.typ = typ
        self.oznaceni = oznaceni
        self.rok_od = rok_od
        self.rok_do = rok_do
        self.vykon = vykon
        self.objem = objem
        self.poznamka = poznamka
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