import { useState } from "react";
import { TRANSLATIONS, ROLES } from "../constants/translations";
import RoleSelector from "./RoleSelector";
import { signInUser } from "../services/firebaseAuth";

function LoginForm({
  currentRole,
  currentLang,
  onRoleChange,
  onLogin,
  onShowForgotPassword,
  onShowRegistration,
}) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userIdError, setUserIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [globalError, setGlobalError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const t = TRANSLATIONS[currentLang];
  const roleData = ROLES[currentRole];

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValid = true;
    setUserIdError("");
    setPasswordError("");
    setGlobalError("");

    const errId =
      currentLang === "en" ? "User ID is required." : "यूज़र आईडी आवश्यक है।";
    const errPass =
      currentLang === "en"
        ? "Password must be at least 8 chars."
        : "पासवर्ड कम से कम 8 अक्षर का होना चाहिए।";

    if (!userId.trim()) {
      setUserIdError(errId);
      isValid = false;
    }

    if (!password || password.length < 8) {
      setPasswordError(errPass);
      isValid = false;
    }

    if (!isValid) return;

    setIsLoading(true);
    setGlobalError("");

    try {
      // Use Firebase authentication
      // signInUser supports both email and phone number
      const result = await signInUser(userId.trim(), password, currentRole);

      // Store token and user data based on remember me
      if (rememberMe) {
        localStorage.setItem("lumine_token", result.token);
        localStorage.setItem("lumine_user", JSON.stringify(result.user));
      } else {
        sessionStorage.setItem("lumine_token", result.token);
        sessionStorage.setItem("lumine_user", JSON.stringify(result.user));
      }

      handleSuccess(result);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = (data) => {
    // Token and user data are already stored in handleSubmit
    if (onLogin) {
      onLogin(data);
    } else {
      setTimeout(() => {
        window.location.href = data.redirectUrl;
      }, 1000);
    }
  };

  const handleError = (error) => {
    const msg = error.message || "Invalid Credentials or Server Offline.";
    setGlobalError(msg);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleUserIdChange = (e) => {
    setUserId(e.target.value);
    setUserIdError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  return (
    <div className="w-full max-w-md mx-auto lg:mx-0">
      <div className="lg:hidden text-center mb-8 space-y-2">
        <h1 className="font-serif text-3xl font-bold text-gray-900">
          <span>{t.welcomeMain}</span>{" "}
          <span className="text-saffron-600">{t.welcomeSub}</span>
        </h1>
      </div>
      <div
        className={`bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden relative ${
          isShaking ? "animate-[shake_0.5s_ease-in-out]" : ""
        }`}
      >
        <div
          className={`absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center ${
            isLoading ? "" : "hidden"
          }`}
        >
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-saffron-100 border-t-saffron-600"></div>
          <p className="mt-3 text-sm text-saffron-800 font-medium animate-pulse">
            Verifying credentials...
          </p>
        </div>

        <RoleSelector
          currentRole={currentRole}
          currentLang={currentLang}
          onRoleChange={onRoleChange}
        />

        <div className="p-6 md:p-8 pt-4">
          <div className="mb-6">
            <h2 className="text-2xl font-serif font-bold text-gray-900">
              {t.signIn}
            </h2>
            <p
              className="text-sm text-gray-500 mt-1 transition-opacity duration-300"
              style={{ opacity: 1 }}
            >
              {roleData[currentLang].helper}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-1">
              <label
                htmlFor="userId"
                className="block text-xs font-semibold text-gray-700 uppercase tracking-wide"
              >
                {t.labelUserId}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <i className="ph ph-user text-lg"></i>
                </div>
                <input
                  type="text"
                  id="userId"
                  name="user_id"
                  value={userId}
                  onChange={handleUserIdChange}
                  required
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:ring-saffron-500 focus:border-saffron-500 sm:text-sm transition-colors ${
                    userIdError
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder={roleData[currentLang].placeholder}
                />
              </div>
              {userIdError && (
                <p className="text-red-500 text-xs">{userIdError}</p>
              )}
            </div>

            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-gray-700 uppercase tracking-wide"
              >
                {t.labelPassword}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <i className="ph ph-lock-key text-lg"></i>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  minLength={8}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:ring-saffron-500 focus:border-saffron-500 sm:text-sm transition-colors ${
                    passwordError
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i
                    className={`ph ${
                      showPassword ? "ph-eye text-saffron-600" : "ph-eye-slash"
                    } text-lg`}
                  ></i>
                </button>
              </div>
              {passwordError && (
                <p className="text-red-500 text-xs">{passwordError}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-saffron-600 focus:ring-saffron-500 border-gray-300 rounded cursor-pointer"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-600 cursor-pointer select-none"
                >
                  {t.rememberMe}
                </label>
              </div>
              <div className="text-sm">
                <button
                  type="button"
                  onClick={onShowForgotPassword}
                  className="font-medium text-saffron-600 hover:text-saffron-500 hover:underline"
                >
                  {t.forgotPass}
                </button>
              </div>
            </div>

            {globalError && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-sm">
                <i className="ph-fill ph-warning-circle text-lg"></i>
                <span>{globalError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-saffron-600 hover:bg-saffron-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saffron-500 transition-transform transform active:scale-95"
            >
              {t.loginBtn}
            </button>
          </form>
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">
            <span>{t.newHere}</span>{" "}
            <button
              type="button"
              onClick={onShowRegistration}
              className="font-medium text-saffron-600 hover:text-saffron-500"
            >
              {t.registerLink}
            </button>
          </p>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-gray-400 flex items-center justify-center gap-1">
        <i className="ph-fill ph-lock-key"></i>
        <span>256-bit SSL Encrypted Connection</span>
      </div>
    </div>
  );
}

export default LoginForm;
