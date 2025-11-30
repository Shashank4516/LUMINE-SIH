import { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";

// Generate booking number
const generateBookingNumber = () => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `LUM${dateStr}${random}`;
};

const useSlotBooking = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [temple, setTemple] = useState("");
  const [templeId, setTempleId] = useState(null);
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [members, setMembers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [error, setError] = useState(null);

  // Temple data mapping (you can also fetch this from API)
  const templeData = {
    "Somnath Temple": 1,
    "Dwarkadhish Temple": 2,
    "Nageshwar Jyotirlinga": 3,
    "Rukmini Devi Temple": 4,
  };

  // Initialize with the registered user as the first member
  useEffect(() => {
    const userData = localStorage.getItem("lumine_user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setMembers([
          {
            id: Date.now(),
            name: user.displayName || user.fullName || "",
            age: "",
            gender: "",
            aadhaar: "",
            isVerified: false,
          },
        ]);
      } catch (error) {
        console.error("Error parsing user data:", error);
        // Initialize with empty member if parsing fails
        setMembers([
          {
            id: Date.now(),
            name: "",
            age: "",
            gender: "",
            email: "",
            aadhaar: "",
            isVerified: false,
          },
        ]);
      }
    } else {
      // Initialize with empty member if no user data
      setMembers([
        {
          id: Date.now(),
          name: "",
          age: "",
          gender: "",
          email: "",
          aadhaar: "",
          isVerified: false,
        },
      ]);
    }
  }, []);

  const handleTempleChange = (value) => {
    setTemple(value);
    // Set temple ID based on temple name
    setTempleId(templeData[value] || null);
  };

  const handleDateChange = (value) => {
    setDate(value);
  };

  const handleTimeChange = (value) => {
    setTimeSlot(value);
  };

  const addMember = () => {
    setMembers([
      ...members,
      {
        id: Date.now(),
        name: "",
        age: "",
        gender: "",
        email: "",
        aadhaar: "",
        isVerified: false,
      },
    ]);
  };

  const removeMember = (id) => {
    setMembers(members.filter((member) => member.id !== id));
  };

  const updateMember = (id, field, value) => {
    setMembers(
      members.map((member) => {
        if (member.id === id) {
          const updatedMember = { ...member, [field]: value };

          // Validate email if it's the email field
          if (field === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const trimmedEmail = value.trim().toLowerCase();

            // Get primary user's email for comparison
            const userData = localStorage.getItem("lumine_user");
            const user = userData ? JSON.parse(userData) : null;
            const primaryUserEmail = user?.email?.trim().toLowerCase();

            // Check if email is valid format
            if (trimmedEmail && !emailRegex.test(trimmedEmail)) {
              updatedMember.emailError = "Invalid email format";
            }
            // Check if email matches primary user's email
            else if (
              trimmedEmail &&
              primaryUserEmail &&
              trimmedEmail === primaryUserEmail
            ) {
              updatedMember.emailError =
                "This email is already used by the primary member";
            }
            // Check if email is already used by another member
            else if (
              trimmedEmail &&
              members.some(
                (m) =>
                  m.id !== id &&
                  m.email &&
                  m.email.trim().toLowerCase() === trimmedEmail
              )
            ) {
              updatedMember.emailError =
                "This email is already used by another member";
            }
            // Clear error if email is valid and unique
            else {
              updatedMember.emailError = "";
            }
          }

          return updatedMember;
        }
        return member;
      })
    );
  };

  const verifyAadhaar = async (id) => {
    const member = members.find((m) => m.id === id);
    if (!member || !member.aadhaar) return;

    // Simulate Aadhaar verification
    // In production, this would call an Aadhaar verification API
    setTimeout(() => {
      setMembers(
        members.map((m) => (m.id === id ? { ...m, isVerified: true } : m))
      );
    }, 1000);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Submit booking to Firebase Firestore
  const submitBooking = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate all members have unique emails (skip primary member - index 0)
      const emailSet = new Set();
      const emailErrors = {};
      let hasErrors = false;

      // Add primary user's email to the set
      const userData = localStorage.getItem("lumine_user");
      const user = userData ? JSON.parse(userData) : null;
      if (user?.email) {
        emailSet.add(user.email.trim().toLowerCase());
      }

      members.forEach((member, index) => {
        // Skip validation for primary member (index 0)
        if (index === 0) return;

        const email = member.email?.trim().toLowerCase();
        if (!email) {
          emailErrors[member.id] = "Email is required";
          hasErrors = true;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          emailErrors[member.id] = "Invalid email format";
          hasErrors = true;
        } else if (emailSet.has(email)) {
          emailErrors[member.id] = "This email is already used";
          hasErrors = true;
        } else {
          emailSet.add(email);
        }
      });

      if (hasErrors) {
        // Update members with errors
        setMembers(
          members.map((member) => ({
            ...member,
            emailError: emailErrors[member.id] || "",
          }))
        );
        setError("Please fix email errors before submitting");
        setIsSubmitting(false);
        return;
      }

      // Get user data (already retrieved above)

      // Generate booking number
      const bookingNumber = generateBookingNumber();

      // Prepare booking data
      const bookingData = {
        bookingNumber: bookingNumber,
        templeName: temple,
        templeId: templeId,
        bookingDate: date,
        timeSlot: timeSlot,
        totalMembers: members.length,
        members: members.map((member, index) => ({
          name: member.name,
          age: member.age ? parseInt(member.age) : null,
          gender: member.gender || null,
          // Primary member (index 0) uses user's email, others use their own email
          email:
            index === 0
              ? user?.email
                ? user.email.trim().toLowerCase()
                : null
              : member.email
              ? member.email.trim().toLowerCase()
              : null,
          aadhaar: member.aadhaar || null,
          isVerified: member.isVerified || false,
        })),
        status: "confirmed",
        userId: user?.uid || null,
        userEmail: user?.email || null,
        userName: user?.displayName || null,
        createdAt: serverTimestamp(),
      };

      console.log("Submitting booking:", bookingData);

      // Save to Firebase Firestore
      const docRef = await addDoc(collection(db, "bookings"), bookingData);

      console.log("Booking created with ID:", docRef.id);

      // Store the booking result
      setBookingResult({
        id: docRef.id,
        bookingNumber: bookingNumber,
        ...bookingData,
      });
      setShowSuccess(true);
    } catch (err) {
      console.error("Booking error:", err);
      setError(err.message || "Failed to create booking. Please try again.");
      alert(err.message || "Failed to create booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset the form for a new booking
  const resetBooking = () => {
    setCurrentStep(1);
    setTemple("");
    setTempleId(null);
    setDate("");
    setTimeSlot("");
    setShowSuccess(false);
    setBookingResult(null);
    setError(null);

    // Reset members to initial state
    const userData = localStorage.getItem("lumine_user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setMembers([
          {
            id: Date.now(),
            name: user.displayName || user.fullName || "",
            age: "",
            gender: "",
            aadhaar: "",
            isVerified: false,
          },
        ]);
      } catch {
        setMembers([
          {
            id: Date.now(),
            name: "",
            age: "",
            gender: "",
            email: "",
            aadhaar: "",
            isVerified: false,
          },
        ]);
      }
    }
  };

  return {
    currentStep,
    totalSteps,
    temple,
    templeId,
    date,
    timeSlot,
    members,
    isSubmitting,
    showSuccess,
    bookingResult,
    error,
    handleTempleChange,
    handleDateChange,
    handleTimeChange,
    addMember,
    removeMember,
    updateMember,
    verifyAadhaar,
    nextStep,
    prevStep,
    submitBooking,
    resetBooking,
  };
};

export default useSlotBooking;
