import LanguageSwitcher from './LanguageSwitcher';

function Header({ currentLang, onLanguageChange }) {
  return (
    <header className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-saffron-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-saffron-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-saffron-500/30">
            <i className="ph-fill ph-church text-2xl"></i>
          </div>
          <div>
            <h1 className="font-serif font-bold text-xl text-saffron-800 leading-tight">Lumine</h1>
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">Somnath Temple</p>
          </div>
        </div>
        <LanguageSwitcher currentLang={currentLang} onLanguageChange={onLanguageChange} />
      </div>
    </header>
  );
}

export default Header;

