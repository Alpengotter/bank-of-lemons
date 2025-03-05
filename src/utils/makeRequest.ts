import Cookies from 'js-cookie'
import axios from './axios'
import router from '@/router'
import { isAxiosError } from 'axios'
import { useAuthStore } from '@/stores/useAuthStore'

export const makeRequest = async <T>(
  endpoint: string,
  method: 'get' | 'post' | 'put',
  data?: unknown,
  responseType?: 'json' | 'blob' | 'arraybuffer' | 'document' | 'text' | 'stream',
): Promise<T> => {
  const authStore = useAuthStore();
  authStore.checkAuth();

  if (!authStore.token) {
    authStore.logout();
    router.push('/login');
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${authStore.token}`,
  };

  try {
    const response = await axios({
      url: `/api/v1/${endpoint}`,
      method,
      headers,
      ...(method !== 'get' && { data }),
      responseType,
    });

    return response.data;
  } catch (error) {
    if (
      isAxiosError(error) &&
      error.response &&
      error.response.status === 500 &&
      error.response.data === 'Invalid token'
    ) {
      Cookies.remove('token');
      await router.push('/login');
    }
    throw error;
  }
};
