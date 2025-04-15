# Class Definition for sortment
class Sortiment():
    def __init__(self, kod, nazev, image_category, publikovat):
        self.kod = kod
        self.nazev = nazev
        self.image_category = image_category
        self.publikovat = publikovat
    
    def to_dict(self):
        return self.__dict__

# Class Definition for kategorie
class Kategorie():
    def __init__(self, kod, ikona, nazev, nazev_eng):
        self.kod = kod
        self.ikona = ikona
        self.nazev = nazev
        self.nazev_eng = nazev_eng
    
    def to_dict(self):
        return self.__dict__

# Class Definition for subkategorie
class Subkategorie():
    def __init__(self, kod, kategorie, nazev, nazev_eng):
        self.kod = kod
        self.kategorie = kategorie
        self.nazev = nazev
        self.nazev_eng = nazev_eng
    
    def to_dict(self):
        return self.__dict__
    
# Class Definition for pozice of sortiment
class Pozice():
    def __init__(self, kod, sortiment, nazev, nazev_eng):
        self.kod = kod
        self.sortiment = sortiment
        self.nazev = nazev
        self.nazev_eng = nazev_eng
    
    def to_dict(self):
        return self.__dict__
    
# Class Definition of attribute if it will be visible in web
class AttributeWebView():
    def __init__(self, kod, sortiment, attribute, publikovat, vytvoreno, vytvoril, aktualizovano, aktualizoval):
        self.kod = kod
        self.sortiment = sortiment
        self.attribute = attribute
        self.publikovat = publikovat
        self.vytvoreno = vytvoreno
        self.vytvoril = vytvoril
        self.aktualizovano = aktualizovano
        self.aktualizoval = aktualizoval
    
    def to_dict(self):
        return self.__dict__