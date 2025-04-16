# Class Definition
class Vyrobce():
    def __init__(self, kod = None, kategorie = None, nazev = None, aktualizovano = None, aktualizoval = None):
        self.kod = kod
        self.kategorie = kategorie
        self.nazev = nazev
        self.aktualizovano = aktualizovano
        self.aktualizoval = aktualizoval
    
    def to_dict(self):
        return self.__dict__