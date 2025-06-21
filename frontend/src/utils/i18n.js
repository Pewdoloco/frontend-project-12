import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ru: {
        translation: {
          common: {
            logout: 'Выйти',
            loading: 'Загрузка...',
            disconnected: 'Отключено от сервера. Переподключение...',
            error: 'Ошибка',
          },
          header: {
            appName: 'Hexlet Chat',
          },
          home: {
            channels: 'Каналы',
            addChannel: '+',
            chat: 'Чат',
            send: 'Отправить',
            typeMessage: 'Введите сообщение...',
          },
          modals: {
            addChannel: 'Добавить канал',
            removeChannel: 'Удалить канал',
            renameChannel: 'Переименовать канал',
            channelName: 'Название канала',
            cancel: 'Отмена',
            add: 'Добавить',
            remove: 'Удалить',
            rename: 'Переименовать',
            confirmRemove: 'Вы уверены, что хотите удалить этот канал?',
            required: 'Обязательное поле',
            uniqueName: 'Название канала должно быть уникальным',
            nameLength: 'Должно быть 3–20 символов',
          },
          login: {
            title: 'Вход',
            username: 'Имя пользователя',
            password: 'Пароль',
            login: 'Войти',
            noAccount: 'Нет аккаунта? ',
            signup: 'Зарегистрироваться',
            invalidCredentials: 'Неверное имя пользователя или пароль',
          },
          signup: {
            title: 'Регистрация',
            username: 'Имя пользователя',
            password: 'Пароль',
            confirmPassword: 'Подтвердите пароль',
            signup: 'Зарегистрироваться',
            haveAccount: 'Уже есть аккаунт? ',
            login: 'Войти',
            userExists: 'Пользователь уже существует',
            registrationFailed: 'Регистрация не удалась. Попробуйте снова.',
            passwordMatch: 'Пароли должны совпадать',
            minPasswordLength: 'Должно быть не менее 6 символов',
          },
          notFound: {
            title: '404 - Страница не найдена',
            message: 'Извините, запрашиваемая страница не существует.',
          },
          toast: {
            error: 'Произошла ошибка: {{error}}',
            networkError: 'Нет соединения с сервером',
            channelAdded: 'Канал "{{name}}" создан',
            channelRenamed: 'Канал "{{name}}" переименован',
            channelRemoved: 'Канал "{{name}}" удалён',
          },
        },
      },
    },
    lng: 'ru',
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;