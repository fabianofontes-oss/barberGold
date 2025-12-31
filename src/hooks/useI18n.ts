import { useTranslations, useLocale } from 'next-intl';
import { type Locale, localeCurrencies, localeTimezones } from '@/i18n/config';

/**
 * Hook personalizado para internacionalizaÃ§Ã£o
 * 
 * Uso:
 * ```tsx
 * const { t, locale, currency, timezone, formatCurrency } = useI18n();
 * 
 * // Traduzir texto
 * const title = t('common.save');
 * 
 * // Formatar moeda
 * const price = formatCurrency(150.50);
 * ```
 */
export function useI18n() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  
  const currency = localeCurrencies[locale];
  const timezone = localeTimezones[locale];

  /**
   * Formata valor monetÃ¡rio de acordo com o locale atual
   */
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  /**
   * Formata data de acordo com o locale atual
   */
  const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, {
      timeZone: timezone,
      ...options
    }).format(dateObj);
  };

  /**
   * Formata nÃºmero de acordo com o locale atual
   */
  const formatNumber = (value: number, options?: Intl.NumberFormatOptions): string => {
    return new Intl.NumberFormat(locale, options).format(value);
  };

  return {
    t,
    locale,
    currency,
    timezone,
    formatCurrency,
    formatDate,
    formatNumber
  };
}
