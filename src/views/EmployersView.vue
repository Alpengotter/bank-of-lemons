<template>
  <div class="employers-view">
    <h1 class="title">Сотрудники</h1>
    <div class="employers-list">
      <EmployerCard v-for="user in userStore.users" :key="user.id" :user="user" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import EmployerCard from '../components/EmployerCard.vue';
import { type User } from '../types/user';
import { MOCK_USERS } from '@/mockups/users';
import { useUserStore } from '@/stores/userStores';

const userStore = useUserStore()

const users = ref<User[]>([])

onMounted(async () => {
  await userStore.fetchUsers()
});
</script>

<style scoped>
.title {
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 29px;

  margin-bottom: 27px;

  color: var(--color-text);
}
</style>
