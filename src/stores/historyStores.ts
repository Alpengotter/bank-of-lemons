// stores/userStore.ts
import { defineStore } from 'pinia'
import { type Order } from '@/types/order'
import axios from '@/utils/axios'
import type { HistoryItem } from '@/types/historyItem'
import Cookies from 'js-cookie'

interface OrderState {
  history: HistoryItem[]
  loading: boolean
  error: string | null
}

interface FetchProps {
  dateFrom: string
  dateTo: string
  searchParam?: string
}

export const useHistoryStores = defineStore('history', {
  state: (): OrderState => ({
    history: [],
    loading: false,
    error: null,
  }),

  getters: {
    getAllHistory: (state) => state.history,
  },

  actions: {
    async fetchHistory({ dateFrom, dateTo, searchParam = '' }: FetchProps) {
      this.loading = true
      this.error = null
      try {
        const response = await makeRequest<HistoryItem[]>(
          `history/find-by-date-and-param?dateFrom=${dateFrom}&dateTo=${dateTo}&searchParameter=${searchParam}`,
          'get',
        )

        this.history = response.sort((a, b) => {
          if (a.date < b.date) return 1
          if (a.date > b.date) return -1
          return 0
        })
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch history'
      } finally {
        this.loading = false
      }
    },
    async getHistoryByEmployer(id: number) {
      this.loading = true
      this.error = null
      try {
        const response = await makeRequest<HistoryItem[]>(`history/find-by-id?id=${id}`, 'get')

        this.history = response
          .sort((a, b) => {
            if (a.date < b.date) return 1
            if (a.date > b.date) return -1
            return 0
          })
          .slice(0, 5)
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch history by employer'
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
