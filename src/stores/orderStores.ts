// stores/userStore.ts
import { defineStore } from 'pinia'
import { type Order } from '@/types/order'
import { makeRequest } from '@/utils/makeRequest'

interface OrderState {
  orders: Order[]
  loading: boolean
  error: string | null
}

export const useOrderStores = defineStore('orders', {
  state: (): OrderState => ({
    orders: [],
    loading: false,
    error: null,
  }),

  getters: {
    getAllOrders: (state) => state.orders,
  },

  actions: {
    async fetchOrders() {
      this.loading = true
      this.error = null
      try {
        const response = await makeRequest<Order[]>(`orders`, 'get')

        this.orders = response
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch orders'
      } finally {
        this.loading = false
      }
    },
    async changeStatus(id: number, status: string) {
      this.loading = true
      this.error = null
      try {
        const response = await makeRequest<Order[]>(`orders/change-status`, 'put', {
          id,
          status,
        })

        await this.fetchOrders()
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update order'
      } finally {
        this.loading = false
      }
    },
  },
})
