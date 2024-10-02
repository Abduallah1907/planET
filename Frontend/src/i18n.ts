import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "welcome": "Welcome to our website!",
      "title": "Travel Agency",
      "join_us": "JOIN US",
      "register": "Register",
      "sign_in": "Sign In",
      "help": "Help",
      "currency": "Currency",
      "usd": "USD",
      "eur": "EUR",
      "egp": "EGP"
    }
  },
  ar: {
    translation: {
      "welcome": "مرحبًا بكم في موقعنا!",
      "title": "وكالة السفر",
      "join_us": "انضم إلينا",
      "register": "انشاء حساب",
      "sign_in": "تسجيل الدخول",
      "help": "مساعدة",
      "currency": "العملة",
      "usd": "دولار أمريكي",
      "eur": "يورو",
      "egp": "جنيه مصري"
    }
  },
  fr: {
    translation: {
      "welcome": "Bienvenue sur notre site!",
      "title": "Agence de voyage",
      "join_us": "REJOIGNEZ-NOUS",
      "register": "S'inscrire",
      "sign_in": "Se connecter",
      "help": "Aide",
      "currency": "Devise",
      "usd": "USD",
      "eur": "EUR",
      "egp": "EGP"
    }
  },
    de: {
        translation: {
        "welcome": "Willkommen auf unserer Website!",
        "title": "Reisebüro",
        "join_us": "Treten Sie uns bei",
        "register": "Registrieren",
        "sign_in": "Einloggen",
        "help": "Hilfe",
        "currency": "Währung",
        "usd": "USD",
        "eur": "EUR",
        "egp": "EGP"
        }
    }

};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    interpolation: {
      escapeValue: false // react already safes from xss
    },
    keySeparator: false, // we do not use keys in form messages.welcome
    nsSeparator: false, // we do not use keys in form messages.welcome
    parseMissingKeyHandler: (key) => key.toLowerCase(), // normalize keys to lowercase
  });

export default i18n;