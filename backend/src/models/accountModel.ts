import { getClient, queryWithClient } from "../utils/db";
import { isEmailValid, isInputSafe, isPasswordValid, isPnrValid } from '../utils/validation';

/**
 * Represents a person object.
 */
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

/**
 * Creates a new person in the database.
 * 
 * - Validates input fields: name, surname, username, email, pnr, and password.
 * - Inserts the new person into the database with a default role_id of 2.
 * - If the operation is successful, returns the created person object.
 * - If any error occurs during the process, a transaction rollback is performed, and an error message is thrown.
 * 
 * @param {string} name - The first name of the person.
 * @param {string} surname - The surname of the person.
 * @param {string} pnr - The PNR (Personal Identification Number) of the person.
 * @param {string} username - The username for the person.
 * @param {string} email - The email address of the person.
 * @param {string} password - The password for the person.
 * @returns {Promise<Person | null>} - The created person object or null if the operation failed.
 */
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

/**
 * Retrieves a user from the database by their username.
 * 
 * - Validates that the username is safe for database input.
 * - Executes a query to find the person by username.
 * - If the user is found, returns the user object; otherwise, returns null.
 * 
 * @param {string} username - The username of the person to retrieve.
 * @returns {Promise<Person | null>} - The person object or null if no user was found.
 */
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

/**
 * Retrieves a user from the database by their email.
 * 
 * - Validates that the email is in a valid format.
 * - Executes a query to find the person by email.
 * - If the user is found, returns the user object; otherwise, returns null.
 * 
 * @param {string} email - The email address of the person to retrieve.
 * @returns {Promise<Person | null>} - The person object or null if no user was found.
 */
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


/**
 * Retrieves a user from the database by their PNR.
 * 
 * - Validates that the PNR is valid before querying.
 * - Executes a query to find the person by PNR.
 * - If the user is found, returns the user object; otherwise, returns null.
 * 
 * @param {string} pnr - The PNR of the person to retrieve.
 * @returns {Promise<Person | null>} - The person object or null if no user was found.
 */
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

/**
 * Retrieves a user from the database by their person_id.
 * 
 * - Validates that the person_id is safe for database input.
 * - Executes a query to find the person by their ID.
 * - If the user is found, returns the user object; otherwise, returns null.
 * 
 * @param {string} id - The person_id of the person to retrieve.
 * @returns {Promise<Person | null>} - The person object or null if no user was found.
 */
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

/**
 * Retrieves users from the database based on an array of person IDs.
 * 
 * - Sanitizes the input to prevent SQL injection.
 * - Executes a query to find users by their IDs.
 * - Returns the list of users if found, otherwise null.
 * 
 * @param {number[]} ids - The list of person IDs to retrieve users.
 * @returns {Promise<Person[] | null>} - The list of person objects or null if no users were found.
 */
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

/**
 * Retrieves all users from the database.
 * 
 * - Executes a query to fetch all users from the database.
 * - Returns the list of users if found, otherwise null.
 * 
 * @returns {Promise<Person[] | null>} - The list of all person objects or null if no users were found.
 */
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


/**
 * Changes the password of a person in the database.
 * 
 * - Begins a transaction to safely change the password.
 * - Updates the password in the database for the given person_id.
 * - If the update is successful, the transaction is committed.
 * - If an error occurs, the transaction is rolled back.
 * 
 * @param {number} person_id - The ID of the person whose password needs to be changed.
 * @param {string} newPassword - The new password to set.
 * @returns {Promise<boolean>} - Returns true if the password was updated, otherwise false.
 */
export const changePassword = async (
  person_id: number,
  newPassword: string
): Promise<boolean> => {
  const client = await getClient(); // Acquire a client for transactions
  
  if(!isPasswordValid(newPassword)){
    throw new Error("Not valid password strength");
  }
  
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

/**
 * Deletes a user from the database by their username.
 * 
 * - Validates that the username is safe for database input to prevent SQL injection.
 * - Executes a query to delete the person by their username.
 * - If the deletion is successful (i.e., at least one record is deleted), returns `true`.
 * - If an error occurs during the operation, an error is logged, and an exception is thrown.
 * 
 * @param {string} username - The username of the person to delete.
 * @returns {Promise<boolean>} - Returns `true` if the user was deleted successfully, `false` otherwise.
 */
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

/**
 * Creates a new admin in the database.
 * 
 * - Validates input fields: name, surname, username, email, pnr, and password.
 * - Inserts the new admin into the database with a default role_id of 2.
 * - If the operation is successful, returns the created person object.
 * - If any error occurs during the process, a transaction rollback is performed, and an error message is thrown.
 * 
 * @param {string} name - The first name of the admin.
 * @param {string} surname - The surname of the admin.
 * @param {string} pnr - The PNR (Personal Identification Number) of the admin.
 * @param {string} username - The username for the admin.
 * @param {string} email - The email address of the admin.
 * @param {string} password - The password for the admin.
 * @returns {Promise<Person | null>} - The created person object or null if the operation failed.
 */

export const createAdmin = async (
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
       VALUES ($1, $2, $3, $4, $5, $6, 1) 
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