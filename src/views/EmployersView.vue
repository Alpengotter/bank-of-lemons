<template>
  <div class="employers-view">
    <div class="header">
      <div class="title-container">
        <h1 class="title">Сотрудники</h1>
      </div>
      <div class="statistic-container">
        <StatisticItem title="Сотрудников" :count="userStore.employerStatistic?.users || 0" icon="employer" />
        <StatisticItem title="Алмазов" :count="userStore.employerStatistic?.diamonds || 0" icon="diamonds" />
        <StatisticItem title="Лимонов" :count="userStore.employerStatistic?.lemons || 0" icon="lemons" />
      </div>
    </div>
    <div class="actions-wrapper">
      <!-- search field -->
      <Search placeholder="Поиск" v-model:model-value="searchQuery" />
      <div class="actions">
        <!-- action buttons -->
        <Button appearance="secondary">Выбрать</Button>
        <Button appearance="secondary">Выбрать все</Button>
        <div>
          <Button appearance="secondary" @click="toggleModal">+</Button>
        </div>
      </div>
    </div>
    <div class="employers-list" v-if="filteredEmployees.length">
      <EmployerCard v-for="employee in filteredEmployees" :key="employee.id" :user="employee"
        @click="selectEmployer(employee)" />
    </div>
    <div class="loading-spinner" v-else-if="userStore.loading">
      Загрузка
    </div>
    <div class="empty" v-else>
      <span>
        Список сотрудников не загружен.
      </span>
      <span>Обратитесь в поддержку.</span>
    </div>

    <ModalView :show="isModalOpen" @close-modal="toggleModal" :user="selectedEmployer">
      <template #content>
        <EmployerModalContent :employer="selectedEmployer" />
      </template>
    </ModalView>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import EmployerCard from '../components/EmployerCard.vue';
import { useUserStore } from '@/stores/userStores';
import Button from '@/components/Button.vue';
import Search from '@/components/Search.vue';
import ModalView from '@/components/ModalView.vue';
import StatisticItem from '@/components/StatisticItem.vue';
import EmployerModalContent from '@/components/EmployerModalContent.vue';
import type { User } from '@/types/user';

const userStore = useUserStore();
const searchQuery = ref("");
const isModalOpen = ref(false);
let selectedEmployer = ref<User | undefined>(undefined);;

onMounted(async () => {
  await userStore.fetchUsers();
  await userStore.employersStat();
});

const selectEmployer = (user: User): void => {
  selectedEmployer.value = user;
  toggleModal();
}

const toggleModal = () => {
  isModalOpen.value = !isModalOpen.value;
};

const filteredEmployees = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();

  if (!query) return userStore.users;

  return userStore.users.filter((employee) => {
    return (
      employee.firstName?.toLowerCase().includes(query) ||
      employee.lastName?.toLowerCase().includes(query) ||
      employee.email?.toLowerCase().includes(query) ||
      employee.jobTitle?.toLowerCase().includes(query)
    );
  });
});
</script>

<style scoped>
.header {
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
  align-items: center
}

.actions-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 27px;
}

.actions {
  display: flex;
  flex-direction: row;
  gap: 10px;
}

.employer-add {
  width: 32px;
  height: 32px;
}

.statistic-container {
  display: flex;
  flex-direction: row;
  gap: 40px;
  align-items: center;
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
