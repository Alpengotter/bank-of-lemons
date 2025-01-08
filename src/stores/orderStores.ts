// stores/userStore.ts
import { defineStore } from 'pinia'
import { type Order } from '@/types/order'
import axios from '@/utils/axios'
import Cookies from 'js-cookie'

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
    console.log('🚀 ~ error:', error)
    throw error
  }
}
