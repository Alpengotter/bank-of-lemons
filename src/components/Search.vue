<template>
  <div class="input-container">
    <div class="input-wrapper">
      <span class="search-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </span>
      <input :type="type" :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" class="ui-input"
        :placeholder="placeholder" :disabled="disabled" />
      <label class="input-label">{{ label }}</label>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CustomInput',
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue']
})
</script>

<style lang="scss" scoped>
.input-container {
  position: relative;
  width: 100%;
  min-width: 300px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.ui-input {
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-radius: 16px;
  background-color: var(--vt-c-white);

  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;

  color: var(--color-text);

  &:focus {
    outline: none;
    border-color: none;
    box-shadow: none;
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
}

.input-label {
  position: absolute;
  left: 15px;
  top: -10px;
  background: white;
  padding: 0 5px;
  font-size: 14px;
  color: var(--color-text);
  transition: all 0.3s ease;
}

.ui-input:focus+.input-label {
  color: #4a90e2;
}

.error {
  .ui-input {
    border-color: #ff4d4f;

    &:focus {
      box-shadow: 0 0 0 3px rgba(255, 77, 79, 0.1);
    }
  }

  .input-label {
    color: #ff4d4f;
  }
}

.search-icon {
  position: absolute;
  right: 16px;
  color: var(--vt-c-text-light-1);
  display: flex;
  align-items: center;
  pointer-events: none;
  z-index: 1;
}
</style>
