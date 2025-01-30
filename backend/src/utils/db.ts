import { Pool, QueryResult } from 'pg';
import dotenv from 'dotenv';
dotenv.config();


// Create a new pool of connections
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: 5432,
  ssl: {
    rejectUnauthorized: false, // Allows self-signed certificates (use cautiously)
  },
});

export const query = async (text: string, params?: any[]) => {
    const res = await pool.query(text, params);
    return res.rows;
};
