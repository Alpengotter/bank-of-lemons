// stores/userStore.ts
import { defineStore } from 'pinia'
import { makeRequest } from '@/utils/makeRequest'
import type { Statistic, StatisticsSummaryResponse } from '@/types/statistic'

interface StatisticsState {
  statistics: Statistic[],
  summary: StatisticsSummaryResponse[],
  loading: boolean
  error: string | null
}

export const useStatisticsStores = defineStore('statistics', {
  state: (): StatisticsState => ({
    statistics: [],
    summary: [],
    loading: false,
    error: null,
  }),

  getters: {
    getAllStatistics: (state) => state.statistics,
  },

  actions: {
    async fetchStatisticsSummary(types: string[], year: number, single?: boolean) {
      this.loading = true
      this.error = null
      try {
        const params = new URLSearchParams()
        types.forEach(type => params.append('type', type))
        params.set('year', year.toString())

        const response = await makeRequest<StatisticsSummaryResponse[]>(
          `analitique/get-analitique-summary?${params.toString()}`,
          'get',
        )

        if (single) {
          return response;
        } else {
          this.summary = response;
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch orders'
      } finally {
        this.loading = false
      }
    },
  },
})


