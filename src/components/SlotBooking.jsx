import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useSlotBooking from "../hooks/useSlotBooking";
import HeaderSmall from "./slot-booking/HeaderSmall";
import StepWizard from "./slot-booking/StepWizard";
import SlotStep from "./slot-booking/SlotStep";
import MembersStep from "./slot-booking/MembersStep";
import ReviewStep from "./slot-booking/ReviewStep";
import SuccessOverlay from "./slot-booking/SuccessOverlay";
import FormNav from "./slot-booking/FormNav";
import { getCurrentUser } from "../services/backendAuth";

const SlotBooking = () => {
  const navigate = useNavigate();

  // Check if user is authenticated before showing this page
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("lumine_token") || sessionStorage.getItem("lumine_token");
        if (!token) {
          // No token, redirect to landing
          console.log("No auth token, redirecting to landing");
          navigate("/", { replace: true });
          return;
        }

        const user = await getCurrentUser();
        if (!user || !user.id) {
          // Invalid user, clear auth and redirect
          console.log("Invalid user data, redirecting to landing");
          localStorage.removeItem("lumine_token");
          localStorage.removeItem("lumine_user");
          sessionStorage.removeItem("lumine_token");
          sessionStorage.removeItem("lumine_user");
          navigate("/", { replace: true });
        }
      } catch (error) {
        // Error checking auth, redirect to landing
        console.log("Auth check failed, redirecting to landing:", error);
        localStorage.removeItem("lumine_token");
        localStorage.removeItem("lumine_user");
        sessionStorage.removeItem("lumine_token");
        sessionStorage.removeItem("lumine_user");
        navigate("/", { replace: true });
      }
    };

    checkAuth();
  }, [navigate]);
  const {
    currentStep,
    totalSteps,
    temple,
    selectedTempleId,
    date,
    timeSlot,
    members,
    isSubmitting,
    showSuccess,
    temples,
    handleTempleChange,
    handleDateChange,
    handleTimeChange,
    addMember,
    removeMember,
    updateMember,
    verifyAadhaar,
    nextStep,
    prevStep,
    submitBooking,
  } = useSlotBooking();

  return (
    <div className="flex flex-col h-screen bg-[#fdfbf7] font-sans text-[#012a4a]">
      <HeaderSmall />

      {/* Scrollable main content area */}
      <main className="flex-1 overflow-y-auto pb-20 custom-scrollbar">
        <div className="w-full max-w-3xl mx-auto p-4 md:p-8">
          <StepWizard currentStep={currentStep} totalSteps={totalSteps} />

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <SlotStep
              isActive={currentStep === 1}
              temple={temple}
              selectedTempleId={selectedTempleId}
              date={date}
              timeSlot={timeSlot}
              temples={temples}
              onTempleChange={handleTempleChange}
              onDateChange={handleDateChange}
              onTimeChange={handleTimeChange}
            />

            <MembersStep
              isActive={currentStep === 2}
              members={members}
              onAddMember={addMember}
              onRemoveMember={removeMember}
              onUpdateMember={updateMember}
              onVerifyAadhaar={verifyAadhaar}
            />

            <ReviewStep
              isActive={currentStep === 3}
              temple={temple}
              date={date}
              timeSlot={timeSlot}
              memberCount={members.length}
            />

            <SuccessOverlay isVisible={showSuccess} />
          </div>
        </div>
      </main>

      {/* Fixed bottom navigation */}
      {!showSuccess && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="w-full max-w-3xl mx-auto">
            <FormNav
              currentStep={currentStep}
              totalSteps={totalSteps}
              onNext={nextStep}
              onPrev={prevStep}
              onSubmit={submitBooking}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SlotBooking;
