import express, { Request, Response } from 'express';
import personRoutes from './routes/personRoutes';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 3000;


app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript APA!');
});


// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api', personRoutes);

// Error handling
app.use((req: Request, res: Response) => {
  res.status(404).send('Not Found');
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});