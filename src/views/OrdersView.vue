<template>
  <header>
    <div class="title-container">
      <h1 class="title">Заказы</h1>
    </div>
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
        :employer="getEmployerByEmail(order.email)" :toggleDeclineModal="() => showDeclineModal(order)" />
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

  <div v-if="isOpenDeclineModal" class="modal-overlay" @click="closeDeclineModal">
    <div class="modal-content glass card card-full" @click.stop>
      <div class="modal-header">
        <div class="modal-title">Отклонение заказа</div>
        <button @click="closeDeclineModal" class="close-btn" aria-label="Close modal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="black" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" />
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <div class="description">
          <p>Вы можете уведомить на почту сотрудника о том, что его заказ отменен</p>
          <div class="checkbox-wrapper">
            <label class="checkbox-container">
              <input type="checkbox" v-model="isNotify" />
              <span class="checkbox-checkmark"></span>
            </label>
            <p>Уведомить об отклонении заказа</p>
          </div>
        </div>
        <div class="actions">
          <div></div>
          <Button appearance="primary" @click="declineOrder">
            <span style="padding: 0 16px">Отклонить заказ</span>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useOrderStores } from '@/stores/orderStores';
import Button from '../components/Button.vue';
import OrderItem from '../components/orders/OrderItem.vue';
import { useUserStore } from '@/stores/userStores';
import Preloader from '@/components/Preloader.vue';
import HistoryModal from '@/components/modals/HistoryModal.vue';
import ModalView from '@/components/ModalView.vue';
import type { Order } from '@/types/order'

const ordersStore = useOrderStores();
const userStore = useUserStore();
const isHistoryModalOpen = ref(false);
const isOpenDeclineModal = ref(false);
const selectedOrder = ref<Order | null>(null);
const isNotify = ref(false);

const toggleHistoryModal = () => {
  isHistoryModalOpen.value = !isHistoryModalOpen.value;
};

const showDeclineModal = (order: Order) => {
  console.log(order);
  isOpenDeclineModal.value = true;
  if (order) {
    selectedOrder.value = order;
  } else {
    selectedOrder.value = null;
  }
}

const closeDeclineModal = () => {
  isOpenDeclineModal.value = false;
}

const declineOrder = async () => {
  try {
    if (selectedOrder.value !== null) {
      await ordersStore.changeStatus(selectedOrder.value.id, 'REJECTED');
    }
  } catch (error) {
    console.error(error);
  } finally {
    isOpenDeclineModal.value = false;
    if (selectedOrder.value?.id && isNotify.value) {
      sendNotification(selectedOrder.value.email)
    }
  }
};

const getEmployerByEmail = (email: string) => {
  return userStore.users.find((user) => user.email === email);
};

const sendNotification = (
  email: string,
) => {
  const subject = 'Магазин мерча Зарплаты.ру'
  const body = `Привет!%0D%0AМы отклонили твой заказ, потому что `
  window.location.href = `
            mailto:${email}?subject=${subject}&body=${body}
        `
}

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

/* Подложка модального окна */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Полупрозрачный фон */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
/* Содержимое модального окна */
.modal-content {
  max-width: 80%; /* Максимальная ширина */
  max-height: 80%; /* Максимальная высота */
  overflow-y: auto; /* Добавляем скролл, если содержимое не помещается */
  background-color: white; /* Цвет фона */
  border-radius: 10px; /* Закругленные углы */
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Тень */
}

.modal-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 16px;
}

.modal-title {
  font-size: 28px;
}

.modal-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
}

.checkbox-wrapper {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

/* custom input */

/* The container */
.checkbox-container {
  display: flex;
  position: relative;
  padding-left: 25px;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  width: 25px;
  height: 25px;
}

/* Hide the browser's default checkbox */
.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkbox-checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  border: 1px solid var(--color-text);
  border-radius: 99px;
  transition: .2s;
}

/* On mouse-over, add a grey background color */
.checkbox-container:hover input~.checkmark {
  background-color: #ffe000;
  transition: .2s;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkbox-checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.checkbox-container input:checked~.checkbox-checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.checkbox-container .checkbox-checkmark:after {
  left: 10px;
  top: 6px;
  width: 5px;
  height: 10px;
  border: solid black;
  border-width: 0 2px 2px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

/* Кнопка закрытия */
.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.actions {
  display: flex;
  justify-content: space-between;
}

.description {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
