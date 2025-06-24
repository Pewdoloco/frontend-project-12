import axios from 'axios';

export default function initCI() {
    console.log('CI mode:', import.meta.env.VITE_CI);
  if (import.meta.env.VITE_CI === 'true') {
    axios.post('/api/v1/signup', {
      username: 'admin',
      password: 'admin',
    }).catch((e) => {
      if (e?.response?.status !== 409) {
        console.error('CI init admin user failed:', e);
      }
    });
  }
}
