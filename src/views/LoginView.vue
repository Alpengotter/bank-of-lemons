<template>
  <div class="login-view">
    <div class="login-form">
      <p class="title">Авторизация</p>

      <form @submit.prevent="login" class="login">
        <div class="input-container">
          <input class="input" type="text" v-model="username" required placeholder="email" />
          <input class="input" type="password" v-model="password" required placeholder="password" />
          <span class="input-error">{{ errorMessage }}</span>
        </div>
        <button class="submit" :class="{ disabled: isLoading }" type="submit">
          Войти
        </button>
      </form>

    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const API_URL = 'https://bankoflemons.ru/api/v1/login';
const REQUEST_TIMEOUT = 10000;

export default {
  setup() {
    const username = ref('');
    const password = ref('');
    const errorMessage = ref('');
    const isLoading = ref(false);
    const router = useRouter();

    const validateEmail = (email) => {
      const emailRegex = /^[a-zA-Z0-9._-]+@zarplata.ru$/;
      return emailRegex.test(email);
    };

    const login = async () => {
      try {
        isLoading.value = true;
        errorMessage.value = '';

        if (!validateEmail(username.value)) {
          errorMessage.value = 'Неверный формат email';
          return;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            email: username.value.trim(),
            password: password.value
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        switch (response.status) {
          case 200:
            const data = await response.json();
            if (data.token) {
              localStorage.setItem('token', data.token);
              router.push({ name: 'home' });
              return;
            }
            throw new Error('Invalid token received');

          case 401:
            errorMessage.value = 'Неверное имя пользователя или пароль';
            return;

          case 429:
            errorMessage.value = 'Слишком много попыток входа. Попробуйте позже';
            return;

          default:
            throw new Error(`Server responded with status: ${response.status}`);
        }

      } catch (error) {
        console.error('Login error:', error);

        if (error.name === 'AbortError') {
          errorMessage.value = 'Превышено время ожидания запроса';
        } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
          errorMessage.value = 'Ошибка соединения с сервером';
        } else {
          errorMessage.value = 'Произошла ошибка при входе';
        }

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

<style>
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
  background-color: var(--vt-c-white);

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
  background-color: var(--vt-c-gray);
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
