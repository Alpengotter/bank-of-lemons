<template>
  <Transition name="slide">
    <div v-if="show" class="modal-backdrop" @click.self="emitClose" role="dialog" aria-modal="true">
      <div class="modal-content glass">
        <button @click="emitClose" class="close-btn" aria-label="Close modal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="black" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" />
          </svg>

        </button>

        <div class="modal-body">
          <slot name="content"></slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { VNode } from 'vue'

interface ModalSlots {
  content?: () => VNode;
}

interface Props {
  show: boolean;
}

withDefaults(defineProps<Props>(), {
  show: false,
});

defineSlots<ModalSlots>();

const emit = defineEmits<{
  (e: 'close-modal'): void
}>();

const emitClose = () => {
  emit('close-modal');
};
</script>

<style scoped>
/* Задний фон (бекдроп) */
.modal-backdrop {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  /* background-color: rgba(0, 0, 0, 0.3); */
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
}

/* Содержимое модального окна */
.modal-content {
  width: 584px;
  height: 100%;
  /* background-color: white; */
  box-shadow: -2px 0px 5px rgba(0, 0, 0, 0.2);
  padding: 20px;
  position: relative;
  border-radius: 20px 0 0 20px;
}

/* Кнопка закрытия */
.close-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.modal-body {
  height: 100%;
  overflow-y: auto;
}

.slide-enter-active {
  transition: transform 0.5s ease-out;
}

.slide-leave-active {
  transition: transform 0.5s ease-in;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

.slide-enter-to,
.slide-leave-from {
  transform: translateX(0);
}
</style>
