function LanguageSwitcher({ currentLang, onLanguageChange }) {
  return (
    <div className="flex bg-saffron-50 dark:bg-gray-800 rounded-full p-1 border border-saffron-200 dark:border-gray-700 transition-colors duration-200">
      <button
        id="btn-en"
        onClick={() => onLanguageChange("en")}
        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
          currentLang === "en"
            ? "bg-saffron-600 dark:bg-saffron-500 text-white shadow-sm"
            : "text-saffron-700 dark:text-gray-300 hover:bg-saffron-100 dark:hover:bg-gray-700"
        }`}
      >
        EN
      </button>
      <button
        id="btn-hi"
        onClick={() => onLanguageChange("hi")}
        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
          currentLang === "hi"
            ? "bg-saffron-600 dark:bg-saffron-500 text-white shadow-sm"
            : "text-saffron-700 dark:text-gray-300 hover:bg-saffron-100 dark:hover:bg-gray-700"
        }`}
      >
        HI
      </button>
    </div>
  );
}

export default LanguageSwitcher;
