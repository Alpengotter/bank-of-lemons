<template>
  <div class="wrapper">
    <header>
      <h2 class="fullname">{{ employer?.lastName }} {{ employer?.firstName }}</h2>
      <span class="email">{{ employer?.email }}</span>
    </header>
    <main>
      <div class="wallet">
        <p>🍋 <span>{{ employer?.lemons }}</span></p>
        <p>💎 <span>{{ employer?.diamonds }}</span></p>
      </div>
      <div class="actions">
        <div class="switch">
          <TransitionGroup name="slide">
            <div v-for="(operation, index) in operations" :key="index"
              :class="{ 'switch-item': true, active: activeOperationIndex === index }"
              @click="setActiveOperation(index)">
              <span>{{ operation }}</span>
            </div>
          </TransitionGroup>
        </div>
        <div class="switch">
          <TransitionGroup name="slide">
            <div v-for="(currency, index) in currencies" :key="index"
              :class="{ 'switch-item': true, active: activeCurrencyIndex === index }" @click="setActiveCurrency(index)">
              <span>{{ currency }}</span>
            </div>
          </TransitionGroup>
        </div>
        <input class="input" type="text" placeholder="0">
        <Button appearance="primary" class="submit">
          OK
        </Button>
      </div>

      <div class="history">
        <p class="history-title">Последние операции</p>
        <div class="history-list">
          <div class="history-empty">
            <p>Нет последних операций</p>
          </div>
        </div>
      </div>
    </main>
    <footer>
      <Button appearance="attention" class="deactivate">
        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6.5 19C6.5 19.5304 6.71071 20.0391 7.08579 20.4142C7.46086 20.7893 7.96957 21 8.5 21H16.5C17.0304 21 17.5391 20.7893 17.9142 20.4142C18.2893 20.0391 18.5 19.5304 18.5 19V7H6.5V19ZM8.5 9H16.5V19H8.5V9ZM16 4L15 3H10L9 4H5.5V6H19.5V4H16Z"
            fill="white" />
        </svg>
        Деактивировать</Button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/Button.vue';
import type { User } from '@/types/user';
import { ref } from 'vue';

const operations = ['+', '-'];
const currencies = ['🍋', '💎'];
// Текущее состояние для отслеживания активного индекса
const activeOperationIndex = ref(0); // Изначально не выбран ни один элемент
const activeCurrencyIndex = ref(0); // Изначально не выбран ни один элемент


// Меняет активный элемент
const setActiveOperation = (index: number) => {
  activeOperationIndex.value = activeOperationIndex.value === index ? 0 : index; // Если активный повторно, убираем активность
};

const setActiveCurrency = (index: number) => {
  activeCurrencyIndex.value = activeCurrencyIndex.value === index ? 0 : index; // Если активный повторно, убираем активность
};


defineProps<{
  employer: User | undefined,
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
  flex: 1;
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

.deactivate {
  font-size: 16px;
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
  background-color: rgba(255, 255, 255, .5);
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

}

.switch-item span {
  font-size: 14px;
}

.switch-item.active {
  background-color: var(--vt-c-primary);
}

/* Анимации для слайдов */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}

.input {
  border-radius: 99px;
  border: none;
  background-color: rgba(255, 255, 255, .5);
  padding: 8px 16px;
  font-size: 14px;
}

.submit {
  width: 40px;
  height: 40px;
  border-radius: 99px;
  padding: 0;
  font-size: 14px;
}
</style>
