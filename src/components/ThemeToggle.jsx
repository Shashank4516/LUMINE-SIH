import { useTheme } from "../contexts/ThemeContext";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-10 h-10 rounded-full bg-saffron-50 border border-saffron-200 hover:bg-saffron-100 transition-all duration-200 shadow-sm hover:shadow-md"
      aria-label={
        theme === "light" ? "Switch to dark mode" : "Switch to light mode"
      }
      title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      {theme === "light" ? (
        <i className="ph ph-moon text-saffron-700 text-lg"></i>
      ) : (
        <i className="ph ph-sun text-saffron-700 text-lg"></i>
      )}
    </button>
  );
}

export default ThemeToggle;
