# Backend:
## Configuration Files: eslint.config.js, jest.config.js, tsconfig.json, Procfile
## Source Code:
- ### controllers for handling requests (accountController.ts, adminController.ts, etc.)
- ### models for the database schema (accountModel.ts, applicationModel.ts, etc.)
- ### routes for defining API endpoints (accountRoutes.ts, adminRoutes.ts, etc.)
- ### services for business logic (accountService.ts, adminService.ts, etc.)
- ### middleware for custom middlewares (authMiddleware.ts, serverSideValidation.ts)
- ### utils for utility functions (db.ts, email.ts, etc.)

---
```

├─ backend
│  ├─ eslint.config.js
│  ├─ jest.config.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ Procfile
├─ src/
│ ├─ app.ts                         # Main application entry point
│ ├─ controllers/                   # Controllers for handling routes
│ │ ├─ accountController.ts         # Handles account-related logic
│ │ ├─ adminController.ts           # Handles admin-related logic
│ │ └─ profileController.ts         # Handles profile-related logic
│ ├─ middleware/                    # Middleware for authentication and validation
│ │ ├─ authMiddleware.ts            # Authentication middleware
│ │ └─ serverSideValidation.ts      # Server-side validation
│ ├─ models/                        # Database models
│ │ ├─ accountModel.ts              # Model for account data
│ │ ├─ applicationModel.ts          # Model for application data
│ │ ├─ availabilityModel.ts         # Model for availability data
│ │ └─ competenceModel.ts           # Model for competence data
│ ├─ routes/                        # API routes
│ │ ├─ accountRoutes.ts             # Routes for account-related endpoints
│ │ ├─ adminRoutes.ts               # Routes for admin-related endpoints
│ │ └─ profileRoutes.ts             # Routes for profile-related endpoints
│ ├─ services/                      # Business logic services
│ │ ├─ accountService.ts            # Service for account-related logic
│ │ ├─ adminService.ts              # Service for admin-related logic
│ │ └─ profileService.ts            # Service for profile-related logic
│ └─ utils/                         # Utility functions
│ ├─ db.ts                          # Database connection utility
│ ├─ email.ts                       # Email utility for password reset
│ ├─ logger.ts                      # Logging utility
│ └─ validation.ts                  # Validation utility
├─ jest.config.js                   # Jest configuration for testing
├─ package.json                     # Backend dependencies and scripts
├─ Procfile                         # Heroku deployment configuration
└─ tsconfig.json                    # TypeScript configuration

```

---