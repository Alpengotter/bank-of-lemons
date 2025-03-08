<script setup lang="ts">
import Card from '@/components/statistics/Card.vue'
import type { StatisticItem } from '@/types/statistic-item'
import { useStatisticsStores } from '@/stores/statisticsStores'
import { onMounted } from 'vue'
import { StatisticsTypes } from '@/constants/statistics'
import type { StatisticsSummaryResponse } from '@/types/statistic'

const statisticsStore = useStatisticsStores();
const currentYear = new Date().getFullYear();
let dataSet;

onMounted(async () => {
  try {
    const statisticTypes = [
      StatisticsTypes.NEW_ORDER,
      StatisticsTypes.ACCEPT_ORDER,
      StatisticsTypes.DECLINE_ORDER,
      StatisticsTypes.REWARD,
      StatisticsTypes.DEACTIVATE,
      StatisticsTypes.NEW_EMPLOYER,
    ];

    // Выполняем все запросы параллельно
    await Promise.all(
      statisticTypes.map(async (type) => {
        try {
          await statisticsStore.fetchStatisticsSummary(type, currentYear);
        } catch (error) {
          console.error(`Ошибка при загрузке данных для типа ${type}:`, error);
        }
      })
    );

    // Создаем dataSet после завершения всех запросов
    dataSet = createDataSet(statisticsStore.statisticsSummary);
  } catch (error) {
    console.error("Произошла ошибка при загрузке статистики:", error);
  }
});

// Функция для создания dataSet
function createDataSet(summaryData: StatisticsSummaryResponse[]) {
  return summaryData?.map((item, index) => ({
    id: index,
    title: item.type,
    summary: {
      total: item.total,
      byMonths: item.totalMonth,
    },
  }));
}

const data: StatisticItem[] = [
  {
    id: 1,
    title: 'Обработано заявок',
    summary: {
      total: 66,
      byMounths: [16, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  },
  {
    id: 2,
    title: 'Начислено лимонов',
    summary: {
      total: 16010,
      byMounths: [5768, 10242, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  },
  {
    id: 3,
    title: 'Потрачено лимонов',
    summary: {
      total: 31624,
      byMounths: [17532, 14092, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  },
  {
    id: 4,
    title: 'Начислено алмазов',
    summary: {
      total: 2,
      byMounths: [0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  },
  {
    id: 5,
    title: 'Потрачено алмазов',
    summary: {
      total: 0,
      byMounths: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  },
  {
    id: 6,
    title: 'Новых сотрудников',
    summary: {
      total: 5,
      byMounths: [0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  },
]

const useStatistics = useStatisticsStores();

onMounted(() => {
  useStatistics.fetchStatistics()
})

const startMounth = new Date().getMonth() >= 6 ? 6 : 0;
const endMounth = new Date().getMonth() <= 6 ? 6 : 11;

</script>

<template>
  <header>
    <div class="title-container">
      <h1 class="title">Статистика</h1>
    </div>
  </header>
  <main>
    <Card v-for="item in data" :key="item.id" :data="item" :range="[startMounth, endMounth]" />
  </main>
</template>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  margin-bottom: 40px;
}

main {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 13px;
}

.title {
  color: var(--color-text);
  font-style: normal;
  font-weight: 300;
  font-size: 48px;
  line-height: 58px;
}

.title-container {
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
}
</style>
