# LUMINE - Temple Management System

LUMINE is a modern web application for managing temple operations, services, and user interactions. It provides a unified dashboard for devotees, temple administrators, security staff, and parking management.

## What is LUMINE?

LUMINE is a comprehensive temple management system that handles:

- User authentication and registration for devotees
- Role-based access control for different user types
- Multi-language support (English and Hindi)
- Secure login system with Firebase integration
- Password reset functionality
- User profile management

## Project Overview

This is a React-based single-page application built with modern web technologies. The project uses Firebase for authentication and data storage, providing a secure and scalable backend solution.

## Technology Stack

- **React 19.2.0** - Modern UI library for building user interfaces
- **Vite 7.2.4** - Fast build tool and development server
- **Firebase 12.6.0** - Backend services for authentication and database
- **Tailwind CSS** - Utility-first CSS framework (via CDN)
- **Phosphor Icons** - Icon library for UI elements

## Project Structure

Here's how the project is organized:

```
LUMINE/
├── public/                 # Static assets served directly
│   └── vite.svg           # Vite logo
│
├── src/                    # Main source code directory
│   ├── assets/            # Images, fonts, and other assets
│   │
│   ├── components/        # React components
│   │   ├── Footer.jsx           # Page footer component
│   │   ├── ForgotPassword.jsx   # Password reset form
│   │   ├── Header.jsx           # Top navigation bar
│   │   ├── LanguageSwitcher.jsx  # Language toggle (EN/HI)
│   │   ├── LoginForm.jsx        # Main login form
│   │   ├── Registration.jsx     # User registration form
│   │   ├── RoleSelector.jsx     # Role selection buttons
│   │   └── WelcomeSection.jsx   # Welcome message and features
│   │
│   ├── config/            # Configuration files
│   │   └── firebase.js    # Firebase initialization and setup
│   │
│   ├── constants/         # Constant values and data
│   │   └── translations.js  # Multi-language text content
│   │
│   ├── services/          # Business logic and API calls
│   │   └── firebaseAuth.js   # Firebase authentication functions
│   │
│   ├── App.jsx            # Main application component
│   └── main.jsx           # Application entry point
│
├── .env                   # Environment variables (Firebase config)
├── .gitignore            # Files to exclude from version control
├── eslint.config.js      # ESLint configuration for code quality
├── firebase.json         # Firebase project configuration
├── firestore.rules      # Firestore database security rules
├── firestore.indexes.json # Firestore database indexes
├── index.html            # HTML template
├── package.json          # Project dependencies and scripts
├── vite.config.js        # Vite build tool configuration
│
├── FIREBASE_SETUP.md     # Firebase setup instructions
└── PROJECT.md            # This file - project documentation
```

## Key Files Explained

### Entry Point
- **main.jsx** - This is where React starts. It renders the App component into the HTML page.

### Main Application
- **App.jsx** - The root component that manages the overall application state, handles routing between different views (login, registration, forgot password), and coordinates language and role selection.

### Components

**Header.jsx**
- Displays the top navigation bar
- Shows the LUMINE logo and temple name
- Contains the language switcher

**LoginForm.jsx**
- Main login interface
- Handles user authentication
- Supports multiple user roles (devotee, admin, security, parking)
- Includes form validation and error handling

**Registration.jsx**
- New user registration form
- Collects user information (name, phone, email, password)
- Validates input and creates Firebase accounts

**ForgotPassword.jsx**
- Password reset functionality
- Multi-step process for password recovery
- Sends reset emails via Firebase

**RoleSelector.jsx**
- Allows users to select their role before logging in
- Shows different roles with icons
- Updates the login form based on selected role

**WelcomeSection.jsx**
- Displays welcome message and feature highlights
- Only visible on larger screens (hidden on mobile)
- Shows temple branding and key features

**LanguageSwitcher.jsx**
- Toggles between English and Hindi
- Updates all text content throughout the app

**Footer.jsx**
- Simple footer with copyright information

### Configuration

**firebase.js**
- Initializes Firebase connection
- Sets up authentication and Firestore database
- Handles Firebase configuration from environment variables

**translations.js**
- Contains all text content in English and Hindi
- Defines user roles and their properties
- Centralized location for all translatable strings

### Services

**firebaseAuth.js**
- Contains all Firebase authentication functions
- Handles user registration, login, logout, and password reset
- Manages user data in Firestore
- Provides error handling and user-friendly error messages

## User Roles

The system supports four different user roles:

