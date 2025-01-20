// stores/userStore.ts
import { defineStore } from 'pinia'
import type { HistoryItem } from '@/types/historyItem'
import { makeRequest } from '@/utils/makeRequest'

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
