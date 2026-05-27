import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
import {locales, defaultLocale} from './navigation';

export default getRequestConfig(async (configs) => {
  // Await requestLocale if present, otherwise try to fall back or destructure
  let locale = await (configs as any).requestLocale || (configs as any).locale;

  console.log('>>> i18n getRequestConfig resolved locale:', locale);

  // Validate the resolved locale
  if (!locale || !locales.includes(locale as (typeof locales)[number])) {
    console.warn('>>> i18n getRequestConfig INVALID locale, falling back to default:', locale);
    locale = defaultLocale;
  }

  try {
    const messages = (await import(`./messages/${locale}.json`)).default;
    console.log('>>> i18n getRequestConfig successfully loaded messages for:', locale);
    return {
      locale: locale as string,
      messages
    };
  } catch (error) {
    console.error('>>> i18n getRequestConfig FAILED to load messages for:', locale, error);
    return {
      locale: defaultLocale,
      messages: (await import(`./messages/${defaultLocale}.json`)).default
    };
  }
});
