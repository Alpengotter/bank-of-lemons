<template>
  <div class="employers-view">
    <div class="header">
      <div class="title-container">
        <h1 class="title">Сотрудники</h1>
      </div>
      <div class="statistic-container">
        <StatisticItem title="Сотрудников" count="150" icon="employer" />
        <StatisticItem title="Алмазов" count="27" icon="diamonds" />
        <StatisticItem title="Лимонов" count="216350" icon="lemons" />
      </div>
    </div>
    <div class="actions-wrapper">
      <!-- search field -->
      <Search placeholder="Поиск по сотрудникам" />
      <div class="actions">
        <!-- action buttons -->
        <Button appearance="secondary">Выбрать</Button>
        <Button appearance="secondary">Выбрать все</Button>
        <div>
          <Button appearance="secondary" @click="toggleModal">+</Button>
        </div>
      </div>
    </div>
    <div class="employers-list" v-if="userStore.users.length">
      <EmployerCard v-for="user in userStore.users" :key="user.id" :user="user" @click="toggleModal" />
    </div>
    <div class="empty" v-else>
      <span>
        Список сотрудников не загружен.
      </span>
      <span>Обратитесь в поддержку.</span>
    </div>

    <ModalView v-if="isModalOpen" @close-modal="toggleModal">
      <template #content>
        <h2>Пример модального окна</h2>
        <p>Это пример модального окна, где контент передается через слот.</p>
      </template>
    </ModalView>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import EmployerCard from '../components/EmployerCard.vue';
import { useUserStore } from '@/stores/userStores';
import Button from '@/components/Button.vue';
import Search from '@/components/Search.vue';
import ModalView from '@/components/ModalView.vue';
import StatisticItem from '@/components/StatisticItem.vue';

const userStore = useUserStore()

onMounted(async () => {
  await userStore.fetchUsers()
});

// Состояние модального окна
const isModalOpen = ref(false);

// Метод для переключения состояния модального окна
const toggleModal = () => {
  isModalOpen.value = !isModalOpen.value;
};

</script>

<style lang="scss" scoped>
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
