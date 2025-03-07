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
const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173", "http://iv1201.peaceman.se", "https://iv1201.peaceman.se"];

const corsOptions = {
  origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
    if (origin && allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
};

app.use(cors(corsOptions));
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('Welcome to the server!');
});

// Routes
app.use('/account', accountRouter);
app.use('/profile', profileRouter);
app.use('/admin', adminRouter);

// Error handling
app.use((req, res) => {
  res.status(404).send('Not Found');
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

export default app;
