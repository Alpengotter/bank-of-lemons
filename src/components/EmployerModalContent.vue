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
        <p><img src="@/assets/lemon.png" alt="lemon" width="30" height="30" style="margin-right: 4px"/><span>{{ employer?.lemons }}</span>
          <span v-if="activeCurrencyIndex === 0 && inputValue.length" class="change-value"
            :class="{ 'add': activeOperationIndex === 0, 'remove': activeOperationIndex === 1 }">
            <span v-if="activeOperationIndex === 0">+</span>
            <span v-else>-</span>{{ inputValue }}
          </span>
        </p>
        <p><img src="@/assets/gem.png" alt="gem" width="30" height="30" style="margin-right: 4px"/> <span>{{ employer?.diamonds }}</span>
          <span v-if="activeCurrencyIndex === 1 && inputValue.length" class="change-value"
            :class="{ 'add': activeOperationIndex === 0, 'remove': activeOperationIndex === 1 }">
            <span v-if="activeOperationIndex === 0">+</span>
            <span v-else>-</span>{{ inputValue }}
          </span>
        </p>
      </div>

      <div class="actions-wrapper">
        <div class="actions">
          <div class="switch">
            <div v-for="(currency, index) in currencies" :key="index"
              :class="{ 'switch-item': true, active: activeCurrencyIndex === index }" @click="setActiveCurrency(index)">
              <span>{{ currency }}</span>
            </div>
          </div>
          <div class="switch">
            <div v-for="(operation, index) in operations" :key="index"
              :class="{ 'switch-item': true, active: activeOperationIndex === index }"
              @click="setActiveOperation(index)">
              <span>{{ operation }}</span>
            </div>
          </div>
          <input class="input" type="text" placeholder="0" v-model="inputValue">

        </div>

        <div class="comment-container">
          <input class="input" type="text" placeholder="Комментарий" v-model="commentValue">
          <div class="checkbox-wrapper">
            <label class="checkbox-container">
              <input type="checkbox" v-model="isNotify" />
              <span class="checkbox-checkmark"></span>
            </label>
            <p>Уведомить о начислении</p>
          </div>
        </div>

        <Button appearance="primary" class="submit" @click="handleSubmit(employer)" :disabled="!inputValue.length"
          :class="{ 'disabled': !inputValue.length }">
          OK
        </Button>
      </div>

      <div class="history">
        <p class="history-title">Последние операции</p>
        <div class="history-list">
          <HistoryComponent :employer="employer" />
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
import HistoryComponent from './history/HistoryComponent.vue';

const userStore = useUserStore();

const operations = ['+', '-'];
const currencies = ['🍋', '💎'];

const activeOperationIndex = ref(0);
const activeCurrencyIndex = ref(0);
const inputValue = ref('');
const employer = ref<User | undefined>(undefined);

const isNotify = ref<boolean>(false);
const commentValue = ref<string>('')

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

  if (lemons < 0) {
    lemons = 0;
  }

  if (diamonds < 0) {
    diamonds = 0;
  }

  try {
    await props.updateWallet(employer.id, { lemons, diamonds, comment: commentValue.value });
    await refresh();

    if (isNotify.value) {
      sendNotification(employer.email, parseInt(inputValue.value), lemons > 0 ? 'lemons' : 'diamonds', commentValue.value)
    }

    inputValue.value = '';
    commentValue.value = ''
  } catch (error) {
    console.error('Error updating wallet:', error);
  }
};

const sendNotification = (email: string, count: number, currency: string, comment: string) => {
  const langCurrency = currency === 'lemons' ? 'лимонов' : 'алмазов'
  const subject = 'Магазин мерча Зарплаты.ру';
  const body = `Привет!%0D%0AМы начислили тебе ${count} ${langCurrency} за ачивку "${comment}".%0D%0AПереходи в наш магазин мерча store.zarplata.ru и оформляй заказ. Вперед за покупками!`
  const mailto = `
            mailto:${email}?subject=${subject}&body=${body}
        `;
  window.location.href = mailto;
}

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
    comment: string;
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

.actions-wrapper {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.actions {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1rem;
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

.comment-container {
  display: flex;
  gap: 0.5rem;
}

.checkbox-wrapper {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

/* custom input */

/* The container */
.checkbox-container {
  display: flex;
  position: relative;
  padding-left: 25px;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  width: 25px;
  height: 25px;
}

/* Hide the browser's default checkbox */
.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkbox-checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #fff;
  border-radius: 99px;
  transition: .2s;
}

/* On mouse-over, add a grey background color */
.checkbox-container:hover input~.checkmark {
  background-color: #d4d4d4;
  transition: .2s;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkbox-checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.checkbox-container input:checked~.checkbox-checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.checkbox-container .checkbox-checkmark:after {
  left: 10px;
  top: 6px;
  width: 5px;
  height: 10px;
  border: solid black;
  border-width: 0 2px 2px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
</style>
