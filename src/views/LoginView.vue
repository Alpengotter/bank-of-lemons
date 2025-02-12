<template>
  <div class="login-view">
    <div class="login-form glass">
      <p class="title">Авторизация</p>

      <form @submit.prevent="handleLogin" class="login">
        <div class="input-container">
          <input class="input" type="text" v-model="username" required placeholder="почта" />
          <input class="input" type="password" v-model="password" required placeholder="пароль" />
          <span class="input-error">{{ authStore.errorMessage }}</span>
        </div>
        <button class="submit" :class="{ disabled: authStore.isLoading }" type="submit">
          Войти
        </button>
      </form>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const username = ref('')
const password = ref('')

const handleLogin = async () => {
  try {
    await authStore.login(username.value, password.value)
    await router.push('/')
  } catch (error) {
    console.log(error)
  }
}
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
