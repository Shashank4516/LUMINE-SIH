// src/services/ticketService.js

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

/**
 * Verify user by ID
 * @param {string|number} userId - User ID to verify
 * @returns {Promise<{success: boolean, user: object}>}
 */
export const verifyUser = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tickets/verify-user/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || data.error || "User verification failed");
    }

    return data;
  } catch (error) {
    throw handleBackendError(error);
  }
};

/**
 * Create ticket for registered user
 * @param {number} userId - User ID
 * @param {string} ticketType - Type of ticket (default: 'entry')
 * @param {string} notes - Optional notes
 * @param {string} issuedBy - Name of ticket counter person
 * @returns {Promise<{success: boolean, ticket: object}>}
 */
export const createTicket = async (userId, ticketType = "entry", notes = "", issuedBy = "") => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tickets/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        ticketType,
        notes,
        issuedBy,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || data.error || "Ticket creation failed");
    }

    return data;
  } catch (error) {
    throw handleBackendError(error);
  }
};

/**
 * Create ticket for walk-in (non-registered) user
 * @param {object} walkInData - Walk-in user data
 * @param {string} walkInData.fullName - Full name
 * @param {string} walkInData.phoneNumber - Phone number (10 digits)
 * @param {string} walkInData.email - Email (optional)
 * @param {string} walkInData.ticketType - Type of ticket (default: 'entry')
 * @param {string} walkInData.notes - Optional notes
 * @param {string} walkInData.issuedBy - Name of ticket counter person
 * @returns {Promise<{success: boolean, ticket: object}>}
 */
export const createWalkInTicket = async (walkInData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tickets/create-walkin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(walkInData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || data.error || "Walk-in ticket creation failed");
    }

    return data;
  } catch (error) {
    throw handleBackendError(error);
  }
};

/**
 * Get all tickets with optional filters
 * @param {object} filters - Filter options
 * @param {string} filters.status - Ticket status filter
 * @param {string} filters.ticketType - Ticket type filter
 * @param {boolean} filters.isWalkIn - Walk-in filter
 * @param {string} filters.startDate - Start date filter
 * @param {string} filters.endDate - End date filter
 * @param {number} filters.page - Page number
 * @param {number} filters.limit - Items per page
 * @returns {Promise<{success: boolean, tickets: array, pagination: object}>}
 */
export const getTickets = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.status) queryParams.append("status", filters.status);
    if (filters.ticketType) queryParams.append("ticketType", filters.ticketType);
    if (filters.isWalkIn !== undefined) queryParams.append("isWalkIn", filters.isWalkIn);
    if (filters.startDate) queryParams.append("startDate", filters.startDate);
    if (filters.endDate) queryParams.append("endDate", filters.endDate);
    if (filters.page) queryParams.append("page", filters.page);
    if (filters.limit) queryParams.append("limit", filters.limit);

    const url = `${API_BASE_URL}/api/tickets${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || data.error || "Failed to fetch tickets");
    }

    return data;
  } catch (error) {
    throw handleBackendError(error);
  }
};

/**
 * Get ticket statistics
 * @returns {Promise<{success: boolean, stats: object}>}
 */
export const getTicketStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tickets/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || data.error || "Failed to fetch ticket statistics");
    }

    return data;
  } catch (error) {
    throw handleBackendError(error);
  }
};

/**
 * Update ticket status
 * @param {number} ticketId - Ticket ID
 * @param {string} status - New status ('active', 'used', 'cancelled')
 * @returns {Promise<{success: boolean, ticket: object}>}
 */
export const updateTicketStatus = async (ticketId, status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tickets/${ticketId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || data.error || "Failed to update ticket status");
    }

    return data;
  } catch (error) {
    throw handleBackendError(error);
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

