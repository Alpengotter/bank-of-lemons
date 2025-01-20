import Cookies from 'js-cookie'
import axios from './axios'
import router from '@/router'
import { isAxiosError } from 'axios'

export const makeRequest = async <T>(
  endpoint: string,
  method: 'get' | 'post' | 'put',
  data?: unknown,
): Promise<T> => {
  const accessToken = Cookies.get('token')

  if (!accessToken) {
    throw new Error('No access token available')
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  }

  try {
    const response = await axios({
      url: `/api/v1/${endpoint}`,
      method,
      headers,
      ...(method !== 'get' && { data }),
    })

    return response.data
  } catch (error) {
    if (
      isAxiosError(error) &&
      error.response &&
      error.response.status === 500 &&
      error.response.data === 'Invalid token'
    ) {
      Cookies.remove('token')
      router.push('/login')
    }
    throw error
  }
}
