import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translations
const resources = {
    en: {
        translation: {
            "Welcome": "Welcome to Velora",
            "Dashboard": "Dashboard",
            "Orders": "Orders",
            "Wishlist": "Wishlist",
            "Profile": "Profile",
            "Settings": "Settings",
            "Logout": "Logout",
            "Search": "Search products...",
            "Language": "Language"
        }
    },
    es: {
        translation: {
            "Welcome": "Bienvenido a Velora",
            "Dashboard": "Panel",
            "Orders": "Pedidos",
            "Wishlist": "Lista de Deseos",
            "Profile": "Perfil",
            "Settings": "Ajustes",
            "Logout": "Cerrar Sesión",
            "Search": "Buscar productos...",
            "Language": "Idioma"
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en", // default language
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;
