<template>
  <div class="container">
    <div class="filter-container" v-if="!employer?.id">
      <Search placeholder="Поиск" v-model:model-value="searchQuery" @update:modelValue="onSearchQueryChange"/>
      <div class="calendar-button" @click="toggleShowCalendar">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M3.9325 0C4.32738 0 4.6475 0.304873 4.6475 0.680952V1.3619H9.6525V0.680952C9.6525 0.304873 9.97262 0 10.3675 0C10.7624 0 11.0825 0.304873 11.0825 0.680952V1.37872C12.8891 1.54954 14.3 3.00118 14.3 4.76667V10.8952C14.3 12.7756 12.6994 14.3 10.725 14.3H3.575C1.60058 14.3 0 12.7756 0 10.8952V4.76667C0 3.00118 1.41094 1.54954 3.2175 1.37872V0.680952C3.2175 0.304873 3.53762 0 3.9325 0ZM1.55205 4.08571H12.7479C12.4535 3.29227 11.6589 2.72381 10.725 2.72381H3.575C2.64105 2.72381 1.84652 3.29227 1.55205 4.08571ZM12.87 5.44762H1.43V10.8952C1.43 12.0235 2.39035 12.9381 3.575 12.9381H10.725C11.9096 12.9381 12.87 12.0235 12.87 10.8952V5.44762Z" fill="black"/>
        </svg>
      </div>
      <div v-if="calendarIsShowing" class="calendar-view">
        <VueDatePicker v-model="date" range inline auto-apply :enable-time-picker="false" @update:modelValue="onDateChange"></VueDatePicker>
      </div>
    </div>
    <div v-if="historyStore.history.length" v-for="history of transformedHistory" class="history-container">
      <div>
        <p class="date" :class="{ current: format(new Date(history[0].date)) === currentDate }">{{ format(new
          Date(history[0].date)) }}</p>
      </div>
      <div class="history-list">

        <HistoryItem v-for="historyItem in history" :key="historyItem.id" :historyItem="historyItem"
          :employer="employer" />
      </div>
    </div>
    <div v-else-if="historyStore.loading">
      <Preloader :width="25" />
    </div>
    <div v-else>
      <div class="history-empty">
        <p>Нет последних операций</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useHistoryStores } from '@/stores/historyStores';
import { onMounted, ref } from 'vue';
import HistoryItem from './HistoryItem.vue';
import type { User } from '@/types/user';
import Preloader from '../Preloader.vue';
import type { TransformedHistory } from '@/types/transformedHistory';
import Search from '@/components/Search.vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { debounce } from '@/utils/debounce'

const searchQuery = ref('');

const historyStore = useHistoryStores();
const currentDate = ref();
const transformedHistory = ref<TransformedHistory>({});
const calendarIsShowing = ref(false);
const date = ref<Date[]>([]);

onMounted(async () => {
  const currentDate = new Date();
  const startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
  const endDate = new Date();
  date.value = [startDate, endDate];
  await getHistory()
})

async function getHistory() {
  try {
    if (props.employer?.id) {
      await historyStore.getHistoryByEmployer(props.employer.id);
    } else {
      const dateFrom = format(date.value[0]);
      const dateTo = format(date.value[1]);
      await historyStore.fetchHistory({
        dateFrom,
        dateTo,
        searchParam: searchQuery.value,
      });
    }
  } catch (error) {
    console.error('Error fetching history:', error);
  } finally {
    transformedHistory.value = transformHistory();
    currentDate.value = format(new Date());
  }
}

async function onDateChange(newDate: Date[]) {
  if (newDate && newDate.length === 2) {
    await getHistory();
  }
}

const debouncedOnSearchQueryChange = debounce(async () => {
  await getHistory();
}, 500);

function onSearchQueryChange(newQuery: string | number) {
  debouncedOnSearchQueryChange();
}

function transformHistory() {
  const transformedHistory: any = {};

  historyStore.history.forEach(item => {
    const formattedDate = format(new Date(item.date));
    if (!transformedHistory[formattedDate]) {
      transformedHistory[formattedDate] = [];
    }
    transformedHistory[formattedDate].push(item);
  });

  return transformedHistory;
}

// format date to 'DD.MM.YYYY'
const format = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

function toggleShowCalendar() {
  calendarIsShowing.value = !calendarIsShowing.value;
}

const props = defineProps<{
  employer?: User;
}>()
</script>
<style scoped>
.history-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.history-empty p {
  color: var(--color-secondary-text);
  text-align: center;
}

.history-list {
  width: 100%;
}

.date {
  color: #000;
  background-color: #fff;
  padding: 4px 8px;
  border-radius: 99px;
}

.current {
  color: #fff;
  background-color: #000;
}

.filter-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 2rem;
  position: relative;
}

.calendar-button {
  height: 43px;
  width: 43px;
  border: 1px solid var(--vt-c-black);
  border-radius: 999px;

  display: flex;
  justify-content: center;
  align-items: center;

  margin-left:0.5rem;
  cursor: pointer;
}

.calendar-view {
  position: absolute;
  z-index: 999;
  top: 50px;
}
</style>
