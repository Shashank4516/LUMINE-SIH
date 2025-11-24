// src/services/firebaseAuth.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc, query, where, collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// Check if Firebase is configured
const isFirebaseConfigured = auth !== null && db !== null;

/**
 * Register a new user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} fullName - User full name
 * @param {string} phoneNumber - User phone number
 * @param {string} role - User role (default: 'devotee')
 * @returns {Promise<{user: object, token: string}>}
 */
export const registerUser = async (email, password, fullName, phoneNumber, role = 'devotee') => {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Please add your Firebase credentials to .env file.');
  }
  
  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update user profile with display name
    await updateProfile(user, {
      displayName: fullName,
    });

    // Store additional user data in Firestore
    // This is where we store role, phone number, etc.
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      fullName: fullName,
      phoneNumber: phoneNumber,
      role: role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Get the ID token for your backend (if needed)
    // Get token with timeout to prevent hanging
    let token = null;
    try {
      token = await Promise.race([
        user.getIdToken(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Token retrieval timeout')), 5000)
        )
      ]);
    } catch (error) {
      console.warn('Token retrieval failed or timed out, continuing without token:', error);
      // Try to get token in background (non-blocking)
      user.getIdToken(true).then(t => {
        if (t) {
          // Update token in localStorage if available
          const storedUser = localStorage.getItem('lumine_user');
          if (storedUser) {
            localStorage.setItem('lumine_token', t);
          }
        }
      }).catch(() => {
        // Ignore background token retrieval errors
      });
    }

    return {
      user: {
        uid: user.uid,
        email: user.email,
        displayName: fullName,
        role: role,
        phoneNumber: phoneNumber,
      },
      token: token || 'pending', // Return a placeholder if token is null
    };
  } catch (error) {
    throw handleFirebaseError(error);
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
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Please add your Firebase credentials to .env file.');
  }
  
  try {
    let email = userId.trim();
    
    // Check if userId is email or phone number
    const isEmail = email.includes('@');
    
    // If it's a phone number, look up the email in Firestore
    if (!isEmail) {
      const phoneNumber = email;
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('phoneNumber', '==', phoneNumber));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error('No account found with this phone number. Please use your email address.');
      }
      
      // Get the first matching user's email
      const userDoc = querySnapshot.docs[0];
      email = userDoc.data().email;
    }

    // Sign in with email and password
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user data from Firestore to check role
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      throw new Error('User data not found. Please contact support.');
    }

    const userData = userDoc.data();
    const userRole = userData.role || 'devotee';

    // Validate role if specified
    if (role && userRole !== role) {
      await signOut(auth);
      const roleNames = {
        devotee: 'Devotee',
        mandir_admin: 'Admin',
        security_guard: 'Security',
        parking_incharge: 'Parking'
      };
      throw new Error(`Access denied. This account is registered as ${roleNames[userRole] || userRole}, not ${roleNames[role] || role}.`);
    }

    // Get the ID token
    const token = await user.getIdToken();

    // Determine redirect URL based on role
    const redirectUrls = {
      devotee: 'dashboard.html',
      mandir_admin: 'admindashboard.html',
      security_guard: 'security.html',
      parking_incharge: 'parking.html',
    };

    return {
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || userData.fullName,
        role: userRole,
        phoneNumber: userData.phoneNumber,
      },
      token: token,
      redirectUrl: redirectUrls[userRole] || 'dashboard.html',
    };
  } catch (error) {
    throw handleFirebaseError(error);
  }
};

/**
 * Sign out current user
 * @returns {Promise<void>}
 */
export const signOutUser = async () => {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Please add your Firebase credentials to .env file.');
  }
  
  try {
    await signOut(auth);
    // Clear local storage
    localStorage.removeItem('lumine_token');
    localStorage.removeItem('lumine_user');
    sessionStorage.removeItem('lumine_token');
    sessionStorage.removeItem('lumine_user');
  } catch (error) {
    throw handleFirebaseError(error);
  }
};

/**
 * Send password reset email
 * @param {string} email - User email
 * @returns {Promise<void>}
 */
export const resetPassword = async (email) => {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Please add your Firebase credentials to .env file.');
  }
  
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw handleFirebaseError(error);
  }
};

/**
 * Get current authenticated user
 * @returns {Promise<object|null>}
 */
export const getCurrentUser = async () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();
      if (user) {
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          resolve({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || userData.fullName,
            role: userData.role,
            phoneNumber: userData.phoneNumber,
          });
        } else {
          resolve({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          });
        }
      } else {
        resolve(null);
      }
    });
  });
};

/**
 * Handle Firebase errors and convert to user-friendly messages
 * @param {Error} error - Firebase error
 * @returns {Error}
 */
const handleFirebaseError = (error) => {
  const errorMessages = {
    'auth/email-already-in-use': 'This email is already registered. Please sign in instead.',
    'auth/invalid-email': 'Invalid email address. Please check and try again.',
    'auth/operation-not-allowed': 'Email/password accounts are not enabled. Please contact support.',
    'auth/weak-password': 'Password is too weak. Please use at least 8 characters.',
    'auth/user-disabled': 'This account has been disabled. Please contact support.',
    'auth/user-not-found': 'No account found with this email. Please register first.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/invalid-credential': 'Invalid email or password. Please check your credentials.',
    'auth/invalid-verification-code': 'Invalid verification code. Please try again.',
    'auth/code-expired': 'Verification code has expired. Please request a new one.',
  };

  const message = errorMessages[error.code] || error.message || 'An error occurred. Please try again.';
  const customError = new Error(message);
  customError.code = error.code;
  customError.originalError = error;
  return customError;
};

