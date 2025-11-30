import React from "react";

const StepWizard = ({ currentStep, totalSteps }) => {
  const steps = [
    { number: 1, label: "Select Slot" },
    { number: 2, label: "Add Members" },
    { number: 3, label: "Review" },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                  currentStep >= step.number
                    ? "bg-saffron-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {currentStep > step.number ? (
                  <i className="ph ph-check text-lg"></i>
                ) : (
                  step.number
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium ${
                  currentStep >= step.number
                    ? "text-saffron-600"
                    : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 ${
                  currentStep > step.number ? "bg-saffron-600" : "bg-gray-200"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StepWizard;
