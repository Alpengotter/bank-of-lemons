
<template>
  <!-- main -->
  <div v-if="employer" class="order-item glass">
    <!-- employer info -->
    <div class="employer-info">
      <!-- employer -->
      <div class="employer">
        <!-- name -->
        <p class="fullname primary-text">{{ employer.lastName }}</p>
        <p class="fullname primary-text">{{ employer.firstName }}</p>
        <!-- email -->
        <p class="email secondary-text">{{ employer.email }}</p>
      </div>
      <!-- order date -->
      <p class="order-date secondary-text">{{ formatDate(order.date) }}</p>
    </div>
    <!-- order info -->
    <div v-if="preparedOrderItems" class="products-list">
      <div class="product" v-for="preparedOrderItem in preparedOrderItems" :key="preparedOrderItem.title">
        <p class="secondary-text product-title">{{ preparedOrderItem.title }}</p>
        <p class="secondary-text product-count">{{ preparedOrderItem.count }}</p>
        <p class="secondary-text product-total">{{ preparedOrderItem.total }}&nbsp;🍋</p>
      </div>
    </div>
    <!-- order summary -->
    <div class="summary">
      <div class="summary-item">
        <p class="summary-text">Итого</p>
        <p class="summary-text" style="font-weight: normal;">{{ order.total }} 🍋</p>
      </div>
      <div class="summary-item">
        <p class="summary-text">У сотрудника</p>
        <p class="summary-text" style="font-weight: normal;">{{ employer.lemons }} 🍋</p>
      </div>
    </div>
    <!-- actions -->
    <div class="actions">
      <div @click="acceptOrder">
        <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd"
                d="M16.5 28C18.0759 28 19.6363 27.6896 21.0922 27.0866C22.5481 26.4835 23.871 25.5996 24.9853 24.4853C26.0996 23.371 26.9835 22.0481 27.5866 20.5922C28.1896 19.1363 28.5 17.5759 28.5 16C28.5 14.4241 28.1896 12.8637 27.5866 11.4078C26.9835 9.95189 26.0996 8.62902 24.9853 7.51472C23.871 6.40042 22.5481 5.5165 21.0922 4.91345C19.6363 4.31039 18.0759 4 16.5 4C13.3174 4 10.2652 5.26428 8.01472 7.51472C5.76428 9.76515 4.5 12.8174 4.5 16C4.5 19.1826 5.76428 22.2348 8.01472 24.4853C10.2652 26.7357 13.3174 28 16.5 28ZM16.1907 20.8533L22.8573 12.8533L20.8093 11.1467L15.076 18.0253L12.1093 15.0573L10.224 16.9427L14.224 20.9427L15.256 21.9747L16.1907 20.8533Z"
                fill="#0EAE09" />
        </svg>
      </div>
      <div @click="toggleDeclineModal">
        <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16.5 4C9.81429 4 4.5 9.31429 4.5 16C4.5 22.6857 9.81429 28 16.5 28C23.1857 28 28.5 22.6857 28.5 16C28.5 9.31429 23.1857 4 16.5 4ZM21.1286 22L16.5 17.3714L11.8714 22L10.5 20.6286L15.1286 16L10.5 11.3714L11.8714 10L16.5 14.6286L21.1286 10L22.5 11.3714L17.8714 16L22.5 20.6286L21.1286 22Z"
            fill="#C51010" />
        </svg>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '@/types/order';
import type { User } from '@/types/user';
import type { Product } from '@/types/product';
import { onMounted, ref } from 'vue';
import { useOrderStores } from '@/stores/orderStores';
import { useUserStore } from '@/stores/userStores';

const pattern = /(?<title>.+?)\s–\s(?<count>\d+x\d+)=\s?(?<total>\d+)/;
const preparedOrderItems = ref<Product[] | null>(null);
const ordersStore = useOrderStores();
const userStore = useUserStore();

onMounted(() => {
  preparedOrderItems.value = prepareOrderItem();
});


const prepareOrderItem = () => {
  const items = props.order.items.replace(/&quot;/g, '').split(';');
  const result: Product[] = [];

  items.forEach(item => {
    const match = item.match(pattern);
    if (match && match.groups) {
      const product: Product = {
        title: match.groups.title,
        count: match.groups.count,
        total: parseInt(match.groups.total, 10),
      };
      result.push(product);
    }
  });

  return result;
}

const acceptOrder = async () => {
  console.log('acceptOrder');
  try {
    await ordersStore.changeStatus(props.order.id, 'ACCEPTED');
    await updateEmployerWallet();
  } catch (error) {
    console.error(error);
  }
};

const updateEmployerWallet = async () => {
  if (!props.employer) return;
  try {
    await userStore.updateWallet(props.employer?.id, {
      lemons: props.employer.lemons - parseInt(props.order.total, 10),
      diamonds: props.employer.diamonds,
      comment: 'Подтверждение заказа'
    });
  } catch (error) {
    console.error('Error updating employer wallet:', error);
  }
};

const formatDate = (isoDate: string): string => {
  const [datePart] = isoDate.split('T');
  const [yearStr, monthStr, dayStr] = datePart.split('-');

  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  const date = new Date(Date.UTC(year, month - 1, day));

  const pad = (n: number): string => n < 10 ? `0${n}` : `${n}`;

  return `${pad(date.getUTCDate())}.${pad(date.getUTCMonth() + 1)}.${date.getUTCFullYear()}`;
}


const props = defineProps<{
  order: Order;
  employer: User | undefined;
  toggleDeclineModal: () => void;
}>();
</script>

<style scoped>
.fullname:not(:first-child) {
  margin-bottom: 8px;
}

.order-item {
  display: flex;
  flex-direction: column;
  padding: 16px;
  border-radius: 16px;
  justify-content: space-between;
}

.employer-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.employer {
  display: flex;
  flex-direction: column;
}

.products-list {
  margin-bottom: 24px;
  flex: 1;
}

.product {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  gap: 24px;
}

.product:not(:last-child) {
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 8px;
}

.product-title {
  width: 120px;
}

.summary {
  display: flex;
  flex-direction: column;

  margin-bottom: 24px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
}

.summary-text {
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;

  color: #000000;
}

.actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.actions div {
  cursor: pointer;
  width: 32px;
  height: 32px;
}
</style>
