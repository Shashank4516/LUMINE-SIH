import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import logoImage from "../assets/img/Adobe Express - file (1).png";

function Header({ currentLang, onLanguageChange }) {
  return (
    <header className="w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md sticky top-0 z-50 border-b border-saffron-100 dark:border-gray-700 shadow-sm">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-lg flex items-center justify-center overflow-hidden bg-transparent dark:bg-transparent p-1 shadow-md transition-all duration-200">
            <img
              src={logoImage}
              alt="Lumine Temple Logo"
              className="w-full h-full object-contain dark:brightness-0 dark:invert drop-shadow-sm"
            />
          </div>
          <div>
            <h1 className="font-serif font-bold text-xl text-saffron-800 dark:text-saffron-300 leading-tight">
              Lumine
            </h1>
            <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium">
              Somnath Temple
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LanguageSwitcher
            currentLang={currentLang}
            onLanguageChange={onLanguageChange}
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
