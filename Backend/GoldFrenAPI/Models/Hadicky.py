class Hadicka():
    def __init__(self, kod, sortiment, kategorie, obrazek, vektor, oznaceni, popis, poznamka, publikovat, aktualizovano, aktualizoval):
       self.kod = kod
       self.sortiment = sortiment
       self.kategorie = kategorie
       self.obrazek = obrazek
       self.vektor = vektor
       self.oznaceni = oznaceni
       self.popis = popis
       self.poznamka = poznamka
       self.publikovat = publikovat
       self.aktualizovano = aktualizovano
       self.aktualizoval = aktualizoval
       
    def to_dict(self):
        return self.__dict__