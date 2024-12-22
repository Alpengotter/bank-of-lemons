<template>
  <div class="wrapper">
    <header>
      <h2 class="fullname">Новый сотрудник</h2>
    </header>
    <main>
      <input v-model.trim="surname" type="text" class="input" placeholder="Фамилия">
      <p class="error-message">{{ errors.surname }}</p>
      <input v-model.trim="firstName" type="text" class="input" placeholder="Имя">
      <p class="error-message">{{ errors.firstName }}</p>
      <input v-model.trim="email" type="email" class="input" placeholder="Почта">
      <p class="error-message">{{ errors.email }}</p>
      <input v-model.trim="department" type="text" class="input" placeholder="Должность">
      <p class="error-message">{{ errors.department }}</p>
    </main>
    <footer>
      <Button appearance="primary" class="create-button">
        <span class="button-title" @click="handleSubmit">Создать</span></Button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/Button.vue';
import { useUserStore } from '@/stores/userStores';
import type { User } from '@/types/user';
import { computed, onMounted, ref } from 'vue';

const userStore = useUserStore();

const surname = ref('');
const firstName = ref('');
const email = ref('');
const department = ref('');

const errors = ref({
  surname: '',
  firstName: '',
  email: '',
  department: ''
});

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateField = (field: string) => {
  // FIXME: поправить типизацию
  // @ts-ignore
  errors.value[field] = '';

  switch (field) {
    case 'surname':
      if (!surname.value) {
        errors.value.surname = 'Фамилия обязательна';
      } else if (surname.value.length < 2) {
        errors.value.surname = 'Минимум 2 символа';
      }
      break;

    case 'firstName':
      if (!firstName.value) {
        errors.value.firstName = 'Имя обязательно';
      } else if (firstName.value.length < 2) {
        errors.value.firstName = 'Минимум 2 символа';
      }
      break;

    case 'email':
      if (!email.value) {
        errors.value.email = 'Email обязателен';
      } else if (!validateEmail(email.value)) {
        errors.value.email = 'Неверный формат email';
      }
      break;

    case 'department':
      if (department.value.length < 2) {
        errors.value.department = 'Минимум 2 символа';
      }
      break;
  }
};

const validateForm = () => {
  validateField('surname');
  validateField('firstName');
  validateField('email');
  validateField('department');
};

const isFormValid = computed(() => {
  return (
    surname.value &&
    firstName.value &&
    email.value &&
    department.value &&
    !errors.value.surname &&
    !errors.value.firstName &&
    !errors.value.email &&
    !errors.value.department
  );
});

const handleSubmit = async () => {
  validateForm();

  if (!isFormValid.value) {
    return;
  }

  const newUser: Omit<User, "id"> = {
    firstName: firstName.value,
    lastName: surname.value,
    email: email.value,
    lemons: 0,
    diamonds: 0,
    userRole: "USER",
    isActive: true,
    jobTitle: department.value
  }

  try {
    await userStore.addEmployer(newUser);
    surname.value = '';
    firstName.value = '';
    email.value = '';
    department.value = '';

    props.close();

  } catch (error) {
    console.error('Failed to create user:', error);
  }
};

const props = defineProps<{
  close: () => void;
}>()
</script>

<style scoped>
header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1;
  padding: 45px 0;
}

footer {
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: 28px;
  width: 100%;
}

.wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.fullname {
  font-style: normal;
  font-weight: 400;
  font-size: 26px;
  line-height: 30px;
}

.email {
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 14px;

  color: var(--color-secondary-text);
}

.wallet {
  display: flex;
  justify-content: space-around;

  padding: 45px 0;
}

.wallet p {
  font-style: normal;
  font-weight: 400;
  font-size: 40px;
  line-height: 46px;
}

.actions {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  margin-bottom: 1rem;
  justify-content: center
}

.history {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  flex-grow: 1;
}

.history-title {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 18px;
  text-align: center;

  padding: 32px 0;
}

.create-button {
  font-size: 16px;
  padding: 8px 16px;
}

.history-list {
  flex-grow: 1;
}

.history-empty p {
  color: var(--color-secondary-text);
  text-align: center;
}

.switch {
  display: flex;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 99px;
}

.switch-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 99px;
  margin: 4px;
  cursor: pointer;
}

.switch-item span {
  font-size: 14px;
}

.switch-item.active {
  background-color: var(--vt-c-white);
}

.input {
  border-radius: 99px;
  border: none;
  background-color: rgba(0, 0, 0, .1);
  padding: 8px 16px;
  font-size: 14px;

  width: 350px;
}

.submit {
  width: 40px;
  height: 40px;
  border-radius: 99px;
  padding: 0;
  font-size: 14px;
}

.change-value {
  font-size: 24px;
}

.error-message {
  color: #fd4137;
  font-size: small;
}
</style>
