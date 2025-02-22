<template>
  <div class="container">
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

const historyStore = useHistoryStores();
const currentDate = ref();
const transformedHistory = ref<TransformedHistory>({});

onMounted(async () => {
  try {
    if (props.employer?.id) {
      await historyStore.getHistoryByEmployer(props.employer.id);
    } else {
      const dateFrom = format(new Date());
      const dateTo = format(getNextMonthDate(new Date()))
      await historyStore.fetchHistory({
        dateFrom,
        dateTo
      });
    }
  } catch (error) {
    console.error('Error fetching history:', error);
  } finally {
    transformedHistory.value = transformHistory();
    currentDate.value = format(new Date());
  }
})

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

function getNextMonthDate(currentDate: Date): Date {
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const nextMonth = (currentMonth + 1) % 12;
  const nextYear = currentYear + Math.floor((currentMonth + 1) / 12);

  return new Date(nextYear, nextMonth, currentDate.getDate());
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
</style>
