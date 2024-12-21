// stores/userStore.ts
import { defineStore } from 'pinia'
import { type User } from '@/types/user'
import axios from 'axios'

interface UserState {
  users: User[]
  loading: boolean
  error: string | null
  selectedUser: User | null
  employerStatistic: EmployerStatistic | null
}

interface EmployerStatistic {
  users: number
  lemons: number
  diamonds: number
}

export const useUserStore = defineStore('users', {
  state: (): UserState => ({
    users: [],
    loading: false,
    error: null,
    selectedUser: null,
    employerStatistic: null,
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
        const response = await makeRequest<User[]>(`employers?offset=0&limit=200`, 'get')

        this.users = response
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch users'
      } finally {
        this.loading = false
      }
    },

    async employersStat() {
      this.loading = true
      this.error = null

      try {
        const response = await makeRequest<EmployerStatistic>(`employers/get-all-stat`, 'get')

        this.employerStatistic = response
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch stat'
      } finally {
        this.loading = false
      }
    },

    async updateWallet(id: number | string, wallet: { lemons: number; diamonds: number }) {
      this.loading = true
      this.error = null

      try {
        const response = await makeRequest<User>(`employers/currency/${id}`, 'put', {
          lemons: wallet.lemons,
          diamonds: wallet.diamonds,
        })

        if (response && response.id) {
          const userId = response.id
          const index = this.users.findIndex((user) => user.id === userId)
          if (index !== -1) {
            this.users[index] = { ...this.users[index], ...response }
          }
        }

        return response
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update wallet'
      } finally {
        this.loading = false
      }
    },

    async getEmployerById(id: number) {
      this.loading = true
      this.error = null

      try {
        const response = await makeRequest<User>(`employers/${id}`, 'get')

        return response
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to get user '
      } finally {
        this.loading = false
      }
    },

    async deactivateEmployerById(id: number) {
      this.loading = true
      this.error = null

      try {
        const response = await makeRequest<User>(`employers/status/${id}`, 'put', {
          isActive: false,
        })

        return response
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to deactivate employer '
      } finally {
        this.loading = false
      }
    },

    async addEmployer(user: User) {
      this.loading = true
      this.error = null

      try {
        const response = await makeRequest<User>(`employers/employers`, 'post', user)

        return response
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create employer '
      } finally {
        this.loading = false
      }
    },
  },
})

const makeRequest = async <T>(
  endpoint: string,
  method: 'get' | 'post' | 'put',
  data?: unknown,
): Promise<T> => {
  const accessToken = localStorage.getItem('token')

  if (!accessToken) {
    throw new Error('No access token available')
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  }

  try {
    const response = await axios({
      url: `/api/v1/${endpoint}`,
      method,
      headers,
      ...(method !== 'get' && { data }),
    })

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Request failed')
    }
    throw error
  }
}
