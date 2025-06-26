export default async function registerAdminCI() {
  const isCI = import.meta.env.VITE_CI === 'true'
  if (!isCI) return

  try {
    const res = await fetch('/api/v1/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin' }),
    })

    if (res.status === 409) {
      // admin уже существует
    }
    else if (!res.ok) {
      // не получилось создать admin
    }
    else {
      // admin cjplfy
    }
  }
  catch {
    // ошибка
  }
}
