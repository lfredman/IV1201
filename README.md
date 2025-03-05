# Recruitment Application for Amusement Park

## Overview
This project is a web-based recruitment application designed for an amusement park to handle up to **15,000 job applications** over a two-week period. The system supports two types of users:
- **Applicants**: Register and submit job applications via a browser.
- **Recruiters**: Administer applications (sort, accept, reject, or mark as "unhandled") via a browser or a future mobile app.

The application is built with **robustness**, **security**, and **scalability** in mind, and it supports future features such as **internationalization** and a **mobile app for recruiters**.

---

## Key Features
- **User Authentication and Authorization**: Secure login for applicants and recruiters with password encryption.
- **Application Management**: Recruiters can view, sort, and manage applications.
- **Internationalization**: Support for multiple languages in both the UI and database.
- **Error Handling**: Comprehensive error handling with user-friendly messages and logging.
- **Transactions**: Proper use of database transactions to handle concurrent updates.
- **CI/CD Pipeline**: Automated testing, static analysis, and deployment via a CI/CD pipeline.
- **Cloud Deployment**: The application is hosted on a cloud platform (e.g., Heroku) for live access.
- **Responsive Design**: Built with **MUI (Material-UI)** for a consistent and modern user experience across devices.

---

## Technologies Used
### Backend
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: [Library, e.g., Passport.js]
- **Logging**: [Library, e.g., Winston]
- **Build Tool**: npm 
- **Testing**: Jest

### Frontend
- **Language**: TypeScript
- **Framework**: React
- **Build Tool**: Vite
- **UI Library**: MUI (Material-UI) for design and components
- **Internationalization**: [Library, e.g., i18next]

### DevOps
- **CI/CD**: GitHub Actions, CircleCI, or similar
- **Cloud Platform**: Heroku (or AWS, Azure, etc.)
- **Containerization**: Docker (optional)

---

## System Architecture
The application follows a **Monolithic Architecture using Client-Side Rendering (CSR).**:
1. **Presentation Layer**: Frontend (React) for user interaction.
2. **Application Layer**: Backend (Express.js) for business logic and API handling.
3. **Data Layer**: Database ([Database Name]) for persistent storage.

### Justification for Layered Architecture
- **Separation of Concerns**: Each layer has a distinct responsibility, making the system modular and easier to maintain.
- **Scalability**: Layers can be scaled independently (e.g., adding more backend servers).
- **Flexibility**: Changes in one layer (e.g., frontend framework) do not affect others.

---

## Setup Instructions
### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)
- PostgreSQL
- Git

### Installation
1. Clone the repository: `git clone <repository-url>`
2. Install dependencies:
   - Backend: `cd backend && npm install`
   - Frontend: `cd frontend && npm install`
3. Set up the database using `mod.sql`.
4. Start the development servers: 
   - Backend: `npm start`
   - Frontend: `npm run dev`

## Configuration
- Create a `.env` file in the `backend` folder with the following variables:
    - DB_USER=""
    - DB_HOST=""
    - DB_DATABASE=""
    - DB_PASSWORD=""
    - DB_PORT="5432"
    - JWT_SECRET=""
    - GMAIL=""
    - GMAIL_SECRET=""

### CORS Configuration
CORS is enabled to allow requests from the frontend to the backend. The configuration is set to allow only trusted origins (e.g., the frontend URL).

## Development Workflow
- Run tests: `npm test` (backend) and `npm test` (frontend).
- Follow the Git branching strategy: [describe strategy].

## Deployment
- Backend: [deployment steps].
- Frontend: [deployment steps].

## Codebase Documentation
- Backend: [link to backend docs].
- Frontend: [link to frontend docs].

## Diagrams
Refer to the `Diagrams` folder for system architecture and ER diagrams.

## Troubleshooting
- Issue: Database connection failed.
Solution: Ensure the database is running and the `.env` file is correctly configured.
- Issue: CORS policy error.
Solution: Verify that the frontend URL is included in the CORS configuration.



## Additional Resources
- [API Documentation](#)
- [Coding Style Guide](#)
