import axios from 'axios'

const registerAdminCI = async () => {
  try {
    const username = import.meta.env.VITE_ADMIN_USERNAME
    const password = import.meta.env.VITE_ADMIN_PASSWORD

    if (!username || !password) {
      throw new Error('Admin credentials are not set')
    }

    await axios.post('/api/v1/signup', {
      username,
      password,
    })
  }
  catch (error) {
    if (error.response?.status !== 409) {
      throw new Error('Failed to register admin')
    }
  }
}

export default registerAdminCI
