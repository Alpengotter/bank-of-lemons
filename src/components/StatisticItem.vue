<template>
  <div class="statistic-block">
    <div class="statistic-total">
      <div class="statistic-icon">
        <div v-if="icon === 'employer'">
          <img src="@/assets/busts.png" alt="busts" width="18" height="18"/>
        </div>
        <div v-if="icon === 'diamonds'">
          <img src="@/assets/gem.png" alt="gem" width="18" height="18"/>
        </div>
        <div v-if="icon === 'lemons'">
          <img src="@/assets/lemon.png" alt="lemon" width="18" height="18"/>
        </div>
      </div>
      <div>
        <Preloader :width="20" v-if="!count" />
        <p v-if="count" class="statistic-count">{{ count }}</p>
      </div>
    </div>
    <p class="statistic-title">{{ title }}</p>
  </div>
</template>

<script setup lang="ts">
import Preloader from './Preloader.vue';

const props = defineProps<{
  title: string,
  count: number | undefined,
  icon: 'employer' | 'diamonds' | 'lemons'
}>()
</script>

<style scoped>
.statistic-total {
  display: flex;
  margin-bottom: 6px;

  align-items: flex-end
}

.statistic-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #00000010;
  border-radius: 10px;
  width: 30px;
  height: 30px;

  margin-right: 4px;
}

.statistic-icon div {
  display: flex;
  justify-content: center;
  align-items: center;
}

.statistic-count {
  font-style: normal;
  font-weight: 200;
  font-size: 60px;
  line-height: 44px;

  color: #000000;
}

.statistic-title {
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  line-height: 17px;

  color: #000000;
}
</style>
