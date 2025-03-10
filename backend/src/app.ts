import express from 'express';
import profileRouter from './routes/profileRoutes';
import accountRouter from './routes/accountRoutes';
import adminRouter from './routes/adminRoutes';

import bodyParser from 'body-parser';
import cors from 'cors';

/**
 * Sets up an Express.js server with specific CORS configuration, middleware, and routes for handling API requests.
 * The server listens on a specified port (default 3000) and includes routes for account, profile, and admin functionalities.
 * Error handling is included for undefined routes, returning a 404 status. The server runs in production mode unless the environment is set to 'test'.
 */
const app = express();  // Create a new Express app instance
const port = process.env.PORT || 3000;  // Set the port from the environment variable or default to 3000

// List of allowed origins for CORS requests
const allowedOrigins = [
  "http://localhost:5173", 
  "http://127.0.0.1:5173", 
  "http://iv1201.peaceman.se", 
  "https://iv1201.peaceman.se"
];

// CORS options configuration to control which origins are allowed to make requests to the server
const corsOptions = {
  origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
    if (origin && allowedOrigins.includes(origin)) {
      callback(null, true);  // Allow the request if the origin is in the allowed list
    } else {
      callback(null, false);  // Reject the request if the origin is not in the allowed list
    }
  },
};

// Use CORS middleware with the specified configuration
app.use(cors(corsOptions));

// Use body-parser middleware to parse incoming request bodies as JSON
app.use(bodyParser.json());

// Define a simple GET route for the root endpoint ('/'), returning a welcome message
app.get('/', (req, res) => {
  res.send('Welcome to the server!');
});

// Define routes for the application, mapped to different paths
app.use('/account', accountRouter);  // All requests to /account will be handled by accountRouter
app.use('/profile', profileRouter);  // All requests to /profile will be handled by profileRouter
app.use('/admin', adminRouter);      // All requests to /admin will be handled by adminRouter

// Catch-all error handler for undefined routes, returning a 404 Not Found status
app.use((req, res) => {
  res.status(404).send('Not Found');  // Sends a 404 error if no matching route is found
});

// If the environment is not 'test', start the server and listen on the specified port
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);  // Logs a message when the server starts
  });
}

// Export the app instance for use in testing or further configuration
export default app;
