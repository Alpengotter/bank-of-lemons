export interface StatisticItem {
  id: number;
  title: string;
  summary: {
    total: number;
    byMounths: number[];
  };
}
