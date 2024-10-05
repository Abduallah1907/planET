import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "welcome": "Welcome to our website!",
      "title": "Travel Agency",
      "join_us": "Join Us",
      "register": "Register",
      "sign_in": "Sign In",
      "help": "Help",
      "currency": "Currency",
      "usd": "USD",
      "eur": "EUR",
      "egp": "EGP",
      "destinations": "Destinations",
      "hotels": "Hotels",
      "flights": "Flights",
      "bookings": "Bookings",
      "search": "Search",
      "adults": "Adults",
      "children": "Children",
      "where_are_you_going": "Where are you going?",
      "check_in_-_check_out": "Check-in - Check-out",
      "rooms": "Rooms",
      "guests": "Guests",
      "contact_us": "Contact Us",
      "about_us": "About Us",
      "terms_and_conditions": "Terms and Conditions",
      "privacy_policy": "Privacy Policy"
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
      "egp": "جنيه مصري",
      "destinations": "وجهات",
      "hotels": "فنادق",
      "flights": "رحلات",
      "bookings": "حجوزات",
      "search": "بحث",
      "adults": "الكبار",
      "children": "الأطفال",
      "where_are_you_going": "إلى أين تذهب؟",
      "check_in_-_check_out": "تسجيل الوصول - تسجيل المغادرة",
      "rooms": "غرف",
      "guests": "ضيوف",
      "contact_us": "اتصل بنا",
      "about_us": "معلومات عنا",
      "terms_and_conditions": "البنود و الظروف",
      "privacy_policy": "سياسة الخصوصية"

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
      "egp": "EGP",
      "destinations": "Destinations",
      "hotels": "Hôtels",
      "flights": "Vols",
      "bookings": "Réservations",
      "search": "Chercher",
      "adults": "Adultes",
      "children": "Enfants",
      "where_are_you_going": "Où allez-vous?",
      "check_in_-_check_out": "Arrivée - Départ",
      "rooms": "Chambres",
      "guests": "Invités",
      "contact_us": "Contactez nous",
      "about_us": "À propos de nous",
      "terms_and_conditions": "Termes et conditions",
      "privacy_policy": "Politique de confidentialité"

    }
  },
  de: {
    translation: {
      "welcome": "Willkommen auf unserer Website!",
      "title": "Reisebüro",
      "join_us": "Treten Sie uns bei",
      "register": "Registrieren",
      "sign_in": "Anmelden",
      "help": "Hilfe",
      "currency": "Währung",
      "usd": "USD",
      "eur": "EUR",
      "egp": "EGP",
      "destinations": "Reiseziele",
      "hotels": "Hotels",
      "flights": "Flüge",
      "bookings": "Buchungen",
      "search": "Suche",
      "adults": "Erwachsene",
      "children": "Kinder",
      "where_are_you_going": "Wohin gehst du?",
      "check_in_-_check_out": "Einchecken - Auschecken",
      "rooms": "Zimmer",
      "guests": "Gäste",
      "contact_us": "Kontaktiere uns",
      "about_us": "Über uns",
      "terms_and_conditions": "Geschäftsbedingungen",
      "privacy_policy": "Datenschutz-Bestimmungen"

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