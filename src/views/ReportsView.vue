<template>
  <header>
    <div class="title-container">
      <h1 class="title">Отчеты</h1>
    </div>
  </header>
  <main>
    <ReportItem title="Отчет по количеству лимонов и алмазов в разрезе по сотрудникам" :can-select-year="false" />
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
<script setup lang="ts">
import ReportItem from '@/components/reports/ReportItem.vue'
</script>
