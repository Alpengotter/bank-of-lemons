import type { HistoryItem } from './historyItem'

export interface TransformedHistory {
  [key: string]: HistoryItem[]
}
