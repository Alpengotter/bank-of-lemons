<script setup lang="ts">
//@ts-ignore
import DownloadIcon from '@/assets/icons/download.svg?component';
import { ref } from 'vue'

const currentYear = new Date().getFullYear();
const availableYears = [currentYear, new Date().getFullYear() - 1, new Date().getFullYear() - 2];

const selectedYear = ref(currentYear)

const props = defineProps<{
  title: string,
  canSelectYear: boolean,
  onDownload: (value?: number) => void,
}>();
</script>

<template>
  <div class="report-item">
    <div class="report-item__content glass">
      <div class="report-item__info">
        <div class="excel-icon">
          excel
        </div>
        <p class="title">
          {{ title }}
        </p>
      </div>
      <div v-if="canSelectYear" class="year-picker-container">
        <select name="years" id="year-select" class="year-picker" v-model="selectedYear">
          <option v-for="year in availableYears" :value="year">{{ year }}</option>
        </select>
      </div>
    </div>
    <button class="report-item__download glass" @click="() => onDownload(selectedYear)">
      <DownloadIcon />
    </button>
  </div>
</template>

<style scoped>
.report-item {
  display: flex;
  flex-direction: row;
  width: 1140px;

  gap: 8px;
}

.report-item__content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: 99px;

  padding: 0 16px;
  height: 50px;

  flex: 1;
}

.title {
  font-size: 18px;
}

.report-item__download {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;

  cursor: pointer;
}

.year-picker {
  display: flex;
  border: none;
  background-color: #fff;
  font-size: 14px;
  padding: 8px 22px;
  border-radius: 99px;
}


.report-item__info {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.excel-icon {
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #3b9864;
  color: #fff;
  padding: 4px 16px;
  border-radius: 99px;

  font-weight: 700;
}
</style>
