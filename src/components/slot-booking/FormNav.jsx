import React from "react";

const FormNav = ({
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onSubmit,
  isSubmitting,
}) => {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="px-4 md:px-6 py-4 flex items-center justify-between gap-4">
      <button
        onClick={onPrev}
        disabled={isFirstStep}
        className={`px-5 md:px-6 py-2.5 rounded-lg font-medium transition-all flex items-center ${
          isFirstStep
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm"
        }`}
      >
        <i className="ph ph-arrow-left mr-2"></i>
        <span className="hidden sm:inline">Previous</span>
        <span className="sm:hidden">Back</span>
      </button>

      {isLastStep ? (
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="px-6 md:px-8 py-2.5 bg-saffron-600 text-white rounded-lg font-semibold hover:bg-saffron-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <i className="ph ph-check"></i>
              <span>Confirm Booking</span>
            </>
          )}
        </button>
      ) : (
        <button
          onClick={onNext}
          className="px-6 md:px-8 py-2.5 bg-saffron-600 text-white rounded-lg font-semibold hover:bg-saffron-700 transition-all flex items-center gap-2 shadow-sm"
        >
          <span>Next</span>
          <i className="ph ph-arrow-right"></i>
        </button>
      )}
    </div>
  );
};

export default FormNav;
