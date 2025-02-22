import { Pool, QueryResult, PoolClient } from 'pg';
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

// General query function for non-transactional queries
export const query = async (text: string, params?: any[]): Promise<any[]> => {
  const res = await pool.query(text, params);
  return res.rows;
};

// Utility to acquire a client for transactions
export const getClient = async (): Promise<PoolClient> => {
  const client = await pool.connect();
  return client;
};

// Transaction-safe query execution
export const queryWithClient = async (
  client: PoolClient,
  text: string,
  params?: any[]
): Promise<any[]> => {
  const res = await client.query(text, params);
  return res.rows;
};

// Functions only used by testing
export const closeDB = () => pool.end();