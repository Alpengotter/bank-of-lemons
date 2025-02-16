// stores/userStore.ts
import { defineStore } from 'pinia'
import { makeRequest } from '@/utils/makeRequest'
import type { Statistic, StatisticsSummaryResponse } from '@/types/statistic'

interface StatisticsState {
  statistics: Statistic[]
  statisticsSummary: StatisticsSummaryResponse[]
  loading: boolean
  error: string | null
}

export const useStatisticsStores = defineStore('statistics', {
  state: (): StatisticsState => ({
    statistics: [],
    statisticsSummary: [],
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
    async fetchStatisticsSummary(type: string, year: number) {
      this.loading = true
      this.error = null
      try {
        const response = await makeRequest<StatisticsSummaryResponse>(
          `analitique/get-analitique-summary?type=${type}&year=${year}`,
          'get',
        )

        const existingRecord = this.statisticsSummary.find((item) => item.type === type);

        if (!existingRecord) {
          // Если записи с таким type нет, добавляем новую запись
          this.statisticsSummary.push({
            ...response,
            type: type,
          });
        } else {
          // Если запись существует, обновляем её
          Object.assign(existingRecord, { ...response, type: type });
        }


      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch orders'
      } finally {
        this.loading = false
      }
    },
    getStatisticsSummary(type: string) {
      return this.statisticsSummary?.find((item) => item.type === type)
    }
  },
})


