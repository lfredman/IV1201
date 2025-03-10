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
// Define a simple GET route for the root endpoint ('/'), returning info about the endpoints
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>IV1201</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; background-color: #f4f4f4; }
            .container { max-width: 800px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
            h1 { text-align: center; }
            .section { margin-top: 20px; }
            .endpoint { padding: 10px; margin: 10px 0; border-left: 4px solid #007bff; background: #eef5ff; padding-left: 15px; }
            .method { font-weight: bold; color: #007bff; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>IV1201 API Endpoints Information</h1>
            
            <div class="section">
                <h2>Account API</h2>
                <div class="endpoint"><span class="method">POST</span> /register - Registers a new user.</div>
                <div class="endpoint"><span class="method">POST</span> /login - Authenticates an existing user.</div>
                <div class="endpoint"><span class="method">GET</span> /refresh - Refreshes the access token.</div>
                <div class="endpoint"><span class="method">POST</span> /reset - Allows authenticated users to reset their password.</div>
                <div class="endpoint"><span class="method">POST</span> /resetbyemail - Initiates a password reset via email.</div>
            </div>

            <div class="section">
                <h2>Admin API</h2>
                <div class="endpoint"><span class="method">GET</span> /applications - Retrieves the list of applications.</div>
                <div class="endpoint"><span class="method">POST</span> /applications - Updates an existing application.</div>
            </div>

            <div class="section">
                <h2>Profile API</h2>
                <div class="endpoint"><span class="method">GET</span> /competence/:id - Gets competence data for a user by ID.</div>
                <div class="endpoint"><span class="method">GET</span> /competence/ - Gets competence data for the authenticated user.</div>
                <div class="endpoint"><span class="method">POST</span> /competence/ - Updates competence data for the authenticated user.</div>
                <div class="endpoint"><span class="method">GET</span> /availability/ - Gets availability data for the authenticated user.</div>
                <div class="endpoint"><span class="method">POST</span> /availability/ - Updates availability data for the authenticated user.</div>
                <div class="endpoint"><span class="method">GET</span> /application/ - Gets application data for the authenticated user.</div>
                <div class="endpoint"><span class="method">POST</span> /application/ - Creates or updates application data for the authenticated user.</div>
            </div>
        </div>
    </body>
    </html>
  `);
});
// Use CORS middleware with the specified configuration
app.use(cors(corsOptions));

// Use body-parser middleware to parse incoming request bodies as JSON
app.use(bodyParser.json());

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
    
  });
}



// Export the app instance for use in testing or further configuration
export default app;
