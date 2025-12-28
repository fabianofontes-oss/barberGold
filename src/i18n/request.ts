import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale, defaultLocale } from './config';

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: {
      ...(await import(`../locales/${locale}/common.json`)).default,
      ...(await import(`../locales/${locale}/dashboard.json`)).default,
      ...(await import(`../locales/${locale}/agenda.json`)).default,
      ...(await import(`../locales/${locale}/clients.json`)).default,
      ...(await import(`../locales/${locale}/catalog.json`)).default,
      ...(await import(`../locales/${locale}/pdv.json`)).default,
      ...(await import(`../locales/${locale}/finance.json`)).default,
      ...(await import(`../locales/${locale}/auth.json`)).default,
      ...(await import(`../locales/${locale}/barberclub.json`)).default,
      ...(await import(`../locales/${locale}/payments.json`)).default,
      ...(await import(`../locales/${locale}/settings.json`)).default,
      ...(await import(`../locales/${locale}/onboarding.json`)).default
    }
  };
});
