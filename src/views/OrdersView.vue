<template>
  <header>
    <div class="title-container">
      <h1 class="title">Заказы</h1>
    </div>
    <!-- Release 3.2.0 -->
    <!-- <div class="statistic-container">
      <StatisticItem title="Сотрудников" :count="userStore.employerStatistic?.users" icon="employer" />
      <StatisticItem title="Алмазов" :count="userStore.employerStatistic?.diamonds" icon="diamonds" />
      <StatisticItem title="Лимонов" :count="userStore.employerStatistic?.lemons" icon="lemons" />
    </div> -->
  </header>
  <main>
    <!-- History modal action -->
    <div class="actions-wrapper">
      <div class="actions">
        <!-- Show history modal -->
        <Button appearance="secondary" @click="toggleHistoryModal">
          <img style="width: 14px; height: 14px; margin-right: 8px" src="@/assets/calendar.png" alt="calendar" />
          История
        </Button>
      </div>
    </div>
    <!-- Orders List -->
    <div v-if="ordersStore.orders.length" class="orders-list">
      <OrderItem v-for="order in ordersStore.orders" :key="order.id" :order="order"
        :employer="getEmployerByEmail(order.email)" />
    </div>
    <!-- Loading state -->
    <div class="loading-spinner" v-else-if="ordersStore.loading">
      <Preloader :width="50" />
    </div>
    <div class="empty" v-else>
      <span>
        Заказов на обработку нет
      </span>
    </div>
  </main>
  <!-- employer info modal -->
  <ModalView :show="isHistoryModalOpen" @close-modal="toggleHistoryModal">
    <template #content>
      <HistoryModal />
    </template>
  </ModalView>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useOrderStores } from '../stores/orderStores';
import Button from '../components/Button.vue';
import OrderItem from '../components/orders/OrderItem.vue';
import { useUserStore } from '@/stores/userStores';
import Preloader from '@/components/Preloader.vue';
import HistoryModal from '@/components/modals/HistoryModal.vue';
import ModalView from '@/components/ModalView.vue';

const ordersStore = useOrderStores();
const userStore = useUserStore();
const isHistoryModalOpen = ref(false);

const toggleHistoryModal = () => {
  isHistoryModalOpen.value = !isHistoryModalOpen.value;
};

const getEmployerByEmail = (email: string) => {
  return userStore.users.find((user) => user.email === email);
};

onMounted(async () => {
  await ordersStore.fetchOrders();
  await userStore.fetchUsers();
});
</script>

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

.actions-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 27px;
}

.actions {
  display: flex;
  flex-direction: row;
  gap: 10px;
}

.empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  color: var(--color-text);
  font-size: 24px;
  font-weight: 300;
  text-align: center;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
}

.orders-list {
  display: grid;
  grid-template-columns: 280px 280px 280px 280px;
  gap: 6px;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
}

.empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  color: var(--color-text);
  font-size: 24px;
  font-weight: 300;
  text-align: center;
}
</style>
