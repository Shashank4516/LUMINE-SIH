import { useState, useEffect } from "react";
import Header from "./components/Header";
import WelcomeSection from "./components/WelcomeSection";
import TempleImage from "./components/TempleImage";
import LoginForm from "./components/LoginForm";
import ForgotPassword from "./components/ForgotPassword";
import Registration from "./components/Registration";
import SlotBooking from "./components/SlotBooking";
import Footer from "./components/Footer";

function App() {
  const [currentLang, setCurrentLang] = useState("en");
  const [currentRole, setCurrentRole] = useState("devotee");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showSlotBooking, setShowSlotBooking] = useState(false);

  // Check if user just registered (via localStorage flag)
  useEffect(() => {
    const justRegistered = localStorage.getItem("lumine_just_registered");
    if (justRegistered === "true") {
      console.log("User just registered, redirecting to slot booking...");
      localStorage.removeItem("lumine_just_registered");
      setShowSlotBooking(true);
      setShowRegistration(false);
    }
  }, []);

  const handleLanguageChange = (lang) => {
    setCurrentLang(lang);
  };

  const handleRoleChange = (roleId) => {
    setCurrentRole(roleId);
  };

  const handleLogin = (data) => {
    // Handle successful login
    setTimeout(() => {
      window.location.href = data.redirectUrl;
    }, 1000);
  };

  const handleRegistrationSuccess = () => {
    console.log("=== handleRegistrationSuccess called ===");
    setShowRegistration(false);
    setShowSlotBooking(true);
    console.log("State updated: showSlotBooking = true");
  };

  const getCurrentView = () => {
    if (showSlotBooking) {
      return <SlotBooking />;
    }
    if (showRegistration) {
      return (
        <Registration
          currentLang={currentLang}
          onBackToLogin={() => setShowRegistration(false)}
          onRegistrationSuccess={handleRegistrationSuccess}
        />
      );
    }
    if (showForgotPassword) {
      return (
        <ForgotPassword
          currentRole={currentRole}
          currentLang={currentLang}
          onRoleChange={handleRoleChange}
          onBackToLogin={() => setShowForgotPassword(false)}
        />
      );
    }
    return (
      <LoginForm
        currentRole={currentRole}
        currentLang={currentLang}
        onRoleChange={handleRoleChange}
        onLogin={handleLogin}
        onShowForgotPassword={() => setShowForgotPassword(true)}
        onShowRegistration={() => setShowRegistration(true)}
      />
    );
  };

  // If SlotBooking is shown, render it full screen without the login layout
  if (showSlotBooking) {
    return <SlotBooking />;
  }

  return (
    <div className="font-sans text-gray-800 dark:text-gray-100 h-screen flex flex-col relative overflow-hidden bg-sand dark:bg-gray-900 transition-colors duration-200">
      <Header
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
      />

      <main className="flex-1 flex items-stretch overflow-hidden">
        <div className="w-full h-full grid lg:grid-cols-2">
          {/* Left side - Temple Image (50%) */}
          <TempleImage currentLang={currentLang} />

          {/* Mobile welcome section */}
          <div className="lg:hidden p-6 bg-sand dark:bg-gray-900 bg-mandala dark:bg-mandala-dark overflow-y-auto transition-colors duration-200">
            <WelcomeSection currentLang={currentLang} />
          </div>

          {/* Right side - Login/Registration/Forgot Password (50%) */}
          <div className="flex items-center justify-center p-6 lg:p-8 xl:p-10 2xl:p-12 pt-20 lg:pt-8 bg-sand dark:bg-gray-900 bg-mandala dark:bg-mandala-dark overflow-y-auto custom-scrollbar transition-colors duration-200">
            <div className="w-full max-w-md lg:max-w-lg xl:max-w-lg">
              {getCurrentView()}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
