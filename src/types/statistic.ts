export interface Statistic {
  id: string
}

export interface StatisticsSummaryResponse {
  type?: string;
  total: number;
  totalMonth: number[];
}
