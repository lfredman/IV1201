import { Pool, QueryResult, PoolClient } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

// Parse the DATABASE_URL environment variable for Heroku
const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Create a new pool of connections using DATABASE_URL (Heroku Postgres URL)
const pool = new Pool({
  connectionString: DATABASE_URL, // Use the DATABASE_URL environment variable directly
  ssl: {
    rejectUnauthorized: false, // Allows self-signed certificates (use cautiously)
  },
})
/**
 * Executes a general database query and returns the result rows.
 * This function is non-transactional and can be used for standard queries.
 * In case of an error while querying, throws an exception.
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
 * In case of an error while acquiring the client, throws an exception.
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
 * Ensures that the query is part of a transaction and can be committed or rolled back.
 * In case of an error while querying, throws an exception.
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
 * This function should only be used during testing or when the application is shutting down.
 *
 * @returns {void} - No return value.
 */
export const closeDB = async () => {
  await pool.end();
};
