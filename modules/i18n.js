export const I18N = {
  en: { langCode: 'EN', langTitle: 'English (EN)', switchMsg: 'Switched language to English 🇬🇧' },
  id: { langCode: 'ID', langTitle: 'Bahasa Indonesia (ID)', switchMsg: 'Bahasa berhasil diubah ke Bahasa Indonesia 🇮🇩' }
};

export function closeAllLangDropdowns() {
  document.querySelectorAll('.lang-dropdown').forEach(dropdown => dropdown.classList.add('hidden'));
  document.querySelectorAll('.lang-switcher-wrap').forEach(wrapper => {
    wrapper.classList.remove('open');
    wrapper.querySelector('.lang-btn')?.setAttribute('aria-expanded', 'false');
  });
}

export function applyLanguage(lang, { state, saveState, showToast } = {}) {
  const selected = lang === 'id' ? 'id' : 'en';
  if (state) state.lang = selected;
  const translations = I18N[selected];
  document.documentElement.lang = selected;
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const value = translations[element.dataset.i18n];
    if (value) element.textContent = value;
  });
  document.querySelectorAll('.lang-opt').forEach(option => option.classList.toggle('active', option.dataset.setLang === selected));
  closeAllLangDropdowns();
  if (saveState) saveState();
  if (showToast) showToast(translations.switchMsg);
}
