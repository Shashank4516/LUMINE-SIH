import React from "react";
import logoImage from "../../assets/img/Adobe Express - file (1).png";
import UserProfileDropdown from "../UserProfileDropdown";

const HeaderSmall = () => {
  return (
    <header className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 py-4 px-4 md:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-lg flex items-center justify-center overflow-hidden bg-transparent dark:bg-transparent p-1 shadow-sm transition-all duration-200">
            <img
              src={logoImage}
              alt="Lumine Temple Logo"
              className="w-full h-full object-contain dark:brightness-0 dark:invert drop-shadow-sm"
            />
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-gray-900 dark:text-gray-100">
              LUMINE
            </h1>
            <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium">
              Somnath Temple
            </p>
          </div>
        </div>
        <UserProfileDropdown />
      </div>
    </header>
  );
};

export default HeaderSmall;
