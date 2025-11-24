# LUMINE - Temple Management System

A modern, secure web application for managing temple operations, services, and user interactions. Built with React and Firebase, LUMINE provides a unified dashboard for devotees, temple administrators, security staff, and parking management.

## Overview

LUMINE is a comprehensive temple management system designed to streamline operations at places of worship. It offers role-based access control, multi-language support, and secure authentication to serve different user types within the temple ecosystem.

## Features

- **User Authentication**: Secure email/password authentication with Firebase
- **Multi-Role Support**: Separate interfaces for devotees, admins, security, and parking staff
- **Multi-Language**: English and Hindi language support
- **Password Reset**: Email-based password recovery system
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Form Validation**: Real-time input validation with clear error messages
- **Secure Storage**: User data stored securely in Firebase Firestore

## Technology Stack

- **React 19.2.0** - Modern UI library
- **Vite 7.2.4** - Fast build tool and dev server
- **Firebase 12.6.0** - Authentication and database
- **Tailwind CSS** - Utility-first CSS framework
- **Phosphor Icons** - Icon library

## Project Structure

```
LUMINE/
├── public/                      # Static assets
│   └── vite.svg
│
├── src/                         # Source code
│   ├── assets/                  # Images and other assets
│   │
│   ├── components/              # React components
│   │   ├── Footer.jsx           # Page footer
│   │   ├── ForgotPassword.jsx   # Password reset form
│   │   ├── Header.jsx           # Navigation header
│   │   ├── LanguageSwitcher.jsx # Language toggle
│   │   ├── LoginForm.jsx        # Login form
│   │   ├── Registration.jsx     # Registration form
│   │   ├── RoleSelector.jsx     # Role selection
│   │   └── WelcomeSection.jsx  # Welcome message
│   │
│   ├── config/                  # Configuration files
│   │   └── firebase.js          # Firebase setup
│   │
│   ├── constants/               # Constants and data
│   │   └── translations.js     # Multi-language content
│   │
│   ├── services/                # Business logic
│   │   └── firebaseAuth.js      # Authentication functions
│   │
│   ├── App.jsx                  # Main app component
│   └── main.jsx                 # Application entry point
│
├── .env                         # Environment variables (not in repo)
├── .gitignore                   # Git ignore rules
├── eslint.config.js             # ESLint configuration
├── firebase.json                # Firebase project config
├── firestore.rules             # Firestore security rules
├── firestore.indexes.json      # Firestore indexes
├── index.html                  # HTML template
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
│
├── FIREBASE_SETUP.md           # Firebase setup guide
└── PROJECT.md                  # Detailed project documentation
```

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- A Firebase project (see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Shashank4516/LUMINE-SIH.git
cd LUMINE-SIH
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add your Firebase credentials (see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for details)
   ```env
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## User Roles

The system supports four user roles:

1. **Devotee** - Regular temple visitors
2. **Mandir Admin** - Temple administrators
3. **Security Guard** - Security staff
4. **Parking Incharge** - Parking management staff

Each role has its own login interface and redirects to a specific dashboard after authentication.

## Firebase Setup

For detailed Firebase setup instructions, see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md).

Quick setup steps:
1. Create a Firebase project
2. Enable Email/Password authentication
3. Create a Firestore database
4. Add your credentials to `.env` file

## Building for Production

```bash
npm run build
```

The production build will be in the `dist` folder, ready to deploy to any static hosting service.

## Documentation

- [PROJECT.md](./PROJECT.md) - Comprehensive project documentation
- [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) - Firebase configuration guide

## Contributing

This is a private project. For contributions or questions, please contact the repository owner.

## Security

- Never commit the `.env` file
- Firebase credentials are stored in environment variables
- Firestore security rules are configured in `firestore.rules`
- User authentication is handled securely through Firebase

## License

This project is private and proprietary.

## Author

**Shashank4516**

## Acknowledgments

Built for Smart India Hackathon (SIH) project.

---

For more information, see the [PROJECT.md](./PROJECT.md) file for detailed documentation.
