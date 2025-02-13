// stores/userStore.ts
import { defineStore } from 'pinia'
import { makeRequest } from '@/utils/makeRequest'
import type { Statistic } from '@/types/statistic'

interface StatisticsState {
  statistics: Statistic[]
  loading: boolean
  error: string | null
}

export const useStatisticsStores = defineStore('statistics', {
  state: (): StatisticsState => ({
    statistics: [],
    loading: false,
    error: null,
  }),

  getters: {
    getAllStatistics: (state) => state.statistics,
  },

  actions: {
    async fetchStatistics() {
      this.loading = true
      this.error = null
      try {
        this.statistics = await makeRequest<Statistic[]>(
          `analitique/get-analitique?type=reward`,
          'get',
        )
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch orders'
      } finally {
        this.loading = false
      }
    },
  },
})


