<template>
  <div class="employer glass">
    <div class="info-container">
      <input type="checkbox" v-if="selectMode">
      <div class="info">
        <p class="primary-text">{{ user.lastName }} {{ user.firstName }}</p>
        <p class="secondary-text">{{ user.email }}</p>
      </div>
    </div>

    <div class="department">
      <p class="secondary-text">{{ user.jobTitle }}</p>
    </div>

    <div class="wallet" @click="showUserInfo(user)">
      <div class="wallet-lemons">
        <p class="wallet-text">{{ user.lemons }} 🍋</p>

      </div>

      <div class="divider" />

      <div class="wallet-diamonds">
        <p class="wallet-text">{{ user.diamonds }} 💎</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@/types/user';


defineProps<{
  user: User;
  selectMode: Boolean;
  showUserInfo: (user: User) => void;
}>()
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

.employer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 30px;
  border-radius: 24px;
  margin-bottom: 10px;
}

.info-container {
  display: flex;
  gap: 18px;
}

.info {
  display: flex;
  flex-direction: column;
  width: 250px;
}

.department {
  width: 300px;
}

.wallet {
  display: flex;
  flex-direction: row;
  padding: 6px 12px;
  transition: .2s;
  cursor: pointer;
}

.wallet:hover {
  background-color: #ffffff80;
  padding: 6px 12px;
  border-radius: 99px;
  transition: .2s;
}

.wallet-lemons,
.wallet-diamonds {
  display: flex;
  align-items: center;
  gap: 4px;
}

.wallet-text {
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 22px;

  color: var(--color-text);
}

.divider {
  width: 1px;
  background-color: var(--vt-c-divider-light-1);
  margin-right: 10px;
  margin-left: 10px;
}
</style>
