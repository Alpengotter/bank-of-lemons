<script setup lang="ts">
// @ts-ignore
import ArrowIcon from '@/assets/icons/arrow.svg?component'
// @ts-ignore
import ChevronIcon from '@/assets/icons/chevron.svg?component'

import { computed, onMounted, ref, watch } from 'vue'
import BarChartComponent from '@/components/statistics/BarChartComponent.vue'
import { getStatisticTranslation } from '@/constants/statistics'
import { useStatisticsStores } from '@/stores/statisticsStores'
import type { StatisticsSummaryResponse } from '@/types/statistic'
import Preloader from '@/components/Preloader.vue'

const statisticsStore = useStatisticsStores()
const currentYear = new Date().getFullYear()
const fetchedData = ref<StatisticsSummaryResponse | null>(null);
const loading = ref(true);

const selectedYear = ref(currentYear);
const prevYear = computed(() => selectedYear.value - 1);
const nextYear = computed(() => selectedYear.value + 1);

const handlePrevYear = async () => {
  selectedYear.value = prevYear.value;
};

const handleNextYear = async () => {
  selectedYear.value = nextYear.value;
};

const fetchData = async () => {
  try {
    loading.value = true;

    if (props.type) {
      const response = await statisticsStore.fetchStatisticsSummary(
        [props.type.toLowerCase()],
        selectedYear.value,
        true
      );

      fetchedData.value = response?.[0] || null;
    }
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});

watch(selectedYear, () => {
  fetchData();
});

const emitClose = () => {
  emit('close-modal')
}

const props = defineProps<{
  type: string
}>()

const emit = defineEmits<{
  (e: 'close-modal'): void
}>()
</script>

<template>
  <div class="modal-overlay" @click="emitClose">
    <div class="modal-content glass card card-full" @click.stop >
      <div v-if="statisticsStore.loading || !fetchData || loading">
        <Preloader :width="50" />
      </div>
      <div v-else>
        <div class="header">
          <div class="title">{{ getStatisticTranslation(fetchedData!.type) }}</div>
          <div class="btn-show-more" @click="emitClose">
            <ArrowIcon class="minimize" />
          </div>
        </div>

        <div class="summary">
          <p class="summary-total">{{ fetchedData!.total }}</p>
          <p class="summary-year">за {{ selectedYear }}</p>
        </div>
        <div class="chart">
          <BarChartComponent :data="fetchedData!.totalMounth" :range="[0, 12]" />
        </div>
        <div class="paginator">
          <button class="paginator-year" @click="handlePrevYear">{{ prevYear }}</button>
          <span class="paginator-previous"><ChevronIcon /></span>
          <button class="paginator-year active">{{ selectedYear }}</button>
          <span class="paginator-next"><ChevronIcon style="transform: rotate(180deg)" /></span>
          <button class="paginator-year" @click="handleNextYear">{{ nextYear }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 36px;
  flex: 1 0 25%;
}

.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.title {
  font-style: normal;
  font-weight: 300;
  font-size: 24px;

  color: #000000;
}

.btn-show-more {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;

  background-color: #ffffff;
  border-radius: 99px;

  cursor: pointer;
}

.summary {
  display: flex;
  flex-direction: column;
}

.summary-total {
  font-style: normal;
  font-weight: 300;
  font-size: 36px;

  color: #000000;
}

.summary-year {
  font-style: normal;
  font-weight: 300;
  font-size: 14px;

  color: #939393;
}

.chart {
  margin-top: 40px;
  display: flex;
  justify-content: center;
  flex: 1;
  width: 100%;
}

.card-full {
  flex: 1 0 100%;
}
/* Подложка модального окна */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Полупрозрачный фон */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Содержимое модального окна */
.modal-content {
  max-width: 1140px; /* Максимальная ширина */
  height: 400px; /* Максимальная высота */
  overflow-y: hidden; /* Добавляем скролл, если содержимое не помещается */
  background-color: white; /* Цвет фона */
  border-radius: 10px; /* Закругленные углы */
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Тень */
}

.paginator {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.paginator-year {
  background-color: #ffffff;
  padding: 2px 8px;
  border-radius: 99px;
  border: none;

  cursor: pointer;
}

.paginator-year:hover {
  background-color: #d8d8d8;
}

.active {
  background-color: #ffe000;
  cursor: auto;
}

.active:hover {
  background-color: #ffe000;
}

.paginator-previous,
.paginator-next {
  display: flex;
  justify-content: center;
}

.minimize {
  transform: rotate(180deg);
}
</style>
