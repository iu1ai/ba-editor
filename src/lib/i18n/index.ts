import {
    register,
    init,
    getLocaleFromNavigator,
    locale,
    t
} from 'svelte-i18n';

register('en', () => import('../locales/en.json'));

const i18nInit = init({
    fallbackLocale: 'en',
    initialLocale: getLocaleFromNavigator()
});

export { i18nInit, locale, t };