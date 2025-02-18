// stores/auth.ts
import { defineStore } from 'pinia';
import Cookies from 'js-cookie';
import type { LoginCredentials } from '@/types/loginCredentials'
import type { LoginResponse } from '@/types/loginResponse'
import { REQUEST_TIMEOUT } from '@/constants/requests'
import { useRouter } from 'vue-router'

interface AuthState {
  token: string | null;
  errorMessage: string;
  isLoading: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    errorMessage: '',
    isLoading: false,
  }),

  getters: {
    isAuthenticated(state): boolean {
      return !!state.token;
    },
  },

  actions: {
    validateEmail(email: string): boolean {
      const emailRegex = /^[a-zA-Z0-9._-]+@zarplata.ru$/;
      return emailRegex.test(email);
    },

    createLoginRequest(credentials: LoginCredentials, signal: AbortSignal): RequestInit {
      return {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
        signal,
      };
    },

    async handleLoginResponse(response: Response): Promise<void> {
      switch (response.status) {
        case 200: {
          const data: LoginResponse = await response.json();
          if (!data.accessToken) {
            throw new Error('Invalid token received');
          }
          this.token = data.accessToken;
          Cookies.set('token', data.accessToken, {
            expires: 7
          });
          break;
        }
        case 401:
          this.errorMessage = 'Неверное имя пользователя или пароль';
          break;
        case 429:
          this.errorMessage = 'Слишком много попыток входа. Попробуйте позже';
          break;
        default:
          throw new Error(`Server responded with status: ${response.status}`);
      }
    },

    handleLoginError(error: Error): void {
      console.error('Login error:', error);
      if (error.name === 'AbortError') {
        this.errorMessage = 'Превышено время ожидания запроса';
      } else if (error.message.includes('Failed to fetch')) {
        this.errorMessage = 'Ошибка соединения с сервером';
      } else {
        this.errorMessage = 'Произошла ошибка при входе';
      }
    },

    async login(username: string, password: string): Promise<void> {
      if (!this.validateEmail(username)) {
        this.errorMessage = 'Неверный формат email';
        return;
      }

      this.isLoading = true;
      this.errorMessage = '';

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

      try {
        const credentials: LoginCredentials = {
          email: username.trim(),
          password,
        };

        const response = await fetch(
          '/api/v1/login',
          this.createLoginRequest(credentials, controller.signal)
        );

        clearTimeout(timeoutId);
        await this.handleLoginResponse(response);
      } catch (error) {
        this.handleLoginError(error as Error);
      } finally {
        this.isLoading = false;
      }
    },

    logout(): void {
      this.token = null;
      Cookies.remove('token');
    },

    checkAuth(): void {
      const savedToken = Cookies.get('token');
      if (savedToken) {
        this.token = savedToken;
      } else {
        this.logout();
      }
    }
  },
});
