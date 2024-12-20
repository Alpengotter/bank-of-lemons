<template>
  <Transition name="fade">
    <div v-if="show" class="modal-backdrop" @click.self="emitClose" role="dialog" aria-modal="true">
      <Transition name="slide">
        <div class="modal-content glass">
          <button @click="emitClose" class="close-btn" aria-label="Close modal">
            Закрыть
          </button>

          <div class="modal-body">
            <slot name="content"></slot>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface Props {
  show: boolean;
}

defineProps<Props>();

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
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
}

/* Содержимое модального окна */
.modal-content {
  width: 584px;
  height: 100%;
  background-color: white;
  box-shadow: -2px 0px 5px rgba(0, 0, 0, 0.2);
  padding: 20px;
  position: relative;
  border-radius: 20px 0 0 20px;
}

/* Кнопка закрытия */
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.modal-body {
  margin-top: 40px;
  overflow-y: auto;
}

/* Background fade animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Modal slide animation with delay */
.slide-enter-active {
  transition: transform 0.3s ease 0.2s;
  /* Added 0.2s delay for entering */
}

.slide-leave-active {
  transition: transform 0.3s ease;
  /* No delay when leaving */
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
