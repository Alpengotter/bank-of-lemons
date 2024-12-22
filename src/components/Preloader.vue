<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="props.width" viewBox="0 0 200 200" aria-label="Loading indicator"
    role="img">
    <template v-for="(circle, index) in circles" :key="index">
      <circle fill="" stroke="" stroke-width="15" r="15" :cx="circle.cx" cy="100">
        <animate attributeName="opacity" calcMode="spline" dur="2s" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1"
          repeatCount="indefinite" :begin="circle.begin" />
      </circle>
    </template>
  </svg>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const circles = ref([
  { cx: 40, begin: '-0.4s' },
  { cx: 100, begin: '-0.2s' },
  { cx: 160, begin: '0s' }
])

const props = defineProps<{
  width: number,
}>()
</script>

<style scoped>
svg {
  height: auto;
  max-width: 200px;
}
</style>
