// stores/userStore.ts
import { defineStore } from 'pinia'
import { UserStatus, type User, type UserRole } from '@/types/user'
import { MOCK_USERS } from '@/mockups/users'

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

    // Get user by id
    getUserById: (state) => {
      return (userId: string) => state.users.find((user) => user.id === userId)
    },

    // Get users by department
    getUsersByDepartment: (state) => {
      return (department: string) => state.users.filter((user) => user.department === department)
    },

    // Get users by role
    getUsersByRole: (state) => {
      return (role: UserRole) => state.users.filter((user) => user.role === role)
    },

    // Get active users
    getActiveUsers: (state) => state.users.filter((user) => user.status === UserStatus.ACTIVE),

    // Get total lemons
    getTotalLemons: (state) => state.users.reduce((sum, user) => sum + user.lemons, 0),

    // Get total diamonds
    getTotalDiamonds: (state) => state.users.reduce((sum, user) => sum + user.diamonds, 0),
  },

  actions: {
    // Fetch all users
    async fetchUsers() {
      this.loading = true
      this.error = null
      try {
        // const response = await fetch('/api/users')
        // const data = await response.json()

        setTimeout(() => {
          this.users = MOCK_USERS
          console.log('Данные успешно загружены:', this.users)
        }, 1500)
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch users'
      } finally {
        this.loading = false
      }
    },

    // Add new user
    async addUser(user: Omit<User, 'id'>) {
      this.loading = true
      this.error = null
      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        })
        const newUser = await response.json()
        this.users.push(newUser)
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to add user'
      } finally {
        this.loading = false
      }
    },

    // Update user
    async updateUser(userId: string, updates: Partial<User>) {
      this.loading = true
      this.error = null
      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updates),
        })
        const updatedUser = await response.json()
        const index = this.users.findIndex((user) => user.id === userId)
        if (index !== -1) {
          this.users[index] = updatedUser
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update user'
      } finally {
        this.loading = false
      }
    },

    // Delete user
    async deleteUser(userId: string) {
      this.loading = true
      this.error = null
      try {
        await fetch(`/api/users/${userId}`, {
          method: 'DELETE',
        })
        this.users = this.users.filter((user) => user.id !== userId)
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to delete user'
      } finally {
        this.loading = false
      }
    },

    // Update user lemons
    async updateUserLemons(userId: string, amount: number) {
      const user = this.users.find((u) => u.id === userId)
      if (user) {
        await this.updateUser(userId, {
          lemons: user.lemons + amount,
        })
      }
    },

    // Update user diamonds
    async updateUserDiamonds(userId: string, amount: number) {
      const user = this.users.find((u) => u.id === userId)
      if (user) {
        await this.updateUser(userId, {
          diamonds: user.diamonds + amount,
        })
      }
    },

    // Set selected user
    setSelectedUser(user: User | null) {
      this.selectedUser = user
    },

    // Clear all users
    clearUsers() {
      this.users = []
      this.selectedUser = null
      this.error = null
    },
  },
})
