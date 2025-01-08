<template>
  <div class="wrapper">
    <header>
      <h2 class="title">История</h2>
    </header>
    <main>
      <HistoryComponent />
    </main>
  </div>
</template>

<script setup lang="ts">
import HistoryComponent from '../history/HistoryComponent.vue';


</script>

<style scoped>
header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin-bottom: 20px;
}

.wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
