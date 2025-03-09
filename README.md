# Recruitment Application for Amusement Park

## Overview
This project is a web-based recruitment application designed for an amusement park to handle up to **15,000 job applications** over a two-week period. The system supports two types of users:
- **Applicants**: Register and submit job applications via a browser.
- **Recruiters**: Administer applications (sort, accept, reject, or mark as "unhandled") via a browser or a future mobile app.

The application is built with **robustness**, **security**, and **scalability** in mind, and it supports future features such as **internationalization** and a **mobile app for recruiters**.

---

## Key Features
- **User Authentication and Authorization**: Secure login for applicants and recruiters with password encryption.
- **JWT-tokens and automatic refresh**: Users access resources by providing their JWT-token which automatically gets renewed when expired.
- **Password Reset Service**: Users can reset their passwords by receiving a reset-link to their email.
- **Application Management**: Recruiters can view, sort, and manage applications.
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
- **Authentication**: JWT-tokens
- **Logging**: Winston
- **Build Tool**: npm 
- **Testing**: Jest
- **Static analyzing**: Eslint

### Frontend
- **Language**: TypeScript
- **Framework**: React
- **Build Tool**: Vite
- **UI Library**: MUI (Material-UI) for design and components

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

### Cloud Installation
1. Have an active Heroku account
2. Create two apps
   - iv1201backend
   - iv1201frontend
3. Configure the postgres addon for the iv1201backend application
4. (optional) Add SSL-certificates for the applications in Heroku

### Database Installation
1. Use the Postgres addon on a Heroku 
2. Extract the database credentials
3. Use pgrestore to restore the database-content
   - `pg_restore --verbose -h hostname -U username -d database_name your_dump.dump`

### Installation
1. Clone the repository: `git clone <repository-url>`
2. Create a `.env` file in the `backend` folder with the following variables, also add them to the Github secrets:
    - JWT_SECRET=""
    - GMAIL=""
    - GMAIL_SECRET=""
    - DATABASE_URL=""
3. Create a `.env` file in the `frontend` folder with the following variables, also add to the Github environment variables:
    - VITE_BACKEND_URL=http://localhost:3000 # or the heroku backend URL
4. Install dependencies:
   - Backend: `cd backend && npm install`
   - Frontend: `cd frontend && npm install`


### Local development
1. Start the development servers: 
   - Backend: `cd backend && npm run dev`
   - Frontend: `cd frontend && npm run dev`

### Cloud deployment
1. Extract the HEROKU-api key and HEROKU_EMAIL from the admin page
2. Add the info to Github secrets:
    - HEROKU_EMAIL
    - HEROKU (apikey)
3. Push to the main branch, this triggers Github actions which in turn deploys both frontend and backend apps.

### CORS Configuration
CORS is enabled to allow requests from the frontend to the backend. The configuration is set to allow only trusted origins (e.g., the frontend URL).
The allowed urls may need to be adjusted depending on the application usage.

## Development Workflow
- Run tests: `npm test` (backend) and `npm test` (frontend).
- Run static analysing: ` npm run lint` (backend) and ` npm run lint` (frontend).
- Follow the Git branching strategy: [describe strategy].

## Logging
- Backend: All major actions within the system generates a system-log which gets timestamped and stored in the /logs folder. The logs are rotated daily.
- Frontend: No logging implemented

## Transactions
- Backend: Transactions are used for all database-affecting actions to ensure data integrity and consistency. Transactions begin when an action that affects the database starts and end when the action completes successfully or is rolled back if an error occurs.

## Unit Testing
- Backend: Comprehensive unit testing is implemented across the backend, covering all major functionalities and critical code paths. Testing is performed using the Jest framework, ensuring high code quality and reliability. The tests validate that each component performs as expected, helping to identify and address issues early in the development process.
- Frontend: Unit testing is partially implemented and configured to run within GitHub Actions for continuous integration. While the current setup ensures basic functionality is tested, there is room for improvement to expand coverage and enhance reliability. Further work is needed to ensure comprehensive test coverage across all critical frontend components.

## Codebase Documentation
- Backend: [link to backend docs].
- Frontend: [link to frontend docs].

## Diagrams
Refer to the `Diagrams` folder for system architecture and ER diagrams.

## Troubleshooting
- Issue: Database connection failed.
Solution: Ensure the database is running and the `.env` file alternativly `GitHub secrets` are correctly configured.
- Issue: CORS policy error.
Solution: Verify that the frontend URL is included in the CORS configuration.
- Issue: Deployment error
Solution: Verify test results and check Heroku email/apikey in GitHub secrets.


## Additional Resources
- [API Documentation](#)
- [Coding Style Guide](#)
