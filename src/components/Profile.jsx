import { useState, useEffect } from "react";
import { getUserBookings } from "../services/bookingService";
import HeaderSmall from "./slot-booking/HeaderSmall";

const Profile = ({ onBack }) => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load user data from localStorage or sessionStorage
    const loadUserData = () => {
      const userData =
        localStorage.getItem("lumine_user") ||
        sessionStorage.getItem("lumine_user");
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          // Fetch bookings for this user
          if (parsedUser.id) {
            fetchBookings(parsedUser.id);
          } else {
            setError("User ID not found. Please login again.");
            setLoading(false);
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
          setError("Failed to load user data");
          setLoading(false);
        }
      } else {
        setError("User not found. Please login again.");
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const fetchBookings = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserBookings(userId);
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError(err.message || "Failed to load booking history");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatTime = (timeSlot) => {
    if (!timeSlot) return "N/A";
    // If timeSlot is already formatted, return it
    if (timeSlot.includes(":")) {
      return timeSlot;
    }
    return timeSlot;
  };

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase() || "unknown";
    const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold";

    switch (statusLower) {
      case "confirmed":
        return (
          <span
            className={`${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400`}
          >
            Confirmed
          </span>
        );
      case "pending":
        return (
          <span
            className={`${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400`}
          >
            Pending
          </span>
        );
      case "cancelled":
        return (
          <span
            className={`${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400`}
          >
            Cancelled
          </span>
        );
      default:
        return (
          <span
            className={`${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`}
          >
            {status || "Unknown"}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-[#fdfbf7] dark:bg-gray-900 font-sans">
        <HeaderSmall />
        <main className="flex-1 overflow-y-auto pb-20 custom-scrollbar">
          <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-600 mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">
                  Loading booking history...
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#fdfbf7] dark:bg-gray-900 font-sans text-[#012a4a] dark:text-gray-100">
      <HeaderSmall />

      <main className="flex-1 overflow-y-auto pb-20 custom-scrollbar">
        <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-saffron-600 dark:hover:text-saffron-400 transition-colors"
          >
            <i className="ph ph-arrow-left text-xl"></i>
            <span className="font-medium">Back</span>
          </button>

          {/* Profile Header */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden mb-6">
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-saffron-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                  {user?.displayName || user?.fullName ? (
                    <span className="text-saffron-700 dark:text-saffron-400 font-semibold text-2xl">
                      {(user.displayName || user.fullName)
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </span>
                  ) : (
                    <i className="ph ph-user text-saffron-700 dark:text-saffron-400 text-3xl"></i>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                    {user?.displayName || user?.fullName || "User"}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                    {user?.email || ""}
                  </p>
                  {user?.phoneNumber && (
                    <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">
                      <i className="ph ph-phone text-xs mr-1"></i>
                      {user.phoneNumber}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* My Bookings Section */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 md:p-8 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <i className="ph ph-calendar-check text-saffron-600 dark:text-saffron-400"></i>
                My Bookings
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                View your booking history and details
              </p>
            </div>

            <div className="p-6 md:p-8">
              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-800 dark:text-red-400 text-sm">
                    {error}
                  </p>
                </div>
              )}

              {bookings.length === 0 && !error ? (
                <div className="text-center py-12">
                  <i className="ph ph-calendar-x text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
                  <p className="text-gray-600 dark:text-gray-400 text-lg font-medium mb-2">
                    No bookings found
                  </p>
                  <p className="text-gray-500 dark:text-gray-500 text-sm">
                    You haven't made any bookings yet. Start booking your temple
                    visit now!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow bg-gray-50 dark:bg-gray-900/50"
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                {booking.temple?.name || "Temple"}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Booking #:{" "}
                                <span className="font-mono font-medium">
                                  {booking.bookingNumber}
                                </span>
                              </p>
                            </div>
                            {getStatusBadge(booking.status)}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                            <div className="flex items-center gap-2 text-sm">
                              <i className="ph ph-calendar text-saffron-600 dark:text-saffron-400"></i>
                              <span className="text-gray-600 dark:text-gray-400">
                                Date:
                              </span>
                              <span className="font-medium text-gray-900 dark:text-gray-100">
                                {formatDate(booking.bookingDate)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <i className="ph ph-clock text-saffron-600 dark:text-saffron-400"></i>
                              <span className="text-gray-600 dark:text-gray-400">
                                Time:
                              </span>
                              <span className="font-medium text-gray-900 dark:text-gray-100">
                                {formatTime(booking.timeSlot)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <i className="ph ph-users text-saffron-600 dark:text-saffron-400"></i>
                              <span className="text-gray-600 dark:text-gray-400">
                                Members:
                              </span>
                              <span className="font-medium text-gray-900 dark:text-gray-100">
                                {booking.totalMembers ||
                                  booking.members?.length ||
                                  0}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <i className="ph ph-map-pin text-saffron-600 dark:text-saffron-400"></i>
                              <span className="text-gray-600 dark:text-gray-400">
                                Location:
                              </span>
                              <span className="font-medium text-gray-900 dark:text-gray-100">
                                {booking.temple?.location || "N/A"}
                              </span>
                            </div>
                          </div>

                          {/* Members List */}
                          {booking.members && booking.members.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                Members
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {booking.members.map((member, index) => (
                                  <div
                                    key={index}
                                    className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                                  >
                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                      {member.name}
                                    </span>
                                    {member.age && (
                                      <span className="text-gray-500 dark:text-gray-400 ml-2">
                                        ({member.age} years)
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                        <p>
                          Booked on: {formatDate(booking.createdAt)} at{" "}
                          {booking.createdAt
                            ? new Date(booking.createdAt).toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
