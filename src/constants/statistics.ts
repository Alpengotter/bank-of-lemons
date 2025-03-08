const translateStatistics = {
  ORDERS_PROCESSED: 'Заказов обработано',
  LEMONS_ACCRUED: 'Лимонов начислено',
  LEMONS_SPEND: 'Лимонов потрачено',
  DIAMONDS_ACCRUED: 'Алмазов начислено',
  DIAMONDS_SPEND: 'Алмазов потрачено',
  NEW_EMPLOYER: 'Новых сотрудников',
}

type TranslationKey = keyof typeof translateStatistics;

/**
 * Возвращает локализованную строку для указанного ключа статистики
 * @param key - Ключ статистики
 * @returns Локализованная строка или ключ, если перевод не найден
 */
export const getStatisticTranslation = (key: string): string => {
  return translateStatistics[key as TranslationKey]
    ?? `Перевод не найден: ${key}`;
}
