# Class Definition
class Vyrobce():
    def __init__(self, kod = None, kategorie = None, kategorie_nazev = None, nazev = None, aktualizovano = None, aktualizoval = None, publikovat = None):
        self.kod = kod
        self.kategorie = kategorie
        self.kategorie_nazev = kategorie_nazev
        self.nazev = nazev
        self.aktualizovano = aktualizovano
        self.aktualizoval = aktualizoval
        self.publikovat = publikovat
    
    def to_dict(self):
        return self.__dict__