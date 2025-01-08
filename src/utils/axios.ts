import axios from 'axios'
import Cookies from 'js-cookie'
import router from '@/router'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      Cookies.remove('auth_token')
      router.push('/login')
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
