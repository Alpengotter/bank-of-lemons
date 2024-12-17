<template>
  <div class="modal-backdrop" @click.self="emitClose">
    <div class="modal-content">
      <button @click="emitClose" class="close-btn">Закрыть</button>

      <div class="modal-body">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emitClose = () => {
  const emit = defineEmits(['close-modal']);
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
  background-color: rgba(0, 0, 0, 0.5);
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
</style>
