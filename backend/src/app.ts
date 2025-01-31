import express, { Request, Response } from 'express';
import personRoutes from './routes/personRoutes';
import bodyParser from 'body-parser';
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req: Request, res: Response) => {
    res.send(`<h1>Welcome to the API</h1>
              <h2>Available Routes:</h2>
              <ul>
                <li>GET <a href="/persons">/persons</a></li>
                <li>GET /persons/:id</li>
                <li>POST /persons</li>
                <li>PUT /persons/:id</li>
                <li>DELETE /persons/:id</li>
              </ul>`);
});


// Middleware
app.use(bodyParser.json());

// Routes
app.use('/', personRoutes);

// Error handling
app.use((req: Request, res: Response) => {
  res.status(404).send('Not Found');
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});