<template>
  <div class="employers-view">
    <div class="header">
      <div class="title-container">
        <h1 class="title">Сотрудники</h1>
        <!-- add employer button -->
        <Button appearance="secondary" class="employer-add">+</Button>
      </div>
      <div>
        <!-- search field -->
        <Search placeholder="Поиск по сотрудникам" />
      </div>
      <div class="actions">
        <!-- action buttons -->
        <Button appearance="link">Выбрать</Button>
        <Button appearance="link">Выбрать все</Button>
      </div>
    </div>
    <div class="employers-list">
      <EmployerCard v-for="user in userStore.users" :key="user.id" :user="user" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import EmployerCard from '../components/EmployerCard.vue';
import { useUserStore } from '@/stores/userStores';
import Button from '@/components/Button.vue';
import Search from '@/components/Search.vue';

const userStore = useUserStore()

onMounted(async () => {
  await userStore.fetchUsers()
});
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  margin-bottom: 27px;
}

.title {
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 29px;

  color: var(--color-text);
}

.title-container {
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center
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
</style>
