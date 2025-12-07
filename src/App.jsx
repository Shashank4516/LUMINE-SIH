import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import WelcomeSection from "./components/WelcomeSection";
import TempleImage from "./components/TempleImage";
import LoginForm from "./components/LoginForm";
import ForgotPassword from "./components/ForgotPassword";
import Registration from "./components/Registration";
import SlotBooking from "./components/SlotBooking";
import Profile from "./components/Profile";
import Footer from "./components/Footer";
import AdminRoutes from "./components/admin/AdminRoutes";
import { getCurrentUser } from "./services/backendAuth";

function App() {
  const [currentLang, setCurrentLang] = useState("en");
  const [currentRole, setCurrentRole] = useState("devotee");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showSlotBooking, setShowSlotBooking] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Check if user is already logged in or just registered
  useEffect(() => {
    const checkAuthStatus = async () => {
      // Check if user just registered (via localStorage flag)
      const justRegistered = localStorage.getItem("lumine_just_registered");
      if (justRegistered === "true") {
        console.log("User just registered, redirecting to slot booking...");
        localStorage.removeItem("lumine_just_registered");
        setShowSlotBooking(true);
        setShowRegistration(false);
        return;
      }

      // Check if user is already logged in
      const user = await getCurrentUser();
      if (user) {
        console.log("User already logged in, redirecting to slot booking...");
        setShowSlotBooking(true);
        setShowRegistration(false);
        setShowForgotPassword(false);
      } else {
        // User is not logged in, show sign-in page
        setShowSlotBooking(false);
        setShowProfile(false);
        setShowRegistration(false);
        setShowForgotPassword(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Listen for logout events
  useEffect(() => {
    const handleLogout = async () => {
      console.log("User logged out, redirecting to sign-in page...");
      // Reset all state to show sign-in page
      setShowSlotBooking(false);
      setShowProfile(false);
      setShowRegistration(false);
      setShowForgotPassword(false);
    };

    window.addEventListener("userLoggedOut", handleLogout);

    return () => {
      window.removeEventListener("userLoggedOut", handleLogout);
    };
  }, []);

  // Listen for profile navigation events
  useEffect(() => {
    const handleShowProfile = () => {
      setShowProfile(true);
      setShowSlotBooking(false);
    };

    const handleBackToBooking = () => {
      setShowProfile(false);
      setShowSlotBooking(true);
    };

    window.addEventListener("showProfile", handleShowProfile);
    window.addEventListener("backToBooking", handleBackToBooking);

    return () => {
      window.removeEventListener("showProfile", handleShowProfile);
      window.removeEventListener("backToBooking", handleBackToBooking);
    };
  }, []);

  const handleLanguageChange = (lang) => {
    setCurrentLang(lang);
  };

  const handleRoleChange = (roleId) => {
    setCurrentRole(roleId);
  };

  const handleLogin = (data) => {
    // Handle successful login - redirect to slot booking page
    console.log("Login successful, redirecting to slot booking...");
    setShowSlotBooking(true);
    setShowRegistration(false);
    setShowForgotPassword(false);
  };

  const handleRegistrationSuccess = () => {
    console.log("=== handleRegistrationSuccess called ===");
    setShowRegistration(false);
    setShowSlotBooking(true);
    console.log("State updated: showSlotBooking = true");
  };

  const getCurrentView = () => {
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

  // Render admin routes
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route
        path="/*"
        element={
          <>
            {showProfile ? (
              <Profile
                onBack={() => {
                  setShowProfile(false);
                  setShowSlotBooking(true);
                }}
              />
            ) : showSlotBooking ? (
              <SlotBooking />
            ) : (
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
            )}
          </>
        }
      />
    </Routes>
  );
}

export default App;
