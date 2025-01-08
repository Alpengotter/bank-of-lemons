<template>
  <div v-if="userStore.loading" class="preloader">
    <Preloader :width="50" />
  </div>
  <div class="wrapper" v-if="employer && !userStore.loading">
    <header>
      <h2 class="fullname">{{ employer?.lastName }} {{ employer?.firstName }}</h2>
      <span class="email">{{ employer?.email }}</span>
    </header>
    <main>
      <div class="wallet">
        <p>🍋 <span>{{ employer?.lemons }}</span>
          <span v-if="activeCurrencyIndex === 0 && inputValue.length" class="change-value"
            :class="{ 'add': activeOperationIndex === 0, 'remove': activeOperationIndex === 1 }">
            <span v-if="activeOperationIndex === 0">+</span>
            <span v-else>-</span>{{ inputValue }}
          </span>
        </p>
        <p>💎 <span>{{ employer?.diamonds }}</span>
          <span v-if="activeCurrencyIndex === 1 && inputValue.length" class="change-value"
            :class="{ 'add': activeOperationIndex === 0, 'remove': activeOperationIndex === 1 }">
            <span v-if="activeOperationIndex === 0">+</span>
            <span v-else>-</span>{{ inputValue }}
          </span>
        </p>
      </div>
      <div class="actions">
        <div class="switch">
          <div v-for="(currency, index) in currencies" :key="index"
            :class="{ 'switch-item': true, active: activeCurrencyIndex === index }" @click="setActiveCurrency(index)">
            <span>{{ currency }}</span>
          </div>
        </div>
        <div class="switch">
          <div v-for="(operation, index) in operations" :key="index"
            :class="{ 'switch-item': true, active: activeOperationIndex === index }" @click="setActiveOperation(index)">
            <span>{{ operation }}</span>
          </div>
        </div>
        <input class="input" type="text" placeholder="0" v-model="inputValue">
        <Button appearance="primary" class="submit" @click="handleSubmit(employer)" :disabled="!inputValue.length"
          :class="{ 'disabled': !inputValue.length }">
          OK
        </Button>
      </div>

      <div class="history">
        <p class="history-title">Последние операции</p>
        <div class="history-list">
          <HistoryView :employer="employer" />
        </div>
      </div>
    </main>
    <footer>
      <Button appearance="attention" class="deactivate">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8 1C4.1 1 1 4.1 1 8C1 11.9 4.1 15 8 15C11.9 15 15 11.9 15 8C15 4.1 11.9 1 8 1ZM8 14C4.7 14 2 11.3 2 8C2 4.7 4.7 2 8 2C11.3 2 14 4.7 14 8C14 11.3 11.3 14 8 14Z"
            fill="white" />
          <path
            d="M10.7 11.5L8 8.8L5.3 11.5L4.5 10.7L7.2 8L4.5 5.3L5.3 4.5L8 7.2L10.7 4.5L11.5 5.3L8.8 8L11.5 10.7L10.7 11.5Z"
            fill="white" />
        </svg>

        <span class="button-title" @click="deactivate">Деактивировать</span></Button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/Button.vue';
import { useUserStore } from '@/stores/userStores';
import type { User } from '@/types/user';
import { onMounted, ref } from 'vue';
import Preloader from './Preloader.vue';
import HistoryView from './history/HistoryView.vue';

const userStore = useUserStore();

const operations = ['+', '-'];
const currencies = ['🍋', '💎'];

const activeOperationIndex = ref(0);
const activeCurrencyIndex = ref(0);
const inputValue = ref('');
const employer = ref<User | undefined>(undefined);

onMounted(async () => {
  try {
    const response = await userStore.getEmployerById(props.employerId);
    employer.value = response;
  } catch (error) {
    console.error('Error fetching employer:', error);
  }
});

const refresh = async () => {
  try {
    const response = await userStore.getEmployerById(props.employerId);
    employer.value = response;
  } catch (error) {
    console.error('Error fetching employer:', error);
  }
}

const handleSubmit = async (employer: User | undefined) => {
  if (!employer) return;
  let lemons = employer.lemons || 0;
  let diamonds = employer.diamonds || 0;

  if (inputValue.value.length) {
    if (activeCurrencyIndex.value === 0) {
      if (activeOperationIndex.value === 0) {
        lemons += parseInt(inputValue.value);
      } else {
        lemons -= parseInt(inputValue.value);
      }
    } else {
      if (activeOperationIndex.value === 0) {
        diamonds += parseInt(inputValue.value);
      } else {
        diamonds -= parseInt(inputValue.value);
      }
    }
  }

  try {
    await props.updateWallet(employer.id, { lemons, diamonds });
    await refresh();

    inputValue.value = '';
  } catch (error) {
    console.error('Error updating wallet:', error);
  }
};

const setActiveOperation = (index: number) => {
  activeOperationIndex.value = activeOperationIndex.value === index ? 0 : index;
};

const setActiveCurrency = (index: number) => {
  activeCurrencyIndex.value = activeCurrencyIndex.value === index ? 0 : index;
};

const deactivate = async () => {
  try {
    await userStore.deactivateEmployerById(props.employerId)
    props.close();
  } catch (error) {
    console.error('Error deactivating employer:', error);
  }
}


const props = defineProps<{
  employerId: number,
  close: () => void;
  updateWallet: (id: number, wallet: {
    lemons: number;
    diamonds: number;
  }) => Promise<User | undefined>;
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

.button-title {
  margin-left: 6px;
}

.preloader {
  display: flex;
  justify-content: center;
  align-items: center;
}

.disabled {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
