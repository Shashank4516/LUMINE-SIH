// src/services/bookingService.js

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

/**
 * Safely parse JSON response
 * @param {Response} response - Fetch response object
 * @returns {Promise<object>}
 */
const parseJSON = async (response) => {
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text();
    throw new Error(text || "Invalid response format");
  }
  return response.json();
};

/**
 * Handle backend errors and convert to user-friendly messages
 * @param {Error} error - Backend error
 * @returns {Error}
 */
const handleBackendError = (error) => {
  // If it's already a formatted error, return it
  if (
    error.message &&
    !error.message.includes("fetch") &&
    !error.message.includes("JSON")
  ) {
    return error;
  }

  // Network errors
  if (
    error.message?.includes("fetch") ||
    error.message?.includes("Network") ||
    error.message?.includes("Failed to fetch")
  ) {
    return new Error(
      "Network error. Please check your connection and ensure the backend is running."
    );
  }

  // JSON parsing errors
  if (
    error.message?.includes("JSON") ||
    error.message?.includes("Unexpected token")
  ) {
    return new Error(
      "Invalid response from server. Please check if the backend is running correctly."
    );
  }

  // Default error
  return new Error(error.message || "An error occurred. Please try again.");
};

/**
 * Create a new booking
 * @param {object} bookingData - Booking data including members
 * @returns {Promise<object>}
 */
