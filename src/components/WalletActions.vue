<template>
  <div class="actions">
    <div class="switch">
      <div v-for="(currency, index) in currencies" :key="index"
        :class="{ 'switch-item': true, active: activeCurrencyIndex === index }" @click="setActiveCurrency(index)">
        <span>{{ currency }}</span>
      </div>
    </div>
    <div class="switch">
      <div v-for="(operation, index) in operations" :key="index"
        :class="{ 'switch-item': true, active: activeOperationIndex === index }" @click="setActiveOperation(index)">
        <span>{{ operation }}</span>
      </div>
    </div>
    <input class="input" type="number" placeholder="0" v-model="inputValue">
    <Button appearance="primary" class="submit" @click="handleSubmit" :disabled="!inputValue"
      :class="{ 'disabled': !inputValue }">
      OK
    </Button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from './Button.vue';

const props = defineProps<{
  currencies: string[];
  operations: string[];
}>();

const emit = defineEmits(['submit']);

const activeOperationIndex = ref(0);
const activeCurrencyIndex = ref(0);
const inputValue = ref<number | null>(null);

const setActiveCurrency = (index: number) => {
  activeCurrencyIndex.value = index;
};

const setActiveOperation = (index: number) => {
  activeOperationIndex.value = index;
};

const handleSubmit = () => {
  emit('submit', {
    currency: props.currencies[activeCurrencyIndex.value],
    operation: props.operations[activeOperationIndex.value],
    value: inputValue.value
  });
  inputValue.value = null;
};
</script>

<style scoped>
.actions {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  margin-bottom: 1rem;
  justify-content: center
}

.switch {
  display: flex;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 99px;
}

.switch-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 99px;
  margin: 4px;
  cursor: pointer;
}

.switch-item span {
  font-size: 14px;
}

.switch-item.active {
  background-color: var(--vt-c-white);
}

.input {
  border-radius: 99px;
  border: none;
  background-color: rgba(0, 0, 0, .1);
  padding: 8px 16px;
  font-size: 14px;
}

.submit {
  width: 40px;
  height: 40px;
  border-radius: 99px;
  padding: 0;
  font-size: 14px;
}

.submit.disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
