'use strict';
(() => {
  const draftKey = 'server1616-transfer-application-draft-v17';
  const picker = document.getElementById('history-language');
  function readDraft() {
    try {
      const draft = JSON.parse(localStorage.getItem(draftKey) || '{}');
      return draft && typeof draft === 'object' && !Array.isArray(draft) ? draft : {};
    } catch (_) { return {}; }
  }
  const english = Object.fromEntries([...document.querySelectorAll('[data-history]')].map(el => [el.dataset.history, el.textContent]));
  function setLanguage(language, persist) {
    if (!['en','es','pt','fr','ar','vi','ko','de'].includes(language)) language = 'en';
    const copy = { ...english, ...(window.HISTORY_I18N?.[language] || {}) };
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.title = copy.nav + ' · Join 1616';
    picker.value = language;
    picker.setAttribute('aria-label', copy.language);
    document.querySelectorAll('[data-history]').forEach(el => { el.textContent = copy[el.dataset.history]; });
    if (persist) {
      try { const draft = readDraft(); draft.language = language; localStorage.setItem(draftKey, JSON.stringify(draft)); } catch (_) {}
    }
  }
  picker.addEventListener('change', () => setLanguage(picker.value, true));
  document.querySelectorAll('[data-application]').forEach(link => link.addEventListener('click', () => {
    try { sessionStorage.setItem('server1616-returning-to-application', '1'); } catch (_) {}
  }));
  setLanguage(readDraft().language || 'en', false);
})();
