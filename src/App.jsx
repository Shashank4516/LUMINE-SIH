import { useState } from "react";
import Header from "./components/Header";
import WelcomeSection from "./components/WelcomeSection";
import LoginForm from "./components/LoginForm";
import ForgotPassword from "./components/ForgotPassword";
import Registration from "./components/Registration";
import Footer from "./components/Footer";

function App() {
  const [currentLang, setCurrentLang] = useState("en");
  const [currentRole, setCurrentRole] = useState("devotee");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);

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

  const getCurrentView = () => {
    if (showRegistration) {
      return (
        <Registration
          currentLang={currentLang}
          onBackToLogin={() => setShowRegistration(false)}
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

  return (
    <div className="bg-sand font-sans text-gray-800 min-h-screen flex flex-col bg-mandala">
      <Header
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
      />

      <main className="flex-grow flex items-center justify-center p-4 lg:p-8">
        <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <WelcomeSection currentLang={currentLang} />

          {getCurrentView()}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
