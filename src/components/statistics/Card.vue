<script setup lang="ts">
import type { StatisticItem } from '@/types/statistic-item'
// @ts-ignore
import ArrowIcon from '@/assets/icons/arrow.svg?component'
import Chart from '@/components/statistics/Chart.vue'

const currentYear = new Date().getFullYear();

defineProps<{
  data: StatisticItem;
}>()
</script>

<template>
  <div class="glass card">
    <div class="header">
      <div class="title">{{ data.title }}</div>
      <div class="btn-show-more">
        <ArrowIcon />
      </div>
    </div>
    <div class="summary">
      <p class="summary-total">{{ data.summary.total }}</p>
      <p class="summary-year">за {{ currentYear }}</p>
    </div>
    <div class="chart">
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
</style>
