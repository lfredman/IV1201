import express from 'express';
import profileRouter from './routes/profileRoutes';
import accountRouter from './routes/accountRoutes';
import adminRouter from './routes/adminRoutes';

import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];

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
