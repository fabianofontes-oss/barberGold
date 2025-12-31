import type { Locale } from '@/i18n/config';

/**
 * Tipos para mensagens de traduÃ§Ã£o
 */
export type Messages = {
  app: {
    name: string;
    tagline: string;
  };
  navigation: {
    dashboard: string;
    calendar: string;
    clients: string;
    services: string;
    team: string;
    reports: string;
    settings: string;
  };
  common: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    add: string;
    search: string;
    filter: string;
    loading: string;
    error: string;
    success: string;
    confirm: string;
    back: string;
    next: string;
    finish: string;
  };
  currency: {
    symbol: string;
    code: string;
    format: string;
  };
  date: {
    format: string;
    timeFormat: string;
  };
  title: string;
  methods: {
    cash: string;
    credit_card: string;
    debit_card: string;
    pix: string;
    google_pay: string;
    apple_pay: string;
    mercado_pago: string;
    pagseguro: string;
    infinite_pay: string;
    stone: string;
    other: string;
  };
  gateways: {
    mercado_pago: string;
    pagseguro: string;
    stripe: string;
    infinitepay: string;
    stone: string;
  };
  pix: {
    title: string;
    keyType: string;
    key: string;
    beneficiary: string;
    qrCode: string;
    copyCode: string;
  };
  installments: {
    title: string;
    max: string;
    minValue: string;
    interest: string;
    interestRate: string;
  };
  bankAccount: {
    title: string;
    bank: string;
    accountType: string;
    agency: string;
    account: string;
    holder: string;
    document: string;
  };
};

/**
 * ConfiguraÃ§Ã£o de paÃ­s/regiÃ£o
 */
export interface CountryConfig {
  locale: Locale;
  currency: {
    code: string;
    symbol: string;
  };
  timezone: string;
  dateFormat: string;
  phoneFormat: string;
  documentTypes: string[];
  paymentMethods: string[];
}

/**
 * ConfiguraÃ§Ãµes por paÃ­s
 */
export const countryConfigs: Record<Locale, CountryConfig> = {
  'pt-BR': {
    locale: 'pt-BR',
    currency: { code: 'BRL', symbol: 'R$' },
    timezone: 'America/Sao_Paulo',
    dateFormat: 'dd/MM/yyyy',
    phoneFormat: '(XX) XXXXX-XXXX',
    documentTypes: ['CPF', 'CNPJ'],
    paymentMethods: ['PIX', 'Mercado Pago', 'PagSeguro', 'InfinitePay', 'Stone']
  },
  'es-CL': {
    locale: 'es-CL',
    currency: { code: 'CLP', symbol: '$' },
    timezone: 'America/Santiago',
    dateFormat: 'dd/MM/yyyy',
    phoneFormat: '+56 X XXXX XXXX',
    documentTypes: ['RUT'],
    paymentMethods: ['Mercado Pago', 'Webpay', 'Khipu']
  },
  'en-US': {
    locale: 'en-US',
    currency: { code: 'USD', symbol: '$' },
    timezone: 'America/New_York',
    dateFormat: 'MM/dd/yyyy',
    phoneFormat: '(XXX) XXX-XXXX',
    documentTypes: ['SSN', 'EIN'],
    paymentMethods: ['Stripe', 'Square', 'PayPal', 'Venmo']
  }
};
