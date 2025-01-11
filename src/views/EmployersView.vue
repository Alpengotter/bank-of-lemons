<template>
  <div class="employers-view">
    <div class="header">
      <div class="title-container">
        <h1 class="title">Сотрудники</h1>
      </div>
      <div class="statistic-container">
        <StatisticItem title="Сотрудников" :count="userStore.employerStatistic?.users" icon="employer" />
        <StatisticItem title="Алмазов" :count="userStore.employerStatistic?.diamonds" icon="diamonds" />
        <StatisticItem title="Лимонов" :count="userStore.employerStatistic?.lemons" icon="lemons" />
      </div>
    </div>
    <div class="actions-wrapper">
      <!-- search field -->
      <Search placeholder="Поиск" v-model:model-value="searchQuery" />
      <div class="actions">
        <!-- запускает выбор сотрудников -->
        <Button appearance="secondary" @click="toggleSelectMode" v-if="!isSelectMode">Выбрать</Button>
        <Button appearance="secondary" @click="toggleSelectMode(); clearSelection();" v-else>Отмена</Button>

        <Button appearance="secondary" v-if="false">Выбрать все</Button>

        <Button appearance="secondary" @click="toggleAddNewModal">+</Button>
      </div>
    </div>

    <!-- selected employers list -->
    <div class="employers-list selected" v-if="selectedEmployersStore.selectedItems.length">
      <div class="accordion" :style="{ height: `${selectedEmployersStore.selectedItems.length * 15 + 72}px` }">
        <EmployerCard class="accordion-item" v-for="(employee, index) in selectedEmployersStore.selectedItems.sort()"
          :key="employee.id + 1000" :user="employee" :show-user-info="selectEmployer" :selectMode="true"
          :style="{ top: `${index * 15}px` }" />
      </div>
      <div><Button appearance="secondary" @click="toggleMultipleModal">Начислить выбранным</Button> </div>
    </div>

    <div class="employers-list" v-if="paginatedEmployees.length">
      <EmployerCard v-for="employee in paginatedEmployees" :key="employee.id" :user="employee"
        :show-user-info="selectEmployer" :selectMode="isSelectMode" />
      <div v-if="hasMore" v-lazy-load="loadMore">
        <div class="loading-spinner">
          <Preloader :width="50" />
        </div>
      </div>
    </div>

    <div class="loading-spinner" v-else-if="userStore.loading">
      <Preloader :width="50" />
    </div>
    <div class="empty" v-else>
      <span>
        Список сотрудников не загружен.
      </span>
      <span>Обратитесь в поддержку.</span>
    </div>

    <!-- employer info modal -->
    <ModalView :show="isModalOpen" @close-modal="toggleModal" :user="selectedEmployer">
      <template #content>
        <EmployerModalContent :employerId="selectedEmployer!.id" :updateWallet="userStore.updateWallet"
          :close="toggleModal" />
      </template>
    </ModalView>

    <!-- new employer -->
    <ModalView :show="isModalAddNewOpen" @close-modal="toggleAddNewModal">
      <template #content>
        <NewEmployerContent :close="toggleAddNewModal" />
      </template>
    </ModalView>

    <!-- multiple accrual employers -->
    <ModalView :show="isModalMultipleOpen" @close-modal="toggleMultipleModal">
      <template #content>
        <EmployerMultipleAccrualModal :close="handleCloseMultipleAccrual" />
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
import NewEmployerContent from '@/components/NewEmployerContent.vue';
import Preloader from '@/components/Preloader.vue';

import type { User } from '@/types/user';
import { useSelectedUsersStore } from '@/stores/selectedUsersStore';
import EmployerMultipleAccrualModal from '@/components/EmployerMultipleAccrualModal.vue';

const userStore = useUserStore();
const selectedEmployersStore = useSelectedUsersStore();

const searchQuery = ref("");

const isModalOpen = ref(false);
const isModalAddNewOpen = ref(false);
const isModalMultipleOpen = ref(false);

const isSelectMode = ref(false);
let selectedEmployer = ref<User | undefined>(undefined);

const currentPage = ref(1);
const itemsPerPage = 25;
const hasMore = ref(true);

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

const toggleAddNewModal = () => {
  isModalAddNewOpen.value = !isModalAddNewOpen.value;
}

const toggleMultipleModal = () => {
  isModalMultipleOpen.value = !isModalMultipleOpen.value;
}

const handleCloseMultipleAccrual = () => {
  isModalMultipleOpen.value = !isModalMultipleOpen.value;
  toggleSelectMode();
  clearSelection();
}

const clearSelection = () => {
  selectedEmployersStore.selectedItems = [];
}

const paginatedEmployees = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredEmployees.value.slice(0, end);
});

const loadMore = () => {
  if (currentPage.value * itemsPerPage < filteredEmployees.value.length) {
    currentPage.value++;
  }
  hasMore.value = (currentPage.value * itemsPerPage < filteredEmployees.value.length);
}

const filteredEmployees = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();

  if (!query) return userStore.users.filter(employee => !selectedEmployersStore.selectedItems.includes(employee));

  return userStore.users.filter((employee) => {
    const matchesQuery =
      employee.firstName?.toLowerCase().includes(query) ||
      employee.lastName?.toLowerCase().includes(query) ||
      employee.email?.toLowerCase().includes(query) ||
      employee.jobTitle?.toLowerCase().includes(query);

    const isSelected = selectedEmployersStore.selectedItems.includes(employee);

    return matchesQuery && !isSelected;
  });
});

const toggleSelectMode = () => {
  isSelectMode.value = !isSelectMode.value;
}

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

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
}

.accordion {
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
}

.accordion-item {
  position: absolute;
  width: 100%;
}

.selected {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.accordion-item:hover {
  z-index: 999;
  transition: .2s;
}
</style>
