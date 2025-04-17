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
        }
      }
    },
  });

export default i18n;