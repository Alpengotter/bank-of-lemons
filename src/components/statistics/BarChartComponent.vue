<script setup lang="ts">
// @ts-nocheck
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
  range: number[];
}>()


// Данные для графика
const chartData = {
  labels: ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сент', 'Окт', 'Нояб', 'Дек'].splice(props.range[0], props.range[1]),
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

<template>
  <div class="bar-chart-container" :class="{
    'full': props.range[1] > 6
  }">
    <Bar id="my-bar-chart" :data="chartData" :options="chartOptions"/>
  </div>
</template>

<style scoped>
.bar-chart-container {
  max-width: 330px;
}

.full {
  max-width: 600px;
  width: 100%;
}
</style>
