<script setup lang="ts">
// @ts-ignore
import ArrowIcon from '@/assets/icons/arrow.svg?component'
import BarChartComponent from '@/components/statistics/BarChartComponent.vue'
import type { StatisticsSummaryResponse } from '@/types/statistic'
import { useStatisticsStores } from '@/stores/statisticsStores'
import { getStatisticTranslation } from '@/constants/statistics'

const currentYear = new Date().getFullYear();

defineProps<{
  data: StatisticsSummaryResponse;
  range: number[];
}>()

const emit = defineEmits<{
  (e: 'open-modal'): void
}>();

const emitClose = () => {
  emit('open-modal');
};
</script>

<template>
  <div class="glass card">
    <div>
      <div class="header">
        <div class="title">{{ getStatisticTranslation(data.type) }}</div>
        <div class="btn-show-more" @click="emitClose">
          <ArrowIcon />
        </div>
      </div>
      <div class="summary">
        <p class="summary-total">{{ data.total }}</p>
        <p class="summary-year">за {{ currentYear }}</p>
      </div>
      <div class="chart">
        <BarChartComponent :data="data.totalMounth" :range="range" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.card{
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

.preloader {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
