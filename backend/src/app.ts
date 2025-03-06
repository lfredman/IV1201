import express, { Request, Response } from 'express';
import profileRoutes from './routes/profileRoutes';
import accountRoutes from './routes/accountRoutes';
import adminRoutes from './routes/adminRoutes';

import bodyParser from 'body-parser';
import cors, { CorsOptions } from "cors";

/**
 * Sets up an Express.js server with specific CORS configuration, middleware, and routes for handling API requests.
 * The server listens on a specified port (default 3000) and includes routes for account, profile, and admin functionalities.
 * Error handling is included for undefined routes, returning a 404 status. The server runs in production mode unless the environment is set to 'test'.
 */
const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
    if (origin && allowedOrigins.includes(origin)) {
      callback(null, true); 
    } else {
      callback(null, false);
    }
  },
};

app.use(cors(corsOptions));

app.get('/', (req: Request, res: Response) => {
    res.send(`<h1>Welcome to the API</h1>
              <h2>Available Routes:</h2>
              <ul>

              </ul>`);
});


// Middleware
app.use(bodyParser.json());

// Routes
//app.use('/', personRoutes);
app.use('/account', accountRoutes);
app.use('/profile', profileRoutes);
app.use('/admin', adminRoutes);

// Error handling
app.use((req: Request, res: Response) => {
  res.status(404).send('Not Found');
});


if (process.env.NODE_ENV !== 'test') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

export default app;  // This ensures app is the default export
