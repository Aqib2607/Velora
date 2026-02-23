import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enCommon from './locales/en/common.json';
import bnCommon from './locales/bn/common.json';
import esCommon from './locales/es/common.json';
import frCommon from './locales/fr/common.json';
import deCommon from './locales/de/common.json';
import arCommon from './locales/ar/common.json';

const resources = {
    en: { common: enCommon },
    bn: { common: bnCommon },
    es: { common: esCommon },
    fr: { common: frCommon },
    de: { common: deCommon },
    ar: { common: arCommon },
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        defaultNS: 'common',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // React already escapes values to prevent XSS
        },
        // We bind to local storage key to sync with Zustand
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
            lookupLocalStorage: 'velora-i18n-language',
        }
    });

export default i18n;
