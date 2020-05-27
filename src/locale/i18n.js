import i18n from 'i18n-js';

import en from './en/messages';
import mm from './mm/messages';

i18n.locale = 'en';
i18n.fallbacks = true;
i18n.translations = { en, mm };

export default i18n;