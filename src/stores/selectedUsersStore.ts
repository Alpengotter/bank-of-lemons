import type { User } from '@/types/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSelectedUsersStore = defineStore('selectedUsers', () => {
  const selectedItems = ref<User[]>([])

  return { selectedItems }
})
