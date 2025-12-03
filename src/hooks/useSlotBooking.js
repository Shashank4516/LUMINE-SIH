import { useState, useEffect } from "react";
import { createBooking, getAllTemples } from "../services/bookingService";

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
  const [temple, setTemple] = useState(""); // Store temple name for display
  const [templeId, setTempleId] = useState(null); // Store database ID for submission
  const [selectedTempleId, setSelectedTempleId] = useState(""); // Store selected ID for select value
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [members, setMembers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [error, setError] = useState(null);
  const [temples, setTemples] = useState([]);
  const [templeData, setTempleData] = useState({});

  // Fetch temples from backend on mount
  useEffect(() => {
    const fetchTemples = async () => {
      try {
        console.log("Fetching temples from backend...");
        const response = await getAllTemples();
        console.log("Temples fetched:", response);

        if (response.temples && Array.isArray(response.temples)) {
          setTemples(response.temples);

          // Build dynamic mapping from backend data
          const mapping = {};
          response.temples.forEach((temple) => {
            // Map by ID (for direct ID access)
            mapping[temple.id] = temple.id;

            // Map by name variations for backward compatibility
            const nameLower = temple.name.toLowerCase();
            if (nameLower.includes("somnath")) {
              mapping["somnath"] = temple.id;
              mapping["Somnath Temple"] = temple.id;
            }
            if (
              nameLower.includes("dwarka") ||
              nameLower.includes("dwarkadhish")
            ) {
              mapping["dwarka"] = temple.id;
              mapping["Dwarkadhish Temple"] = temple.id;
              mapping["Dwarka Temple"] = temple.id;
            }
            if (nameLower.includes("nageshwar")) {
              mapping["nageshwar"] = temple.id;
              mapping["Nageshwar Jyotirlinga"] = temple.id;
              mapping["Nageshwar Temple"] = temple.id;
            }
            if (nameLower.includes("rukmini")) {
              mapping["Rukmini Devi Temple"] = temple.id;
            }

            // Also map by exact name
            mapping[temple.name] = temple.id;
          });

          console.log("Temple mapping created:", mapping);
          setTempleData(mapping);
        }
      } catch (error) {
        console.error("Error fetching temples:", error);
        // Fallback to hardcoded mapping if API fails
        setTempleData({
          somnath: 1,
          dwarka: 2,
          nageshwar: 3,
          "Somnath Temple": 1,
          "Dwarkadhish Temple": 2,
          "Nageshwar Jyotirlinga": 3,
          "Rukmini Devi Temple": 4,
        });
      }
    };

    fetchTemples();
  }, []);

  // Update temple name when temples are loaded and a templeId is set but name is missing
  useEffect(() => {
    if (templeId && !temple && temples.length > 0) {
      const foundTemple = temples.find(
        (t) => t.id === templeId || Number(t.id) === Number(templeId)
      );
      if (foundTemple) {
        console.log(
          "✅ Updating temple name for previously selected ID:",
          templeId,
          "->",
          foundTemple.name
        );
        setTemple(foundTemple.name);
      }
    }
  }, [temples, templeId, temple]);

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
            email: user.email || "",
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

  const handleTempleChange = (value, templeNameFromSelect = null) => {
    console.log(
      "handleTempleChange called with value:",
      value,
      "name:",
      templeNameFromSelect
    );
    console.log("Current temples array:", temples);

    // Value is the database ID directly (number or string)
    const templeIdNum = value ? Number(value) : null;
    setSelectedTempleId(value || "");

    if (!templeIdNum) {
      setTemple("");
      setTempleId(null);
      return;
    }

    // Priority 1: Use the name from the select option (most reliable)
    if (templeNameFromSelect && templeNameFromSelect !== "Select a temple") {
      console.log(
        "✅ Using temple name from select option:",
        templeNameFromSelect
      );
      setTemple(templeNameFromSelect);
      setTempleId(templeIdNum);
      return;
    }

    // Priority 2: Find the temple name from temples array
    let selectedTemple = temples.find(
      (t) => t.id === templeIdNum || t.id.toString() === value.toString()
    );

    // If not found in temples array, try to find by ID with type coercion
    if (!selectedTemple && temples.length > 0) {
      selectedTemple = temples.find((t) => Number(t.id) === templeIdNum);
    }

    if (selectedTemple) {
      const templeName = selectedTemple.name;
      console.log("✅ Selected temple from array:", {
        id: templeIdNum,
        name: templeName,
        value: value,
      });

      // Store both the ID (for backend) and name (for display)
      setTemple(templeName);
      setTempleId(templeIdNum);
    } else {
      console.warn(
        "⚠️ Temple not found for ID:",
        templeIdNum,
        "in temples:",
        temples
      );
      // Even if not found, store the ID so we can look it up later
      setTempleId(templeIdNum);
      // Set empty name - will be updated when temples load or on next selection
      setTemple("");
    }
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

  // Submit booking to Backend API
  const submitBooking = async () => {
    console.log("submitBooking called");
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate member names first
      const nameErrors = {};
      let hasNameErrors = false;

      members.forEach((member, index) => {
        const memberName = member.name?.trim();
        if (!memberName || memberName === "") {
          nameErrors[member.id] = "Name is required";
          hasNameErrors = true;
        }
      });

      if (hasNameErrors) {
        setMembers(
          members.map((member) => ({
            ...member,
            nameError: nameErrors[member.id] || "",
          }))
        );
        setError("Please fill in all member names before submitting");
        setIsSubmitting(false);
        return;
      }

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

      // Generate booking number
      const bookingNumber = generateBookingNumber();

      // Validate required fields - templeId should be set directly from selection
      let finalTempleId = templeId;

      // If templeId is not set but temple name is, try to find it
      if (!finalTempleId && temple) {
        const matchedTemple = temples.find(
          (t) =>
            t.name.toLowerCase() === temple.toLowerCase() ||
            t.name.toLowerCase().includes(temple.toLowerCase()) ||
            temple.toLowerCase().includes(t.name.toLowerCase().split(" ")[0])
        );
        if (matchedTemple) {
          finalTempleId = matchedTemple.id;
          console.log(
            `Found temple by name: ${matchedTemple.name} (ID: ${matchedTemple.id})`
          );
          setTempleId(matchedTemple.id);
        }
      }

      console.log(
        "🔍 Validation check - temple:",
        temple,
        "templeId:",
        templeId,
        "finalTempleId:",
        finalTempleId,
        "available temples:",
        temples.map((t) => ({ id: t.id, name: t.name }))
      );

      if (!finalTempleId || !temple) {
        const errorMsg = `Please select a temple. Available temples: ${temples
          .map((t) => t.name)
          .join(", ")}`;
        console.error("❌ Temple validation failed:", {
          temple,
          templeId,
          finalTempleId,
        });
        setError(errorMsg);
        setIsSubmitting(false);
        alert(errorMsg);
        return;
      }

      // Ensure finalTempleId is a number
      finalTempleId = Number(finalTempleId);
      if (isNaN(finalTempleId) || finalTempleId <= 0) {
        const errorMsg = `Invalid temple ID: ${finalTempleId}. Please select a temple again.`;
        console.error("❌ Invalid temple ID:", finalTempleId);
        setError(errorMsg);
        setIsSubmitting(false);
        alert(errorMsg);
        return;
      }

      if (!user?.id) {
        setError("User information not found. Please log in again.");
        setIsSubmitting(false);
        alert("User information not found. Please log in again.");
        return;
      }

      if (!date) {
        setError("Please select a date");
        setIsSubmitting(false);
        alert("Please select a date before confirming your booking.");
        return;
      }

      if (!timeSlot) {
        setError("Please select a time slot");
        setIsSubmitting(false);
        alert("Please select a time slot before confirming your booking.");
        return;
      }

      // Validate members array is not empty
      if (!members || members.length === 0) {
        setError("At least one member is required");
        setIsSubmitting(false);
        alert("At least one member is required for booking.");
        return;
      }

      // Prepare booking data with proper type conversion
      const bookingData = {
        bookingNumber: bookingNumber,
        templeId: finalTempleId, // Already validated as a number
        bookingDate: date,
        timeSlot: timeSlot,
        totalMembers: members.length,
        userId: Number(user.id), // Ensure it's a number
        members: members.map((member, index) => {
          // Parse age properly - only include if it's a valid number
          let parsedAge = undefined;
          if (member.age && member.age.toString().trim() !== "") {
            const ageNum = parseInt(member.age);
            if (!isNaN(ageNum) && ageNum > 0) {
              parsedAge = ageNum;
            }
          }

          // Build member object, only including defined values
          const memberObj = {
            name: member.name || "",
          };

          // Only add age if it's a valid number
          if (parsedAge !== undefined) {
            memberObj.age = parsedAge;
          }

          // Add optional fields only if they have values
          if (member.gender && member.gender.trim() !== "") {
            memberObj.gender = member.gender;
          }

          // Handle email - use empty string for primary member if no email, or member email
          const memberEmail =
            index === 0
              ? user?.email
                ? user.email.trim().toLowerCase()
                : ""
              : member.email
              ? member.email.trim().toLowerCase()
              : "";

          memberObj.email = memberEmail;

          if (member.aadhaar && member.aadhaar.trim() !== "") {
            memberObj.aadhaar = member.aadhaar;
          }

          if (member.isVerified !== undefined) {
            memberObj.isVerified = member.isVerified;
          }

          return memberObj;
        }),
      };

      console.log("📤 Submitting booking:", bookingData);
      console.log("📋 Booking Details:");
      console.log(
        "   - Temple ID:",
        finalTempleId,
        "(type:",
        typeof finalTempleId,
        ")"
      );
      console.log("   - Temple Name:", temple);
      console.log("   - User ID:", user.id, "(type:", typeof user.id, ")");
      console.log("   - Date:", date);
      console.log("   - Time Slot:", timeSlot);
      console.log("   - Total Members:", members.length);
      console.log("   - Booking Number:", bookingNumber);

      // Save to Backend API using bookingService
      console.log("📤 Sending booking data to backend...");
      const result = await createBooking(bookingData);

      console.log("✅ Booking created:", result);
      console.log("✅ Booking ID:", result.booking?.id);
      console.log(
        "✅ Booking Number:",
        result.booking?.bookingNumber || bookingNumber
      );
      console.log("✅ Data has been saved to PostgreSQL database (pgAdmin)");

      // Store the booking result
      setBookingResult({
        id: result.booking?.id || bookingNumber,
        bookingNumber: result.booking?.bookingNumber || bookingNumber,
        ...bookingData,
        createdAt: new Date().toISOString(),
      });
      setShowSuccess(true);

      console.log("✅ Success overlay displayed - Booking confirmed!");
    } catch (err) {
      console.error("Booking error:", err);
      const errorMessage =
        err.message || "Failed to create booking. Please try again.";
      setError(errorMessage);

      // Show detailed error in alert
      alert(errorMessage);

      // Also log the full error for debugging
      if (err.response) {
        console.error("Full error response:", err.response);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset the form for a new booking
  const resetBooking = () => {
    setCurrentStep(1);
    setTemple("");
    setTempleId(null);
    setSelectedTempleId("");
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
            email: user.email || "",
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
    selectedTempleId, // Export for select value binding
    date,
    timeSlot,
    members,
    isSubmitting,
    showSuccess,
    bookingResult,
    error,
    temples, // Export temples for use in components
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
