// stores/userStore.ts
import { defineStore } from 'pinia'
import { type User } from '@/types/user'
import axios from 'axios'

interface UserState {
  users: User[]
  loading: boolean
  error: string | null
  selectedUser: User | null
}

export const useUserStore = defineStore('users', {
  state: (): UserState => ({
    users: [],
    loading: false,
    error: null,
    selectedUser: null,
  }),

  getters: {
    // Get all users
    getAllUsers: (state) => state.users,
  },

  actions: {
    // Fetch all users
    async fetchUsers() {
      this.loading = true
      this.error = null
      try {
        const accessToken = localStorage.getItem('token') // or from your auth store

        if (!accessToken) {
          throw new Error('No access token available')
        }

        const response = await axios.get('/api/v1/employers?offset=0&limit=200', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })

        this.users = response.data
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch users'
      } finally {
        this.loading = false
      }
    },
  },
})
