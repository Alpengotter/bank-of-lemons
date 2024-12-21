<template>
  <div class="login-view">
    <div class="login-form glass">
      <p class="title">Авторизация</p>

      <form @submit.prevent="login" class="login">
        <div class="input-container">
          <input class="input" type="text" v-model="username" required placeholder="почта" />
          <input class="input" type="password" v-model="password" required placeholder="пароль" />
          <span class="input-error">{{ errorMessage }}</span>
        </div>
        <button class="submit" :class="{ disabled: isLoading }" type="submit">
          Войти
        </button>
      </form>

    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const REQUEST_TIMEOUT = 10000;

interface LoginResponse {
  accessToken: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

export default {
  setup() {
    const username = ref('');
    const password = ref('');
    const errorMessage = ref('');
    const isLoading = ref(false);
    const router = useRouter();

    const validateEmail = (email: string): boolean => {
      const emailRegex = /^[a-zA-Z0-9._-]+@zarplata.ru$/;
      return emailRegex.test(email);
    };

    const createLoginRequest = (credentials: LoginCredentials, signal: AbortSignal): RequestInit => ({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
      signal
    });

    const handleLoginResponse = async (response: Response): Promise<void> => {
      switch (response.status) {
        case 200: {
          const data: LoginResponse = await response.json();
          if (!data.accessToken) {
            throw new Error('Invalid token received');
          }
          localStorage.setItem('token', data.accessToken);
          router.push({ name: 'home' });
          break;
        }
        case 401:
          errorMessage.value = 'Неверное имя пользователя или пароль';
          break;
        case 429:
          errorMessage.value = 'Слишком много попыток входа. Попробуйте позже';
          break;
        default:
          throw new Error(`Server responded with status: ${response.status}`);
      }
    };

    const handleLoginError = (error: Error): void => {
      console.error('Login error:', error);

      if (error.name === 'AbortError') {
        errorMessage.value = 'Превышено время ожидания запроса';
      } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        errorMessage.value = 'Ошибка соединения с сервером';
      } else {
        errorMessage.value = 'Произошла ошибка при входе';
      }
    };

    const login = async (): Promise<void> => {
      if (!validateEmail(username.value)) {
        errorMessage.value = 'Неверный формат email';
        return;
      }

      isLoading.value = true;
      errorMessage.value = '';

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

      try {
        const credentials: LoginCredentials = {
          email: username.value.trim(),
          password: password.value
        };

        const response = await fetch(
          '/api/v1/login',
          createLoginRequest(credentials, controller.signal)
        );

        clearTimeout(timeoutId);
        await handleLoginResponse(response);
      } catch (error) {
        handleLoginError(error as Error);
      } finally {
        isLoading.value = false;
      }
    };

    return {
      username,
      password,
      errorMessage,
      isLoading,
      login
    };
  }
};
</script>

<style scoped>
.login-view {
  display: flex;
  justify-content: center;
  align-items: center;
}

.title {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  text-align: center;
}

.login-form {
  width: 295px;

  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 28px;
  gap: 35px;
}

.login {
  display: flex;
  flex-direction: column;
  gap: 35px;
}

.input-container {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.input {
  background-color: #ffffff60;
  color: var(--color-text);
  border: none;
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 16px;
}

.input-error {
  color: var(--vt-c-danger);
  font-size: 12px;
}

.submit {
  background-color: var(--vt-c-primary);
  color: var(--color-text);
  border: none;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 0;
  border-radius: 16px;
}

.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
