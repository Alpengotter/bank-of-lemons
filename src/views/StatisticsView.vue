<script setup lang="ts">
import Card from '@/components/statistics/Card.vue'
import { useStatisticsStores } from '@/stores/statisticsStores'
import { onMounted, ref } from 'vue'
import StatisticModal from '@/components/statistics/StatisticModal.vue'

const statisticsStore = useStatisticsStores();
const currentYear = new Date().getFullYear();
const isOpenFullPage = ref(false);
const selectedType = ref<string>('');

const openFullpageModal = (type: string) => {
  console.log(type);
  selectedType.value = type;
  toggleFullPageCard()
};

const toggleFullPageCard = () => {
  isOpenFullPage.value = !isOpenFullPage.value
}

onMounted(async () => {
  try {
    await statisticsStore.fetchStatisticsSummary([], currentYear)
  } catch (error) {
    console.error(error)
  }
});

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
    <Card v-for="item in statisticsStore.summary" :key="item.total" :data="item" :range="[startMounth, endMounth]" @open-modal="openFullpageModal(item.type)"/>
    <StatisticModal :type="selectedType" @close-modal="toggleFullPageCard" v-if="isOpenFullPage && selectedType"/>
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
