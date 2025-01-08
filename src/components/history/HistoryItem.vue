<template>
  <div class="history-item">
    <div class="user-info">
      <p class="user-fullname primary-text">{{ employer.lastName }} {{ employer.firstName }}</p>
      <p class="user-email secondary-text">{{ employer.email }}</p>
    </div>
    <p class="history-comment secondary-text">{{ historyItem.comment }}</p>
    <p class="history-sum primary-text">{{ historyItem.value }} {{ currencyIcon }}</p>
  </div>
</template>
<script setup lang="ts">
import type { HistoryItem } from '@/types/historyItem';
import type { User } from '@/types/user';
import { onMounted, ref } from 'vue';

const currencyIcon = ref<string>('🍋')

onMounted(() => {
  currencyIcon.value = props.historyItem.currency === 'lemons' ? '🍋' : '💎'
})

const props = defineProps<{
  employer: User;
  historyItem: HistoryItem;
}>();
</script>
<style scoped>
.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}
</style>
