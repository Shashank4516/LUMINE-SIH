import { useState, useEffect, useRef } from 'react';
import { getUserBookings } from '../services/bookingService';

// Helper to load booking from localStorage
const getLocalBooking = () => {
    try {
        const savedDataString = localStorage.getItem('lumine_active_booking');
        if (savedDataString && savedDataString !== 'null') {
            return JSON.parse(savedDataString);
        }
    } catch (e) {
        console.error('Failed to parse local booking', e);
    }
    return null;
};

const useBooking = () => {
    // Initialize with localStorage data immediately (no loading state)
    const localBooking = getLocalBooking();
    const [bookingData, setBookingData] = useState(localBooking);
    const [allBookings, setAllBookings] = useState(localBooking ? [localBooking] : []);
    const [loading, setLoading] = useState(false); // Start as false since we have local data
    const [error, setError] = useState(null);
    const isMounted = useRef(true);

    // Get current user
    const getCurrentUser = () => {
        try {
            const userStr = localStorage.getItem('lumine_user') || sessionStorage.getItem('lumine_user');
            if (userStr) {
                return JSON.parse(userStr);
            }
            return null;
        } catch (error) {
            console.error('Failed to parse user data', error);
            return null;
        }
    };

    // Fetch bookings from API (background refresh - don't show loading/error if we have local data)
    const fetchUserBookings = async (showLoading = false) => {
        try {
            // Only show loading if explicitly requested or no data yet
            if (showLoading || (!bookingData && allBookings.length === 0)) {
                setLoading(true);
            }
            setError(null);
            
            const user = getCurrentUser();
            if (!user || !user.id) {
                console.log('No user found, checking localStorage for active booking');
                // Fallback to localStorage if no user
                const savedDataString = localStorage.getItem('lumine_active_booking');
                if (savedDataString) {
                    const data = JSON.parse(savedDataString);
                    setBookingData(data);
                    setAllBookings([data]);
                } else {
                    setBookingData(null);
                    setAllBookings([]);
                }
                setLoading(false);
                return;
            }

            console.log('Fetching bookings for user:', user.id);
            console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000');
            
            try {
                const response = await getUserBookings(user.id);
            
            if (response && response.bookings && Array.isArray(response.bookings)) {
                const bookings = response.bookings;
                setAllBookings(bookings);
                
                // Get the most recent active booking (not cancelled)
                const activeBooking = bookings
                    .filter(booking => booking.status !== 'cancelled')
                    .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))[0];
                
                if (activeBooking) {
                    // Transform API response to match expected format
                    const transformedBooking = {
                        booking_id: activeBooking.bookingNumber || activeBooking.id,
                        date: activeBooking.visitDate || activeBooking.date,
                        time_slot: activeBooking.timeSlot || activeBooking.time_slot,
                        temple: activeBooking.temple || activeBooking.templeName,
                        members: activeBooking.members || [],
                        status: activeBooking.status || 'confirmed',
                        createdAt: activeBooking.createdAt,
                        ...activeBooking
                    };
                    setBookingData(transformedBooking);
                    // Also save to localStorage for backward compatibility
                    localStorage.setItem('lumine_active_booking', JSON.stringify(transformedBooking));
                } else {
                    setBookingData(null);
                    localStorage.removeItem('lumine_active_booking');
                }
            } else if (response && response.booking) {
                // Handle single booking response
                const booking = response.booking;
                const transformedBooking = {
                    booking_id: booking.bookingNumber || booking.id,
                    date: booking.visitDate || booking.date,
                    time_slot: booking.timeSlot || booking.time_slot,
                    temple: booking.temple || booking.templeName,
                    members: booking.members || [],
                    status: booking.status || 'confirmed',
                    ...booking
                };
                setBookingData(transformedBooking);
                setAllBookings([transformedBooking]);
                localStorage.setItem('lumine_active_booking', JSON.stringify(transformedBooking));
            } else {
                // Check localStorage as fallback
                const savedDataString = localStorage.getItem('lumine_active_booking');
                if (savedDataString) {
                    const data = JSON.parse(savedDataString);
                    setBookingData(data);
                    setAllBookings([data]);
                } else {
                    setBookingData(null);
                    setAllBookings([]);
                }
            }
            } catch (apiError) {
                console.error('API Error details:', apiError);
                throw apiError;
            }
        } catch (err) {
            console.error('Failed to fetch bookings from API:', err);
            
            // Only show error if it's not a network error or if we have no fallback data
            const savedDataString = localStorage.getItem('lumine_active_booking');
            const hasLocalData = savedDataString && savedDataString !== 'null';
            
            // Handle rate limiting (429 errors)
            if (err.message?.includes('rate limit') || err.message?.includes('busy')) {
                if (hasLocalData) {
                    console.log('Rate limited but using local data');
                    setError(null); // Don't show error if we have local data
                } else {
                    setError('Server is busy. Please wait a moment and try again.');
                }
            }
            // If it's a network error and we have local data, don't show error
            else if (err.message?.includes('Network error') || err.message?.includes('fetch') || err.message?.includes('Failed to fetch')) {
                if (hasLocalData) {
                    console.log('Network error but using local data');
                    setError(null); // Don't show error if we have local data
                } else {
                    setError('Unable to connect to server. Please check your connection.');
                }
            } else {
                setError(err.message || 'Failed to load bookings');
            }
            
            // Fallback to localStorage
            try {
                if (savedDataString && savedDataString !== 'null') {
                    const data = JSON.parse(savedDataString);
                    setBookingData(data);
                    setAllBookings([data]);
                } else {
                    setBookingData(null);
                    setAllBookings([]);
                }
            } catch (localError) {
                console.error('Failed to load booking data from localStorage', localError);
                setBookingData(null);
                setAllBookings([]);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserBookings();
        
        // Refresh bookings every 2 minutes (reduced from 30s to avoid rate limiting)
        const interval = setInterval(() => {
            fetchUserBookings();
        }, 120000); // 2 minutes

        // Also listen for storage events (when booking is created in another tab)
        const handleStorageChange = (e) => {
            if (e.key === 'lumine_active_booking' || e.key === 'lumine_user') {
                fetchUserBookings();
            }
        };
        window.addEventListener('storage', handleStorageChange);

        return () => {
            clearInterval(interval);
            window.removeEventListener('storage', handleStorageChange);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const downloadTicket = () => {
        window.print();
    };

    const cancelBooking = async () => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            try {
                // TODO: Call API to cancel booking
                // For now, just remove from localStorage and refresh
                localStorage.removeItem('lumine_active_booking');
                await fetchUserBookings();
            } catch (err) {
                console.error('Failed to cancel booking:', err);
                alert('Failed to cancel booking. Please try again.');
            }
        }
    };

    const refreshBookings = () => {
        fetchUserBookings();
    };

    return {
        bookingData,
        allBookings,
        loading,
        error,
        downloadTicket,
        cancelBooking,
        refreshBookings,
    };
};

export default useBooking;

