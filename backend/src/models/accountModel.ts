import { query, getClient, queryWithClient } from "../utils/db";
import { isEmailValid, isInputSafe, isPasswordValid, isPnrValid } from '../utils/validation';

export interface Person {
  person_id: number;
  name: string;
  surname: string;
  pnr: string;
  username: string;
  email: string;
  password: string;
  role_id: string;
}

export const createPerson = async (
  name: string, 
  surname: string,
  pnr: string,
  username: string,
  email: string,
  password: string
): Promise<Person | null> => {
  const client = await getClient();

  try {
    await client.query("BEGIN");

    // Validation
    if(!isInputSafe(name) || !isInputSafe(surname) || !isInputSafe(username)){
      throw new Error("Not safe input in fields for DB");
    }
    if(!isEmailValid(email)){
      throw new Error("Email not valid");
    }
    if(!isPnrValid(pnr)){
      throw new Error("Pnr not valid");
    }

    // Insert person
    const result = await queryWithClient(
      client,
      `INSERT INTO person (name, surname, pnr, username, email, password, role_id) 
       VALUES ($1, $2, $3, $4, $5, $6, 2) 
       RETURNING *`,
      [name, surname, pnr, username, email, password]
    );

    await client.query("COMMIT");

    if (result && result.length > 0) {
      return result[0];
    }
    return null;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error('Error creating person:', error);
    throw new Error('Unable to create person');
  } finally {
    client.release();
  }
};

export const getUserByUsername = async (username: string): Promise<Person | null> => {
  if(!isInputSafe(username)){
    throw new Error("unsafe DB input");
  }

  const client = await getClient();
  try {
    const result = await queryWithClient(
      client,
      `SELECT * FROM public.person WHERE username = $1`,
      [username]
    );
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Error fetching user by username:", error);
    throw new Error("Failed to retrieve user");
  } finally {
    client.release();
  }
};

export const getUserByEmail = async (email: string): Promise<Person | null> => {
  if(!isEmailValid(email)){
    throw new Error("Invalid email");
  }

  const client = await getClient();
  try {
    const result = await queryWithClient(
      client,
      `SELECT * FROM public.person WHERE email = $1`,
      [email]
    );
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw new Error("Failed to retrieve user");
  } finally {
    client.release();
  }
};

export const getUserByPnr = async (pnr: string): Promise<Person | null> => {
  if(!isPnrValid(pnr)){
    throw new Error("Invalid pnr");
  }

  const client = await getClient();
  try {
    const result = await queryWithClient(
      client,
      `SELECT * FROM public.person WHERE pnr = $1`,
      [pnr]
    );
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Error fetching user by pnr:", error);
    throw new Error("Failed to retrieve user");
  } finally {
    client.release();
  }
};

export const getUserById = async (id: string): Promise<Person | null> => {
  if(!isInputSafe(id)){
    throw new Error("unsafe DB input");
  }

  const client = await getClient();
  try {
    const result = await queryWithClient(
      client,
      `SELECT * FROM public.person WHERE person_id = $1`,
      [id]
    );
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Error fetching user by id:", error);
    throw new Error("Failed to retrieve user");
  } finally {
    client.release();
  }
};

export const getUsersByIds = async (ids: number[]): Promise<Person[] | null> => {
  const client = await getClient();

  // Sanitize and join IDs to use in SQL IN clause
  const sanitizedIds = ids.map(id => `'${id}'`).join(", ");
  const queryString = `SELECT * FROM public.person WHERE person_id IN (${sanitizedIds})`;

  try {
    const result = await queryWithClient(client, queryString, []);
    return result.length > 0 ? result : null;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to retrieve users");
  } finally {
    client.release();
  }
};

export const getUsersAll = async (): Promise<Person[] | null> => {
  const client = await getClient(); // Acquire a client for transactions
  try {
    const result = await queryWithClient(client, `SELECT * FROM public.person`, []);
    return result.length > 0 ? result : null;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw new Error("Failed to retrieve all users");
  } finally {
    client.release();
  }
};

export const changePassword = async (
  person_id: number,
  newPassword: string
): Promise<boolean> => {
  const client = await getClient(); // Acquire a client for transactions
  try {
    await client.query("BEGIN"); // Start the transaction

    // Update password in the database
    const updateResult = await queryWithClient(
      client,
      `UPDATE person SET password = $1 WHERE person_id = $2 RETURNING *`,
      [newPassword, person_id]
    );

    await client.query("COMMIT"); // Commit the transaction

    return updateResult.length > 0;
  } catch (error) {
    await client.query("ROLLBACK"); // Rollback on error
    console.error("Error changing password:", error);
    throw new Error("Unable to change password");
  } finally {
    client.release(); // Release the client back to the pool
  }
};

// Functions only used by testing

export const deleteUserByUsername = async (usename: string): Promise<boolean> => {
  if(!isInputSafe(usename)){
    throw new Error("unsafe DB input");
  }
  
  const client = await getClient(); // Acquire a client for transactions
  try {
    const result = await queryWithClient(
      client,
      `DELETE FROM public.person WHERE username = $1 RETURNING *`,
      [usename]
    );

    return result.length > 0; // Returns true if a user was deleted, false otherwise
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user");
  } finally {
    client.release();
  }
};
