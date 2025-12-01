import { useState, useEffect, useRef } from "react";
import { signOutUser } from "../services/backendAuth";

const UserProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Get user data from localStorage
    const loadUserData = () => {
      const userData = localStorage.getItem("lumine_user");
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    };

    loadUserData();

    // Listen for storage changes (when user data is updated)
    const handleStorageChange = (e) => {
      if (e.key === "lumine_user") {
        loadUserData();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom event if user data is updated in same tab
    window.addEventListener("userDataUpdated", loadUserData);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userDataUpdated", loadUserData);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await signOutUser();
      // Redirect to login page
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-10 h-10 rounded-full bg-saffron-50 dark:bg-gray-800 border border-saffron-200 dark:border-gray-700 hover:bg-saffron-100 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
        aria-label="User profile"
        title="User profile"
      >
        {user.displayName || user.fullName ? (
          <span className="text-saffron-700 dark:text-saffron-400 font-semibold text-sm">
            {(user.displayName || user.fullName)
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </span>
        ) : (
          <i className="ph ph-user text-saffron-700 dark:text-saffron-400 text-lg"></i>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden transition-all duration-200">
          {/* User Info Section */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-saffron-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                {user.displayName || user.fullName ? (
                  <span className="text-saffron-700 dark:text-saffron-400 font-semibold text-base">
                    {(user.displayName || user.fullName)
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </span>
                ) : (
                  <i className="ph ph-user text-saffron-700 dark:text-saffron-400 text-xl"></i>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">
                  {user.displayName || user.fullName || "User"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.email || ""}
                </p>
                {user.phoneNumber && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                    <i className="ph ph-phone text-xs mr-1"></i>
                    {user.phoneNumber}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Account
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                // Navigate to profile page or show profile modal
                console.log("View profile");
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <i className="ph ph-user-circle text-lg"></i>
              <span>My Profile</span>
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                // Navigate to bookings page
                console.log("View bookings");
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <i className="ph ph-calendar-check text-lg"></i>
              <span>My Bookings</span>
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                // Navigate to settings
                console.log("Settings");
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <i className="ph ph-gear text-lg"></i>
              <span>Settings</span>
            </button>
          </div>

          {/* Logout Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 py-2">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
            >
              <i className="ph ph-sign-out text-lg"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;
