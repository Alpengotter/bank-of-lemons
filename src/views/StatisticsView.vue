<script setup lang="ts">
import Card from '@/components/statistics/Card.vue'
import type { StatisticItem } from '@/types/statistic-item'

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
</script>

<template>
  <header>
    <div class="title-container">
      <h1 class="title">Статистика</h1>
    </div>
  </header>
  <main>
    <Card v-for="item in data" :key="item.id" :data="item"/>
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
