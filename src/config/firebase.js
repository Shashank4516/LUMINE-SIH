// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
// These values will be updated from your Firebase project
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
};

// Check if Firebase is configured
const isFirebaseConfigured = firebaseConfig.apiKey && 
                              firebaseConfig.projectId && 
                              firebaseConfig.authDomain;

// Initialize Firebase only if configured
let app = null;
let auth = null;
let db = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error('Firebase initialization error:', error);
    // Set to null to indicate initialization failed
    app = null;
    auth = null;
    db = null;
  }
} else {
  // Only show warning in development mode
  if (import.meta.env.DEV) {
    console.log('%cFirebase Configuration', 'color: #f59e0b; font-weight: bold;');
    console.log('Firebase is not configured. To enable authentication:');
    console.log('1. Get your Firebase config from: https://console.firebase.google.com/');
    console.log('2. Add credentials to .env file');
    console.log('3. Restart the dev server');
    console.log('The app will work but authentication features will be disabled until configured.');
  }
}

// Export with fallback to prevent errors
export { auth, db };
export default app;

