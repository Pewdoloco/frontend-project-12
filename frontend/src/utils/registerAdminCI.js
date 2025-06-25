export default async function registerAdminCI() {
  const isCI = import.meta.env.VITE_CI === 'true'
  console.log('[CI] mode:', isCI)

  if (!isCI) return

  try {
    const res = await fetch('/api/v1/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin' }),
    })

    if (res.status === 409) {
      console.log('[CI] admin already exists')
    }
    else if (!res.ok) {
      const text = await res.text()
      console.error('[CI] admin creation failed:', res.status, text)
    }
    else {
      console.log('[CI] admin created successfully')
    }
  }
  catch (e) {
    console.error('[CI] network error:', e.message)
  }
}
