<script setup lang="ts">
import type { StatisticItem } from '@/types/statistic-item'
// @ts-ignore
import ArrowIcon from '@/assets/icons/arrow.svg?component'
// @ts-ignore
import ChevronIcon from '@/assets/icons/chevron.svg?component'
import BarChartComponent from '@/components/statistics/BarChartComponent.vue'
import { ref } from 'vue'

const currentYear = new Date().getFullYear();

const selectedYear = ref(currentYear);
const prevYear = ref(currentYear - 1);
const nextYear = ref(currentYear + 1);

const isOpenFullPage = ref(false);

const toggleOpenFullPage = () => {
  isOpenFullPage.value = !isOpenFullPage.value;

  selectedYear.value = currentYear;
  prevYear.value = currentYear - 1;
  nextYear.value = currentYear + 1;
};

const handlePrevYear = () => {
  selectedYear.value = prevYear.value;
  prevYear.value = selectedYear.value - 1;
  nextYear.value = selectedYear.value + 1;
}

const handleNextYear = () => {
  selectedYear.value = nextYear.value;
  prevYear.value = selectedYear.value - 1;
  nextYear.value = selectedYear.value + 1;
}

defineProps<{
  data: StatisticItem;
  range: number[];
}>()
</script>

<template>
  <div class="glass card">
    <div class="header">
      <div class="title">{{ data.title }}</div>
      <div class="btn-show-more" @click="toggleOpenFullPage">
        <ArrowIcon
          :class="{
            minimize: isOpenFullPage,
          }"
        />
      </div>
    </div>
    <div class="summary">
      <p class="summary-total">{{ data.summary.total }}</p>
      <p class="summary-year">за {{ currentYear }}</p>
    </div>
    <div class="chart">
      <BarChartComponent :data="data.summary.byMounths" :range="range" />
    </div>
  </div>

  <!-- Модальное окно -->
  <div v-if="isOpenFullPage" class="modal-overlay" @click="toggleOpenFullPage">
    <div class="modal-content glass card card-full" @click.stop>
      <div class="header">
        <div class="title">{{ data.title }}</div>
        <div class="btn-show-more" @click="toggleOpenFullPage">
          <ArrowIcon
            :class="{
              minimize: isOpenFullPage,
            }"
          />
        </div>
      </div>
      <div class="summary">
        <p class="summary-total">{{ data.summary.total }}</p>
        <p class="summary-year">за {{ currentYear }}</p>
      </div>
      <div class="chart">
        <BarChartComponent :data="data.summary.byMounths" :range="[0, 12]" />
      </div>
      <div class="paginator">
        <button class="paginator-year" @click="handlePrevYear">{{ prevYear }}</button>
        <span class="paginator-previous"><ChevronIcon /></span>
        <button class="paginator-year active">{{ selectedYear }}</button>
        <span class="paginator-next"><ChevronIcon style="transform: rotate(180deg)"/></span>
        <button class="paginator-year" @click="handleNextYear">{{ nextYear }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  max-width: 80%; /* Максимальная ширина */
  max-height: 80%; /* Максимальная высота */
  overflow-y: auto; /* Добавляем скролл, если содержимое не помещается */
  background-color: white; /* Цвет фона */
  border-radius: 10px; /* Закругленные углы */
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Тень */
}

.card{
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 36px;
  flex: 1 0 25%;
}

.card-full {
  flex: 1 0 100%;
}

.minimize {
  transform: rotate(180deg);
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

.active {
  background-color: #ffe000;
  cursor: auto;
}

.paginator-previous, .paginator-next {
  display: flex;
  justify-content: center;
}
</style>
