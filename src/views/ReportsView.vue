<script setup lang="ts">
import ReportItem from '@/components/reports/ReportItem.vue'
import { makeRequest } from '@/utils/makeRequest'

const downloadFile = async (url: string, filename: string, year?: number) => {
  try {
    const fileBlob = await makeRequest<Blob>(year ? `${url}?year=${year}` : url, 'get', undefined, 'blob');
    const urlObject = window.URL.createObjectURL(new Blob([fileBlob]));
    const link = document.createElement('a');
    link.href = urlObject;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();

    window.URL.revokeObjectURL(urlObject);
  } catch (error) {
    console.log(error);
  }
}

const downloadEmployeeResources = () => downloadFile('reports/employee-resources', 'Отчет по количеству лимонов и алмазов в разрезе по сотрудникам.xlsx');

const downloadOrders = (year?: number) => downloadFile('reports/orders', 'Отчет по обработанным заявкам по месяцам за выбранный год.xlsx', year);

const downloadResourceTransactions = (year?: number) => downloadFile('reports/resource-transactions', 'Отчет по количеству потраченных/начисленных лимонов/алмазов по месяцам за выбранный год.xlsx', year);
</script>

<template>
  <header>
    <div class="title-container">
      <h1 class="title">Отчеты</h1>
    </div>
  </header>
  <main>
    <ReportItem title="Отчет по количеству лимонов и алмазов в разрезе по сотрудникам" :can-select-year="false" :on-download="downloadEmployeeResources"/>
    <ReportItem title="Отчет по обработанным заявкам по месяцам за выбранный год" :can-select-year="true" :on-download="downloadOrders" />
    <ReportItem title="Отчет по количеству потраченных/начисленных лимонов/алмазов по месяцам за выбранный год" :can-select-year="true" :on-download="downloadResourceTransactions" />
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
  flex-direction: column;
  gap: 8px;
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
