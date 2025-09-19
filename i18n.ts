import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en.json';
import fa from './locales/fa.json';

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async (callback: (lang: string) => void) => {
    const savedLanguage = await AsyncStorage.getItem('lang');
    if (savedLanguage) {
      callback(savedLanguage);
    }
  },
  init: () => {},
  cacheUserLanguage: async (lang: string) => {
    await AsyncStorage.setItem('lang', lang);
  },
};

i18n
  .use(languageDetector as any)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fa: { translation: fa },
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
