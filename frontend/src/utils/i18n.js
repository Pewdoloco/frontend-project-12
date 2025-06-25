import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ru from './locales/ru.js'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ru: ru,
    },
    lng: 'ru',
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false,
    },
    initImmediate: false,
    react: {
      useSuspense: false,
    },
  })

export default i18n
