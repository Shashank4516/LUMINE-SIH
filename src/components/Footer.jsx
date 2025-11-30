import logoImage from "../assets/img/Adobe Express - file (1).png";

function Footer() {
  return (
    <footer className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-4 transition-colors duration-200">
      <div className="w-full mx-auto px-4 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden bg-transparent dark:bg-transparent">
            <img
              src={logoImage}
              alt="Lumine Temple Logo"
              className="w-full h-full object-contain dark:brightness-0 dark:invert"
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-serif">
            © 2024 Lumine Temple Management. Om Namah Shivay.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
