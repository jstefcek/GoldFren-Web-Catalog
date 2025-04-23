# Desticka model definiton
from datetime import datetime

# Class definition
class MaterialInfo:
    def __init__(self, material: str = None, tloustka: float = None, matrice: str = None):
        self.material = material
        self.tloustka = tloustka
        self.matrice = matrice

    def to_dict(self):
        return self.__dict__
        
class KonkurenceDetail:
    def __init__(self, sbs: str = None, ebc: str = None, ferodo: str = None, a2z: str = None, rapco: str = None, grove: str = None, cleveland: str = None, matco: str = None):
        self.sbs = sbs
        self.ebc = ebc
        self.ferodo = ferodo
        self.a2z = a2z
        self.rapco = rapco
        self.grove = grove
        self.cleveland = cleveland
        self.matco = matco
        
    def to_dict(self):
        return self.__dict__

class Desticka:
    def __init__(self, kod: int, sortiment: int, kategorie: int, obrazek: str, vektor: str,
                 cislo_dilu: str, typ: int, publikovat: bool, aktualizovano: datetime, aktualizoval: int):
        self.kod = kod
        self.sortiment = sortiment
        self.kategorie = kategorie
        self.obrazek = obrazek
        self.vektor = vektor
        self.cislo_dilu = cislo_dilu
        self.typ = typ
        self.publikovat = publikovat
        self.aktualizovano = aktualizovano
        self.aktualizoval = aktualizoval
        
        self.material = {
            'plech_a': MaterialInfo(),
            'plech_b': MaterialInfo(),
            'izolator_a': MaterialInfo(),
            'izolator_b': MaterialInfo(),
            'segment_a': MaterialInfo(),
            'segment_b': MaterialInfo()
        }

        self.konkurence = KonkurenceDetail()

        self.material_text = None
        self.poznamka = None
        self.oem_cisla = None
        self.obchodni_nazev = None

    def to_dict(self):
        return {
            "kod": self.kod,
            "sortiment": self.sortiment,
            "kategorie": self.kategorie,
            "obrazek": self.obrazek,
            "vektor": self.vektor,
            "cislo_dilu": self.cislo_dilu,
            "typ": self.typ,
            "publikovat": self.publikovat,
            "aktualizovano": self.aktualizovano,
            "aktualizoval": self.aktualizoval,
            "material": {key: value.to_dict() for key, value in self.material.items()},
            "konkurence": self.konkurence.to_dict(),
            "material_text": self.material_text,
            "poznamka": self.poznamka,
            "oem_cisla": self.oem_cisla,
            "obchodni_nazev": self.obchodni_nazev
        }
        
class VozidloDesticka():
    def __init__(self, kod, cislo_dilu, kategorie, subkategorie, vyrobce, vozidlo, oznaceni_vozidla, typ, objem, obrazek, vektor, konkurence_sbs, konkurence_ebc, konkurence_ferodo, konkurence_a2z, 
                 konkurence_rapco, konkurence_grove, konkurence_cleveland, konkurence_matco, material, oem_cisla, specialni_oznaceni, rok_od, rok_do, pozice, publikovat):
        self.kod = kod
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
        self.konkurence_sbs = konkurence_sbs
        self.konkurence_ebc = konkurence_ebc
        self.konkurence_ferodo = konkurence_ferodo
        self.konkurence_a2z = konkurence_a2z
        self.konkurence_rapco = konkurence_rapco
        self.konkurence_grove = konkurence_grove
        self.konkurence_cleveland = konkurence_cleveland
        self.konkurence_matco = konkurence_matco
        self.material = material
        self.oem_cisla = oem_cisla
        self.specialni_oznaceni = specialni_oznaceni
        self.rok_od = rok_od
        self.rok_do = rok_do
        self.pozice = pozice
        self.publikovat = publikovat
        
    def to_dict(self):
        return self.__dict__
