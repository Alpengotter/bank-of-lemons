<template>
  <div class="history-item" v-if="employer">
    <div class="user-info">
      <p class="user-fullname primary-text">{{ employer.lastName }} {{ employer.firstName }}</p>
      <p class="user-email secondary-text">{{ employer.email }}</p>
    </div>
    <p class="history-comment secondary-text">{{ historyItem.comment }}</p>
    <p class="history-sum primary-text" v-if="props.historyItem.currency === 'lemons'">
      {{ historyItem.value }} <img src="@/assets/lemon.png" alt="lemon" width="18" height="18"/>
    </p>
    <p class="history-sum primary-text" v-if="props.historyItem.currency === 'diamonds'">
      {{ historyItem.value }} <img src="@/assets/gem.png" alt="lemon" width="18" height="18"/>
    </p>
  </div>
</template>
<script setup lang="ts">
import { useUserStore } from '@/stores/userStores';
import type { HistoryItem } from '@/types/historyItem';
import type { User } from '@/types/user';
import { onMounted, ref } from 'vue';

const userStore = useUserStore();
const employer = ref<User>();

onMounted(async () => {
  employer.value = props.employer
  employer.value = userStore.getUserById(props.historyItem.userId) || undefined;
})

const props = defineProps<{
  employer?: User;
  historyItem: HistoryItem;
}>();
</script>
<style scoped>
.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 10px 10px 0;
}

.history-sum {
  display: flex;
  align-items: center;
}

.history-sum img {
  margin-left: 8px;
}
</style>
