import React from "react";

const HeaderSmall = () => {
  return (
    <header className="w-full bg-white border-b border-gray-200 py-4 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-saffron-600 rounded-lg flex items-center justify-center">
            <i className="ph ph-temple text-white text-xl"></i>
          </div>
          <h1 className="text-xl font-serif font-bold text-gray-900">LUMINE</h1>
        </div>
        <button className="text-gray-600 hover:text-gray-900 transition-colors">
          <i className="ph ph-user text-xl"></i>
        </button>
      </div>
    </header>
  );
};

export default HeaderSmall;
