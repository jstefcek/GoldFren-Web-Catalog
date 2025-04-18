import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'cs',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          home: 'Home',
          nove: 'New',
          sortiment: 'Products',
          kontakt: 'Contact',
          login: 'Login in',
          adaptery: 'Adapters',
          brzdice: 'Calipers',
          desticky: 'Pads',
          hadicky: 'Hoses',
          kotouce: 'Discs',
          pumpy: 'Pumps',
          prislusenstvi: 'Accessories',
          searchTitle: 'Search Goldfren catalog',
          category: {
            motorbike: 'Motorbike',
            car: 'Car',
            kart: 'Kart',
            bike: 'Bike',
            plane: 'Plane',
            industry: 'Industry',
            pad: 'Brake Pads',
            brake: 'Brakes',
            adapter: 'Brake Adapter',
            disc: 'Brake Disc',
          },
        },
      },
      cs: {
        translation: {
          home: 'Domů',
          nove: 'Nové',
          sortiment: 'Sortiment',
          kontakt: 'Kontakt',
          login: 'Přihlásit se',
          adaptery: 'Adaptéry',
          brzdice: 'Brzdiče',
          desticky: 'Destičky',
          hadicky: 'Hadičky',
          kotouce: 'Kotouče',
          pumpy: 'Pumpy',
          prislusenstvi: 'Příslušenství',
          searchTitle: 'Vyhledávání v katalogu Goldfren',
          category: {
            motorbike: 'Motorka',
            car: 'Auto',
            kart: 'Motokára',
            bike: 'Kolo',
            plane: 'Letadlo',
            industry: 'Průmysl',
            pad: 'Brzdové destičky',
            brake: 'Brzdy',
            adapter: 'Adaptér brzd',
            disc: 'Brzdový kotouč',
          },
        },
      },
      de: {
        translation: {
          home: 'Startseite',
          nove: 'Neu',
          sortiment: 'Produkte',
          kontakt: 'Kontakt',
          login: 'Anmelden',
          adaptery: 'Adapter',
          brzdice: 'Bremssättel',
          desticky: 'Beläge',
          hadicky: 'Schläuche',
          kotouce: 'Scheiben',
          pumpy: 'Pumpen',
          prislusenstvi: 'Zubehör',
          searchTitle: 'Goldfren-Katalog durchsuchen',
          category: {
            motorbike: 'Motorrad',
            car: 'Auto',
            kart: 'Kart',
            bike: 'Fahrrad',
            plane: 'Flugzeug',
            industry: 'Industrie',
            pad: 'Bremsbeläge',
            brake: 'Bremsen',
            adapter: 'Bremsadapter',
            disc: 'Bremsscheibe',
          },
        }
      }
    },
  });

export default i18n;
