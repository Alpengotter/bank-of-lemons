<template>
  <div class="employer">
    <div class="info">
      <p class="primary-text">{{ user.fullname }}</p>
      <p class="secondary-text">{{ user.email }}</p>
    </div>

    <div class="department">
      <p class="secondary-text">{{ user.department }}</p>
    </div>

    <div class="wallet">
      <div class="wallet-lemons">
        <p class="wallet-text">{{ user.lemons }}</p>
        <!-- <IconLemon /> -->
      </div>

      <div class="divider" />

      <div class="wallet-diamonds">
        <p class="wallet-text">{{ user.diamonds }}</p>
        <!-- <IconDiamond /> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@/types/user';


defineProps<{
  user: User
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
  border: 1px solid var(--color-border);
  background-color: var(--vt-c-white);
  border-radius: 24px;
  margin-bottom: 10px;
}

.info {
  display: flex;
  flex-direction: column;
  width: 300px;
}

.department {
  width: 300px;
}

.wallet {
  display: flex;
  flex-direction: row;
}

.wallet-lemons,
.wallet-diamonds {
  display: flex;
  align-items: center;
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
