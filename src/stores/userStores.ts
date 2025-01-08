// stores/userStore.ts
import { defineStore } from 'pinia'
import { type User } from '@/types/user'
import axios from '@/utils/axios'
import Cookies from 'js-cookie'

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
    // Получить пользователя по ID
    getUserById: (state) => {
      return (id: number) => {
        return state.users.find((user) => user.id === id) || null
      }
    },
  },

  actions: {
    // Fetch all users
    // FIXME: rename to employers
    async fetchUsers(offset = 0, limit = 200) {
      this.loading = true
      this.error = null
      try {
        const response = await makeRequest<User[]>(
          `employers?offset=${offset}&limit=${limit}`,
          'get',
        )

        this.users = response
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch users'
      } finally {
        this.loading = false
      }
    },

    async searchEmployers(searchParameter: string) {
      this.loading = true
      this.error = null
      try {
        const response = await makeRequest<User[]>(
          `employers/find-by-param?searchParameter=${searchParameter}`,
          'get',
        )

        this.users = response
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to search users'
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

    async updateWallet(id: number, wallet: { lemons: number; diamonds: number }) {
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

        await this.fetchUsers()
        await this.employersStat()

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

        await this.fetchUsers()
        await this.employersStat()

        return response
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to deactivate employer '
      } finally {
        this.loading = false
      }
    },

    async addEmployer(user: Omit<User, 'id' | 'isActive'>) {
      this.loading = true
      this.error = null

      try {
        const response = await makeRequest<User>(`employers`, 'post', user)

        await this.fetchUsers()
        await this.employersStat()

        return response
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create employer '
      } finally {
        this.loading = false
      }
    },

    async multipleAccrual({
      userIds,
      currency,
      count,
    }: {
      userIds: number[]
      currency: string
      count: number
    }) {
      this.loading = true
      this.error = null

      try {
        const response = await makeRequest<User>(`employers/multiple-currency`, 'put', {
          userIds,
          currency,
          count,
        })

        await this.fetchUsers()
        await this.employersStat()

        return response
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update employers '
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
  const accessToken = Cookies.get('token')

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
