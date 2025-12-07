import React, { useState } from "react";
import RoleSelector from "./RoleSelector";
import { TRANSLATIONS } from "../constants/translations";

const LoginCard = ({
  currentRole,
  onRoleChange,
  onLogin,
  isLoading,
  globalError,
}) => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentLang] = useState("en"); // Default to English

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (onLogin) {
      await onLogin({ userId, password, rememberMe, role: currentRole });
    }
  };

  return (
    <div className="bg-white rounded-xl lg:rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="px-6 lg:px-8 pt-6 lg:pt-8">
        <RoleSelector
          currentRole={currentRole}
          currentLang={currentLang}
          onRoleChange={onRoleChange}
        />
      </div>

      <div className="p-6 lg:p-8 pt-4">
        <div className="mb-6">
          <h2 className="text-2xl lg:text-3xl font-serif font-bold text-gray-900">
            {t.signIn}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="userId"
              className="block text-sm font-semibold text-gray-700 uppercase tracking-wide"
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
                onChange={(e) => setUserId(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-2.5 border rounded-lg text-gray-900 bg-white placeholder-gray-400 focus:ring-saffron-500 focus:border-saffron-500 text-sm border-gray-300"
                placeholder="Enter your email or user ID"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 uppercase tracking-wide"
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
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full pl-10 pr-10 py-2.5 border rounded-lg text-gray-900 bg-white placeholder-gray-400 focus:ring-saffron-500 focus:border-saffron-500 text-sm border-gray-300"
                placeholder="••••••••"
                disabled={isLoading}
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
                disabled={isLoading}
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-600 cursor-pointer select-none"
              >
                {t.rememberMe}
              </label>
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
            disabled={isLoading}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-saffron-600 hover:bg-saffron-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saffron-500 transition-transform transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : t.loginBtn}
          </button>
        </form>
      </div>

      <div className="bg-gray-50 px-6 lg:px-8 py-4 lg:py-5 border-t border-gray-100 text-center">
        <p className="text-xs lg:text-sm text-gray-500">
          <span>{t.newHere}</span>{" "}
          <a
            href="/register"
            className="font-medium text-saffron-600 hover:text-saffron-500 hover:underline"
          >
            {t.registerLink}
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginCard;

