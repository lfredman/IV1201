
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
```
├─ frontend
│  ├─ .babelrc
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ jest.config.cjs
│  ├─ jest.setup.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ Procfile                     # Heroku deployment configuration
│  ├─ public
│  │  └─ vite.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ App.tsx                    # Main application 
│  │  ├─ assets                     # Static assets like images and videos 
│  │  │  ├─ 125183-732837197_small.mp4
│  │  │  ├─ ferriswheel.mp4
│  │  │  ├─ react.svg
│  │  │  └─ rollercoaster.mp4
│  │  ├─ components
│  │  │  ├─ AccountInfoForm.tsx     # Form for updating account information
│  │  │  ├─ ApplicationForm.tsx     # Form for creating an application
│  │  │  ├─ ApplicationsList.tsx    # List of applications  
│  │  │  ├─ AvailabilityForm.tsx    # Form for updating availability
│  │  │  ├─ ErrorBoundry.tsx        # Error boundary component
│  │  │  ├─ LoginForm.tsx           # Form for logging in
│  │  │  ├─ Navbar.tsx              # Navigation bar
│  │  │  ├─ PasswordEmailResetForm.tsx      # Form for resetting password by email
│  │  │  ├─ PasswordResetForm.tsx           # Form for resetting password
│  │  │  ├─ SignupForm.tsx          # Form for signing up
│  │  │  └─ UserCompetences.tsx     # List of user competences
│  │  ├─ context 
│  │  │  ├─ AvailabilityContext.test.tsx #unit test for AvailabilityContext
│  │  │  ├─ AvailabilityContext.tsx      #Context for availability
│  │  │  ├─ ProfileContext.test.tsx      #unit test for ProfileContext and competences 
│  │  │  ├─ ProfileContext.tsx           #Context for profile and competences   
│  │  │  ├─ UserContext.test.tsx         #unit test for UserContext
│  │  │  └─ UserContext.tsx              #Context for user login and signup
│  │  ├─ hooks                       # Custom hooks for fetching data
│  │  │  ├─ useApplications.ts       # Hook for fetching applications
│  │  │  ├─ useApply.ts              # Hook for applying for a job
│  │  │  ├─ useAuthFetch.ts          # Hook for fetching data with authentication 
│  │  │  ├─ useAvailiblity.ts        # Hook for fetching availability
│  │  │  ├─ useLogin.ts              # Hook for logging in
│  │  │  ├─ usePasswordReset.ts      # Hook for resetting password
│  │  │  ├─ useProfile.ts            # Hook for fetching profile
│  │  │  ├─ useSignup.ts             # Hook for signing up
│  │  │  └─ useValidation.ts         # Hook for form validation
│  │  ├─ main.tsx                    # Main application entry point  
│  │  ├─ pages                       # Pages for the application
│  │  │  ├─ ApplyForJob.tsx          # Page for applying for a job
│  │  │  ├─ Home.tsx                 # Home page
│  │  │  ├─ Login.tsx                # Page for logging in
│  │  │  ├─ NotFound.tsx             # Page for 404 errors
│  │  │  ├─ profile.tsx              # Page for viewing and updating profile
│  │  │  ├─ ResetPassword.tsx        # Page for resetting password
│  │  │  └─ Signup.tsx               # Page for signing up
│  │  ├─ styles                      # Styles for the application                
│  │  │  ├─ App.css
│  │  │  ├─ PickersDayStyles.ts
│  │  │  └─ video.css
│  │  ├─ utils                       # Utility functions
│  │  │  ├─ auth.ts                  # Authentication utility
│  │  │  ├─ competenceOptions.ts     # Options for competences
│  │  │  ├─ error.ts                 # Error utility
│  │  │  └─ signup.ts                # Signup utility
│  │  └─ vite-env.d.ts
│  ├─ tsconfig.app.json             # TypeScript configuration for the application
│  ├─ tsconfig.json                 # TypeScript configuration
│  ├─ tsconfig.node.json 
│  └─ vite.config.ts
```
