<template>
  <div class="bar-chart-container">
    <Bar id="my-bar-chart" :data="chartData" :options="chartOptions"/>
  </div>
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  type ChartOptions
} from 'chart.js';

// Регистрация необходимых элементов Chart.js
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const currentMounth = new Date().getMonth();

const props = defineProps<{
  data: number[];
}>()

const startMounth = new Date().getMonth() >= 6 ? 6 : 0;
const endMounth = new Date().getMonth() <= 6 ? 6 : 11;

// Данные для графика
const chartData = {
  labels: ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сент', 'Окт', 'Нояб', 'Дек'].splice(startMounth, endMounth),
  datasets: [
    {
      data: props.data || [0,0,0,0,0,0],
      backgroundColor: () => {
        return chartData.labels.map((_, index) =>
          index === currentMounth ? '#FFE000' : '#5A5A5A'
        )
      },
      borderRadius: 99,
      borderSkipped: false,
      categoryPercentage: 0.3,
      minBarLength: 1,
    },
  ],
};

// Настройки графика
const chartOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    x: {
      position: 'bottom',
      title: {
        display: false
      },
      border: {
        display: false
      },
      grid: {
        display: false,
      },
    },
    y: {
      display: false,
      position: 'top',
      border: {
        display: false
      },
      grid: {
        display: false,
      },
    },
    y2: {
      position: 'top',
      border: {
        display: false
      },
      grid: {
        display: false,
      },
      ticks: {
        callback: function(value, index, ticks) {
          return chartData.datasets[0].data[index] + '';
        }
      },
    }
  }
};
</script>

<style scoped>
.bar-chart-container {
  max-width: 330px;
}
</style>
