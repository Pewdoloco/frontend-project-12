import axios from 'axios';

export default function initCI() {
  console.log('CI mode:', import.meta.env.VITE_CI);
  if (import.meta.env.VITE_CI === 'true') {
    console.log('CI init: creating admin.');
    axios.post('/api/v1/signup', {
      username: 'admin',
      password: 'admin',
    }).then(() => {
      console.log('админ создан');
    }).catch((e) => {
      if (e?.response?.status === 409) {
        console.log('админ уже существует');
      } else {
        console.error('Не удалось создать админа', e.message);
      }
    });
  }
}