export const createBooking = async (bookingData) => {
  try {
    const token =
      localStorage.getItem("lumine_token") ||
      sessionStorage.getItem("lumine_token");

    console.log("bookingService: Creating booking with data:", bookingData);
    console.log("bookingService: API URL:", `${API_BASE_URL}/api/bookings`);

    const response = await fetch(`${API_BASE_URL}/api/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(bookingData),
    });

    console.log("bookingService: Response status:", response.status);

    // Safely parse JSON response
    let data;
    try {
      data = await parseJSON(response);
      console.log("bookingService: Response data:", data);
    } catch (parseError) {
      console.error("bookingService: Failed to parse response:", parseError);
      if (!response.ok) {
        throw new Error(
          `Server error (${response.status}): ${
            parseError.message || "Invalid response"
          }`
        );
      }
      throw parseError;
    }

    if (response.ok && response.status === 201) {
      console.log("✅ Booking successfully created and saved to database!");
      console.log("✅ Data is now available in PostgreSQL (pgAdmin)");
      console.log("   - Booking ID:", data.booking?.id);
      console.log("   - Booking Number:", data.booking?.bookingNumber);
      console.log("   - Total Members:", data.booking?.members?.length || 0);
      return {
        message: data.message || "Booking created successfully",
        booking: data.booking,
      };
    }

    if (!response.ok) {
      // Better error handling - extract validation errors
      let errorMessage = "Failed to create booking";

      if (data?.error) {
        if (typeof data.error === "string") {
          errorMessage = data.error;
        } else if (data.error.fieldErrors) {
          // Zod validation errors
          const fieldErrors = Object.entries(data.error.fieldErrors)
            .map(
              ([field, errors]) =>
                `${field}: ${
                  Array.isArray(errors) ? errors.join(", ") : errors
                }`
            )
            .join("\n");
          errorMessage = `Validation errors:\n${fieldErrors}`;
        } else if (data.error.formErrors) {
          errorMessage = `Form errors: ${data.error.formErrors.join(", ")}`;
        } else if (data.error.message) {
          errorMessage = data.error.message;
        }
      } else if (data?.message) {
        errorMessage = data.message;
      }

      throw new Error(errorMessage);
    }

    return {
      message: data.message || "Booking created successfully",
      booking: data.booking,
    };
  } catch (error) {
    console.error("bookingService: Error creating booking:", error);
    throw handleBackendError(error);
  }
};

/**
 * Get all bookings (for admin/viewing)
 * @returns {Promise<object>}
 */
export const getAllBookings = async () => {
  try {
    const token =
      localStorage.getItem("lumine_token") ||
      sessionStorage.getItem("lumine_token");

    const response = await fetch(`${API_BASE_URL}/api/bookings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    let data;
    try {
      data = await parseJSON(response);
    } catch (parseError) {
      if (!response.ok) {
        throw new Error(
          `Server error (${response.status}): ${
            parseError.message || "Invalid response"
          }`
        );
      }
      throw parseError;
    }

    if (!response.ok) {
      throw new Error(
        data?.error?.message || data?.error || "Failed to fetch bookings"
      );
    }

    return data;
  } catch (error) {
    throw handleBackendError(error);
  }
};

/**
 * Get bookings for a specific user
 * @param {number} userId - User ID
 * @returns {Promise<Array>}
 */
export const getUserBookings = async (userId) => {
  try {
    const token =
      localStorage.getItem("lumine_token") ||
      sessionStorage.getItem("lumine_token");

    const url = `${API_BASE_URL}/api/bookings/user/${userId}`;
    console.log("getUserBookings: Fetching from:", url);
    console.log("getUserBookings: User ID:", userId);
    console.log("getUserBookings: Has token:", !!token);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    console.log("getUserBookings: Response status:", response.status);
    console.log("getUserBookings: Response ok:", response.ok);

    // Handle rate limiting (429)
    if (response.status === 429) {
      console.warn("getUserBookings: Rate limited by server");
      throw new Error(
        "Server is busy (rate limited). Please wait a moment and try again."
      );
    }

    let data;
    try {
      data = await parseJSON(response);
      console.log("getUserBookings: Response data:", data);
    } catch (parseError) {
      console.error("getUserBookings: Parse error:", parseError);
      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        console.error("getUserBookings: Error response:", errorText);
        throw new Error(
          `Server error (${response.status}): ${
            parseError.message || errorText || "Invalid response"
          }`
        );
      }
      throw parseError;
    }

    if (!response.ok) {
      const errorMsg =
        data?.error?.message ||
        data?.error ||
        `HTTP ${response.status}: Failed to fetch user bookings`;
      console.error("getUserBookings: API error:", errorMsg);
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    console.error("getUserBookings: Caught error:", error);

    // Check if it's a rate limit error (already handled above, but catch edge cases)
    if (
      error.message?.includes("rate limit") ||
      error.message?.includes("429")
    ) {
      throw error; // Re-throw as-is
    }

    // Check if it's a network/CORS error
    if (
      error.message?.includes("fetch") ||
      error.message?.includes("Network") ||
      error.message?.includes("CORS") ||
      error.message?.includes("Failed to fetch")
    ) {
      throw new Error(
        "Network error. Please check your connection and ensure the backend is running."
      );
    }
    throw handleBackendError(error);
  }
};

/**
 * Get all temples from the backend
 * @returns {Promise<object>}
 */
export const getAllTemples = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/bookings/temples`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    let data;
    try {
      data = await parseJSON(response);
    } catch (parseError) {
      if (!response.ok) {
        throw new Error(
          `Server error (${response.status}): ${
            parseError.message || "Invalid response"
          }`
        );
      }
      throw parseError;
    }

    if (!response.ok) {
      throw new Error(
        data?.error?.message || data?.error || "Failed to fetch temples"
      );
    }

    return data;
  } catch (error) {
    throw handleBackendError(error);
  }
};

/**
 * Add members to an existing booking
 * @param {number} bookingId - Booking ID
 * @param {Array} members - Array of member objects
 * @returns {Promise<object>}
 */
export const addMembersToBooking = async (bookingId, members) => {
  try {
    const token =
      localStorage.getItem("lumine_token") ||
      sessionStorage.getItem("lumine_token");

    const response = await fetch(
      `${API_BASE_URL}/api/bookings/${bookingId}/members`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ members }),
      }
    );

    let data;
    try {
      data = await parseJSON(response);
    } catch (parseError) {
      if (!response.ok) {
        throw new Error(
          `Server error (${response.status}): ${
            parseError.message || "Invalid response"
          }`
        );
      }
      throw parseError;
    }

    if (!response.ok) {
      throw new Error(
        data?.error?.message ||
          data?.error ||
          "Failed to add members to booking"
      );
    }

    return data;
  } catch (error) {
    throw handleBackendError(error);
  }
};
