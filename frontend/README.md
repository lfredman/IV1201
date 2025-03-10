
# Frontend:
## Configuration Files: .babelrc, eslint.config.js, vite.config.ts, tsconfig.json
## Source Code:
- ### Components: User-facing components like forms and lists (AccountInfoForm.tsx, LoginForm.tsx, etc.)
- ### Context: Context providers to manage state (AvailabilityContext.tsx, ProfileContext.tsx, etc.)
- ### Hooks: Custom hooks for different functionalities (useApplications.ts, useAuthFetch.ts, etc.)
- ### Pages: Individual pages for the application (Home.tsx, Login.tsx, Signup.tsx, etc.)
- ### Styles: CSS and styling files (App.css, video.css)
- ### Utils: Helper functions (auth.ts, error.ts, signup.ts)

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

### Frontend Structure
frontend/
├─ src/
│ ├─ App.tsx # Main application component
│ ├─ assets/ # Static assets (images, videos)
│ │ ├─ ferriswheel.mp4 # Background video
│ │ └─ react.svg # React logo
│ ├─ components/ # Reusable UI components
│ │ ├─ AccountInfoForm.tsx # Form for account information
│ │ ├─ ApplicationForm.tsx # Form for job applications
│ │ ├─ ApplicationsList.tsx # List of applications for recruiters
│ │ ├─ LoginForm.tsx # Login form
│ │ ├─ Navbar.tsx # Navigation bar
│ │ └─ PasswordResetForm.tsx # Password reset form
│ ├─ context/ # React context for state management
│ │ ├─ UserContext.tsx # Context for user authentication
│ │ ├─ ProfileContext.tsx # Context for profile data
│ │ └─ AvailabilityContext.tsx # Context for availability data
│ ├─ hooks/ # Custom React hooks
│ │ ├─ useAuthFetch.ts # Hook for authenticated API requests
│ │ ├─ useLogin.ts # Hook for login functionality
│ │ └─ useSignup.ts # Hook for signup functionality
│ ├─ pages/ # Application pages
│ │ ├─ Home.tsx # Home page
│ │ ├─ Login.tsx # Login page
│ │ ├─ Signup.tsx # Signup page
│ │ ├─ ApplyForJob.tsx # Job application page
│ │ └─ ResetPassword.tsx # Password reset page
│ ├─ styles/ # CSS and styling files
│ │ ├─ App.css # Global styles
│ │ └─ video.css # Styles for video backgrounds
│ └─ utils/ # Utility functions
│ ├─ auth.ts # Authentication utilities
│ ├─ error.ts # Error handling utilities
│ └─ signup.ts # Signup validation utilities
├─ jest.config.cjs # Jest configuration for testing
├─ package.json # Frontend dependencies and scripts
├─ Procfile # Heroku deployment configuration
└─ vite.config.ts # Vite configuration