1. **Devotee** - Regular temple visitors who can book services and make donations
2. **Mandir Admin** - Temple administrators who manage operations and reports
3. **Security Guard** - Security staff who manage entry/exit logs
4. **Parking Incharge** - Staff who manage parking slots and vehicle entries

Each role has its own login interface and redirects to a different dashboard after authentication.

## Features

### Authentication
- Secure email/password authentication via Firebase
- Phone number support for login
- Password reset via email
- Remember me functionality
- Session and persistent login options

### Multi-language Support
- English and Hindi language support
- All UI text is translatable
- Language preference can be switched anytime

### Responsive Design
- Works on desktop, tablet, and mobile devices
- Mobile-first approach
- Adaptive layouts for different screen sizes

### Form Validation
- Real-time input validation
- Clear error messages
- Password strength requirements
- Email format validation
- Phone number validation

## Getting Started

### Prerequisites

Before you start, make sure you have:

- Node.js installed (version 16 or higher recommended)
- npm or yarn package manager
- A Firebase project set up (see FIREBASE_SETUP.md)

### Installation

1. Clone or download the project
2. Open a terminal in the project directory
3. Install dependencies:

```bash
npm install
```

### Configuration

1. Copy the `.env` file template (if it doesn't exist, create one)
2. Add your Firebase credentials to the `.env` file
3. See FIREBASE_SETUP.md for detailed instructions

### Running the Development Server

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in your terminal).

### Building for Production

Create a production build:

```bash
npm run build
```

The built files will be in the `dist` folder, ready to deploy to any static hosting service.

### Preview Production Build

Test the production build locally:

```bash
npm run preview
```

## Development Workflow

### Adding New Features

1. Create new components in the `src/components` folder
2. Add translations to `src/constants/translations.js` if needed
3. Import and use components in `App.jsx` or other components
4. Test thoroughly before committing

### Styling

The project uses Tailwind CSS via CDN. You can:

- Use Tailwind utility classes directly in components
- Customize colors in `index.html` (saffron theme colors are already configured)
- Add custom CSS in the `<style>` tag in `index.html` if needed

### Code Quality

The project uses ESLint for code quality. Run the linter:

```bash
npm run lint
```

## Environment Variables

The `.env` file contains sensitive Firebase configuration. Never commit this file to version control. Required variables:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## Firebase Integration

The project uses Firebase for:

- **Authentication** - User login, registration, password reset
- **Firestore Database** - Storing user profiles and data
- **Security Rules** - Defined in `firestore.rules`

See FIREBASE_SETUP.md for complete Firebase setup instructions.

## Common Tasks

### Adding a New Language

1. Open `src/constants/translations.js`
2. Add a new language object with all required translation keys
3. Update `LanguageSwitcher.jsx` to include the new language option
4. Update language switching logic in `App.jsx`

### Adding a New User Role

1. Open `src/constants/translations.js`
2. Add the new role to the `ROLES` object
3. Include translations for the role in both languages
4. Update `RoleSelector.jsx` to display the new role
5. Add redirect URL mapping in `firebaseAuth.js`

### Modifying the UI Theme

1. Open `index.html`
2. Find the Tailwind configuration in the `<script>` tag
3. Modify the `saffron` color palette or add new colors
4. Update component classes to use new colors

## Troubleshooting

### Firebase Not Working

- Check that your `.env` file has all required values
- Verify Firebase credentials in Firebase Console
- Make sure you've restarted the dev server after adding `.env` values
- Check browser console for specific error messages

### Build Errors

- Run `npm install` to ensure all dependencies are installed
- Check that you're using a compatible Node.js version
- Clear `node_modules` and reinstall if needed: `rm -rf node_modules && npm install`

### Styling Issues

- Make sure Tailwind CDN is loaded (check `index.html`)
- Verify custom colors are defined in Tailwind config
- Check browser console for CSS errors

## Future Enhancements

Potential features to add:

- Email verification for new registrations
- Social login (Google, Facebook)
- Two-factor authentication
- User profile management page
- Dashboard pages for each role
- Service booking system
- Donation management
- Event calendar
- Notification system

## Support and Documentation

- Firebase Setup: See `FIREBASE_SETUP.md`
- React Documentation: https://react.dev
- Vite Documentation: https://vite.dev
- Firebase Documentation: https://firebase.google.com/docs
- Tailwind CSS Documentation: https://tailwindcss.com/docs

## License

This project is private and proprietary.

---

Last updated: 2024

