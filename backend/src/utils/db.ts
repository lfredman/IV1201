/* eslint-disable */
import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

/**
 * PostgreSQL connection pool using DATABASE_URL.
 * SSL is enabled with `rejectUnauthorized: false` (ensure security considerations are taken).
 */
const pool = new Pool({
  connectionString: DATABASE_URL, 
  ssl: {
    rejectUnauthorized: false,
  },
});

/**
 * Executes a general database query and returns the result rows.
 * This function is non-transactional and can be used for standard queries.
 * If an error occurs while querying, it will throw an exception.
 * 
 * @param {string} text - The SQL query text to be executed.
 * @param {any[]} [params] - The parameters to be passed along with the query (optional).
 * @returns {Promise<any[]>} - A promise that resolves with the result rows from the query.
 */
export const query = async (text: string, params?: any[]): Promise<any[]> => {
  const res = await pool.query(text, params);  
  return res.rows;
};

/**
 * Acquires a database client from the connection pool for transactional queries.
 * The client obtained here should be released after the transaction is complete.
 * If acquiring the client fails, an exception will be thrown.
 * 
 * @returns {Promise<PoolClient>} - A promise that resolves with the acquired database client.
 */
export const getClient = async (): Promise<PoolClient> => {
  const client = await pool.connect();  
  try {
    return client; 
  } catch (error) {
    client.release();  
    throw error;
  }
};

/**
 * Executes a database query within a transaction using the provided client.
 * The query is executed as part of a transaction and can be committed or rolled back.
 * If an error occurs while querying, an exception will be thrown.
 * 
 * @param {PoolClient} client - The database client to be used for the query execution.
 * @param {string} text - The SQL query text to be executed.
 * @param {any[]} [params] - The parameters to be passed along with the query (optional).
 * @returns {Promise<any[]>} - A promise that resolves with the result rows from the query.
 */
export const queryWithClient = async (
  client: PoolClient,
  text: string,
  params?: any[]
): Promise<any[]> => {
  const res = await client.query(text, params);  
  return res.rows;  
};

/**
 * Closes the database connection pool.
 * This function should be used when the application is shutting down or during testing.
 * Once the pool is closed, no further queries can be executed.
 * 
 * @returns {Promise<void>} - Resolves when the pool is closed.
 */
export const closeDB = async (): Promise<void> => {
  await pool.end();  
};