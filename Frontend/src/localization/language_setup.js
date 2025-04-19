import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './languages/english.json';
import translationCS from './languages/czech.json';
import translationDE from './languages/german.json';

const resources = {
  en: { translation: translationEN },
  cs: { translation: translationCS },
  de: { translation: translationDE }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'cs',
    debug: false,
    interpolation: { escapeValue: false },
    resources
  });

export default i18n;
