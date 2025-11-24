# Firebase Setup Guide for LUMINE

This guide will help you set up Firebase authentication for your LUMINE temple management system. Don't worry, it's straightforward and we'll walk through it step by step.

## What's Already Done

Good news - most of the Firebase integration is already complete. Here's what's been set up for you:

1. **Firebase Configuration File** (`src/config/firebase.js`)

   - The file that connects your app to Firebase
   - Handles Firebase app initialization
   - Sets up authentication and database services

2. **Firebase Auth Service** (`src/services/firebaseAuth.js`)

   - Functions for user registration
   - Functions for user sign-in (works with both email and phone number)
   - Password reset functionality
   - User session management

3. **Updated Components**
   - Registration page now uses Firebase
   - Login form now uses Firebase
   - Forgot password page now uses Firebase

## What You Need to Do

### Step 1: Get Your Firebase Configuration

First, you need to get your Firebase project credentials. Here's how:

1. Open your web browser and go to the Firebase Console: https://console.firebase.google.com/
2. Find and click on your LUMINE project
3. Look for the gear icon (settings) in the top left, next to "Project Overview"
4. Click on "Project Settings"
5. Scroll down until you see a section called "Your apps"
6. If you don't see a web app listed, click the "Add app" button and select the web icon (looks like `</>`)
7. Give your app a name like "LUMINE Web" and click "Register app"
8. You'll see a configuration object with your Firebase credentials - you'll need these values

### Step 2: Add Credentials to Your .env File

Now you need to add those Firebase credentials to your project:

1. In your project folder, find the `.env` file (it's in the root directory, same level as `package.json`)
2. Open it in any text editor
3. You'll see placeholders for each credential. Replace them with the actual values from Firebase:

```
VITE_FIREBASE_API_KEY=your-api-key-from-firebase
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

4. Save the file

### Step 3: Enable Email/Password Authentication

Firebase needs to know that you want to allow users to sign in with email and password:

1. In the Firebase Console, go to "Authentication" in the left sidebar
2. Click on "Sign-in method" tab
3. Find "Email/Password" in the list
4. Click on it and toggle the "Enable" switch to ON
5. Click "Save"

### Step 4: Create Your Firestore Database

Firestore is where we store user information like names, phone numbers, and roles:

1. In Firebase Console, click on "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" for now (you can change this later)
4. Select a location closest to your users (like "us-central" or "asia-south1" for India)
5. Click "Enable"

The security rules are already configured in your project's `firestore.rules` file. These rules ensure users can only access their own data, and admins can see all users.

### Step 5: Restart Your Development Server

After adding your Firebase credentials:

1. Stop your current development server (press Ctrl+C in the terminal where it's running)
2. Start it again with `npm run dev`
3. The Firebase warning should disappear, and authentication should work

## How It All Works

### When Someone Registers

1. User fills out the registration form with their name, phone, email, and password
2. The app creates their account in Firebase Authentication
3. Their profile information (name, phone, role) gets saved in Firestore database
4. A token is stored so they stay logged in

### When Someone Logs In

1. User enters their email (or phone number) and password
2. Firebase checks if the credentials are correct
3. The app fetches the user's role from Firestore
4. If the user selected the wrong role (like trying to log in as admin when they're a devotee), they'll get an error
5. If everything matches, they're logged in and redirected to the right dashboard

### When Someone Forgets Their Password

1. User enters their email address
2. Firebase sends them a password reset email
3. They click the link in the email
4. They can set a new password

## Data Structure in Firestore

Each user's information is stored in Firestore like this:

```
/users/{userId}
{
  uid: "unique-user-id",
  email: "user@example.com",
  fullName: "User Name",
  phoneNumber: "1234567890",
  role: "devotee" (or "mandir_admin", "security_guard", "parking_incharge"),
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

## Testing Your Setup

Once everything is configured, try these things to make sure it's working:

1. **Test Registration**: Create a new account through the registration form
2. **Test Login**: Sign in with the account you just created
3. **Test Password Reset**: Click "Forgot password" and enter your email
4. **Test Role Validation**: Try logging in as a different role than what your account has (it should show an error)

## Troubleshooting

If something isn't working:

- Make sure you've restarted your dev server after adding the `.env` file
- Check the browser console for any error messages
- Verify that Email/Password authentication is enabled in Firebase Console
- Make sure your Firestore database is created
- Double-check that all values in your `.env` file are correct (no extra spaces or quotes)

## Additional Resources

If you need more help or want to learn more:

- Firebase Authentication Documentation: https://firebase.google.com/docs/auth
- Firestore Documentation: https://firebase.google.com/docs/firestore
- Firebase Security Rules Guide: https://firebase.google.com/docs/firestore/security/get-started

That's it! Your Firebase authentication should now be fully set up and working.
