import axios from 'axios'

const registerAdminCI = async () => {
  try {
    await axios.post('/api/v1/signup', {
      username: 'admin',
      password: 'admin',
    })
  } catch (error) {
    if (error.response?.status !== 409) {
      throw new Error('Failed to register admin')
    }
  }
}

export default registerAdminCI