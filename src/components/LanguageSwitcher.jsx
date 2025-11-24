function LanguageSwitcher({ currentLang, onLanguageChange }) {
  return (
    <div className="flex bg-saffron-50 rounded-full p-1 border border-saffron-200">
      <button
        id="btn-en"
        onClick={() => onLanguageChange('en')}
        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
          currentLang === 'en'
            ? 'bg-saffron-600 text-white shadow-sm'
            : 'text-saffron-700 hover:bg-saffron-100'
        }`}
      >
        EN
      </button>
      <button
        id="btn-hi"
        onClick={() => onLanguageChange('hi')}
        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
          currentLang === 'hi'
            ? 'bg-saffron-600 text-white shadow-sm'
            : 'text-saffron-700 hover:bg-saffron-100'
        }`}
      >
        HI
      </button>
    </div>
  );
}

export default LanguageSwitcher;

