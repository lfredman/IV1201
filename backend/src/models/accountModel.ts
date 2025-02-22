import { query } from "../utils/db";

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
  try {

    // NOTE THIS CREATES AN NON-ADMIN USER ONLY BY USING HARD CODED ROLE ID
    const result = await query(
      `INSERT INTO person (name, surname, pnr, username, email, password, role_id) 
       VALUES ($1, $2, $3, $4, $5, $6, 2) 
       RETURNING *`,
      [name, surname, pnr, username, email, password]
    );

    if (result && result.length > 0) {
      return result[0];
    }
    return null;
  } catch (error) {
    console.error('Error creating person:', error);
    throw new Error('Unable to create person');
  }
};

export const getUserByUsername = async (username: string): Promise<Person | null> => {
  const result = await query(`SELECT * FROM public.person WHERE username = '${username}'`);
  return result.length > 0 ? result[0] : null;
};

export const getUserByEmail = async (email: string): Promise<Person | null> => {
  const result = await query(`SELECT * FROM public.person WHERE email = '${email}'`);
  return result.length > 0 ? result[0] : null;
};

export const getUserByPnr = async (pnr: string): Promise<Person | null> => {
    const result = await query(`SELECT * FROM public.person WHERE pnr = '${pnr}'`);
    return result.length > 0 ? result[0] : null;
  };

export const getUserById = async (id: string): Promise<Person | null> => {
  const result = await query(`SELECT * FROM public.person WHERE person_id = '${id}'`);
  return result.length > 0 ? result[0] : null;
};

export const changePassword = async (
  person_id: number,
  newPassword: string
): Promise<boolean> => {
  try {
    // Update password in the database
    const updateResult = await query(
      `UPDATE person SET password = $1 WHERE person_id = $2 RETURNING *`,
      [newPassword, person_id]
    );

    return updateResult.length > 0;
  } catch (error) {
    console.error("Error changing password:", error);
    throw new Error("Unable to change password");
  }
};
  
// Functions only used by testing

export const deleteUserByUsername = async (usename: string): Promise<boolean> => {
  const result = await query(`DELETE FROM public.person WHERE username = '${usename}' RETURNING *`);

  return result.length > 0; // Returns true if a user was deleted, false otherwise
};
