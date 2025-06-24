export default async function registerAdminCI() {
  if (import.meta.env.VITE_CI !== 'true') return;

  try {
    const res = await fetch('/api/v1/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin' }),
    });

    if (res.status === 409) {
      console.log('admin already exists');
    } else if (!res.ok) {
      const text = await res.text();
      console.error('admin creation failed:', res.status, text);
    } else {
      console.log('admin created');
    }
  } catch (e) {
    console.error('network error:', e.message);
  }
}
