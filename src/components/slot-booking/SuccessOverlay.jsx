import React from "react";
import logoImage from "../../assets/img/Adobe Express - file (1).png";

const SuccessOverlay = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm z-50 flex items-center justify-center p-6 transition-colors duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-md w-full text-center space-y-6 transition-colors duration-200">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-lg flex items-center justify-center overflow-hidden bg-transparent dark:bg-transparent">
            <img
              src={logoImage}
              alt="Lumine Temple Logo"
              className="w-full h-full object-contain dark:brightness-0 dark:invert"
            />
          </div>
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
            <i className="ph ph-check-circle text-green-600 dark:text-green-400 text-4xl"></i>
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-2">
            Booking Confirmed!
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Your slot has been successfully booked. You will receive a
            confirmation email shortly.
          </p>
        </div>
        <div className="pt-4">
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 px-4 bg-saffron-600 dark:bg-saffron-500 text-white rounded-lg font-semibold hover:bg-saffron-700 dark:hover:bg-saffron-600 transition-colors"
          >
            Book Another Slot
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessOverlay;
