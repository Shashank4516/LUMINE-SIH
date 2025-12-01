// src/services/backendAuth.js

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

/**
 * Register a new user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} fullName - User full name
 * @param {string} phoneNumber - User phone number
 * @param {string} role - User role (default: 'devotee')
 * @returns {Promise<{user: object, token: string}>}
 */
export const registerUser = async (
  email,
  password,
  fullName,
  phoneNumber,
  role = "devotee"
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        fullName,
        phoneNumber,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error?.message || data.error || "Registration failed"
      );
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        displayName: data.user.fullName,
        fullName: data.user.fullName,
        phoneNumber: phoneNumber,
        role: role,
      },
      token: data.token,
    };
  } catch (error) {
    throw handleBackendError(error);
  }
};

/**
 * Sign in user with email and password
 * Supports both email and phone number lookup
 * @param {string} userId - User email or phone number
 * @param {string} password - User password
 * @param {string} role - Expected user role (for validation, optional)
 * @returns {Promise<{user: object, token: string, redirectUrl: string}>}
 */
export const signInUser = async (userId, password, role = null) => {
  try {
    let email = userId.trim();

    // Check if userId is email or phone number
    const isEmail = email.includes("@");

    // If it's a phone number, we need to find the email first
    // Note: Backend doesn't support phone login directly, so we'll need to handle this
    // For now, we'll assume it's an email
    if (!isEmail) {
      // You could add a separate endpoint to lookup email by phone, or require email login
      throw new Error(
        "Please use your email address to sign in. Phone number login is not supported yet."
      );
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || data.error || "Login failed");
    }

    // Determine redirect URL based on role (you may want to store role in backend)
    const redirectUrls = {
      devotee: "dashboard.html",
      mandir_admin: "admindashboard.html",
      security_guard: "security.html",
      parking_incharge: "parking.html",
    };

    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        displayName: data.user.fullName,
        fullName: data.user.fullName,
        role: role || "devotee", // Default to devotee if not specified
      },
      token: data.token,
      redirectUrl: redirectUrls[role || "devotee"] || "dashboard.html",
    };
  } catch (error) {
    throw handleBackendError(error);
  }
};

/**
 * Sign out current user
 * @returns {Promise<void>}
 */
export const signOutUser = async () => {
  try {
    // Clear local storage
    localStorage.removeItem("lumine_token");
    localStorage.removeItem("lumine_user");
    sessionStorage.removeItem("lumine_token");
    sessionStorage.removeItem("lumine_user");
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
};

/**
 * Send password reset email
 * Note: Backend doesn't have this endpoint yet, you'll need to add it
 * @param {string} email - User email
 * @returns {Promise<void>}
 */
export const resetPassword = async (email) => {
  // TODO: Implement when backend endpoint is available
  throw new Error("Password reset is not yet implemented with backend auth");
};

/**
 * Get current authenticated user from token
 * @returns {Promise<object|null>}
 */
export const getCurrentUser = async () => {
  try {
    const token =
      localStorage.getItem("lumine_token") ||
      sessionStorage.getItem("lumine_token");
    const userStr =
      localStorage.getItem("lumine_user") ||
      sessionStorage.getItem("lumine_user");

    if (!token || !userStr) {
      return null;
    }

    // Verify token is still valid by making a request to backend
    // For now, just return the stored user
    return JSON.parse(userStr);
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
};

/**
 * Handle backend errors and convert to user-friendly messages
 * @param {Error} error - Backend error
 * @returns {Error}
 */
const handleBackendError = (error) => {
  // If it's already a formatted error, return it
  if (error.message && !error.message.includes("fetch")) {
    return error;
  }

  // Network errors
  if (error.message?.includes("fetch") || error.message?.includes("Network")) {
    return new Error(
      "Network error. Please check your connection and ensure the backend is running."
    );
  }

  // Default error
  return new Error(error.message || "An error occurred. Please try again.");
};
