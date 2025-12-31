export type Locale = 'pt-BR' | 'es-CL' | 'en-US';

export const locales: Locale[] = ['pt-BR', 'es-CL', 'en-US'];

export const defaultLocale: Locale = 'pt-BR';

export const localeNames: Record<Locale, string> = {
  'pt-BR': 'PortuguÃªs (Brasil)',
  'es-CL': 'EspaÃ±ol (Chile)',
  'en-US': 'English (USA)'
};

export const localeFlags: Record<Locale, string> = {
  'pt-BR': 'ðŸ‡§ðŸ‡·',
  'es-CL': 'ðŸ‡¨ðŸ‡±',
  'en-US': 'ðŸ‡ºðŸ‡¸'
};

export const localeCurrencies: Record<Locale, { code: string; symbol: string }> = {
  'pt-BR': { code: 'BRL', symbol: 'R$' },
  'es-CL': { code: 'CLP', symbol: '$' },
  'en-US': { code: 'USD', symbol: '$' }
};

export const localeTimezones: Record<Locale, string> = {
  'pt-BR': 'America/Sao_Paulo',
  'es-CL': 'America/Santiago',
  'en-US': 'America/New_York'
};
