<template>
  <div class="wrapper">
    <header>
      <h2 class="fullname">Новый сотрудник</h2>
    </header>
    <main>
      <input type="text" class="input" placeholder="Фамилия">
      <input type="text" class="input" placeholder="Имя">
      <input type="text" class="input" placeholder="Почта">
      <input type="text" class="input" placeholder="Должность">
      <select class="input">
        <option value="USER">Пользователь</option>
        <option value="ADMIN">Администратор</option>
      </select>
    </main>
    <footer>
      <Button appearance="primary" class="create-button">
        <span class="button-title">Создать</span></Button>
    </footer>
  </div>
</template>

<script setup lang="ts">
// TODO: добавить предупреждение о закрытии модалки
// TODO: добавить валидацию полей

import Button from '@/components/Button.vue';
import { useUserStore } from '@/stores/userStores';
import type { User } from '@/types/user';
import { onMounted, ref } from 'vue';

const userStore = useUserStore();

const handleSubmit = async (employer: User | undefined) => {

};


const props = defineProps<{

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
  gap: 16px;
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

.add {
  color: green;
}

.remove {
  color: #FF746C;
}
</style>
