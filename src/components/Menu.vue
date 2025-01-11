<template>
  <div class="menu glass">
    <nav>
      <RouterLink to="/" class="nav-item" active-class="active">Заказы</RouterLink>
      <RouterLink to="/employers" class="nav-item" active-class="active">Сотрудники</RouterLink>
      <RouterLink to="/statistics" class="nav-item" active-class="active" v-if="false">Статистика</RouterLink>
      <RouterLink to="/reports" class="nav-item" active-class="active" v-if="false">Отчеты</RouterLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

</script>


<style scoped>
.menu {
  display: flex;
  /* background-color: var(---color-background-transparent); */
  border-radius: 999px;
  padding: 6px;
}

nav {
  display: flex;
}

.nav-item {
  padding: 8px 16px;
  color: var(--color-text);
  border-radius: 999px;
  text-decoration: none;
  font-size: 16px;
  font-weight: 600;
}

.active {
  background-color: var(--vt-c-primary);
}
</style>
