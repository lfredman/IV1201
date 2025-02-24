import { query } from "../utils/db";
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
  try {

    // Validation
    if(!isInputSafe(name) || !isInputSafe(surname)|| !isInputSafe(username)){
      throw new Error("Not safe input in fields for DB");
    }
    if(!isEmailValid(email)){
      throw new Error("Email not valid");
    }
    if(!isPnrValid(pnr)){
      throw new Error("Pnr not valid");
    }

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
  if(!isInputSafe(username)){
    throw new Error("unsafe DB input");
  }
  const result = await query(`SELECT * FROM public.person WHERE username = '${username}'`);
  return result.length > 0 ? result[0] : null;
};

export const getUserByEmail = async (email: string): Promise<Person | null> => {
  if(!isEmailValid(email)){
    throw new Error("Invalid email");
  }
  const result = await query(`SELECT * FROM public.person WHERE email = '${email}'`);
  return result.length > 0 ? result[0] : null;
};

export const getUserByPnr = async (pnr: string): Promise<Person | null> => {
    if(!isPnrValid(pnr)){
      throw new Error("Invalid pnr");
    }
    const result = await query(`SELECT * FROM public.person WHERE pnr = '${pnr}'`);
    return result.length > 0 ? result[0] : null;
  };

export const getUserById = async (id: string): Promise<Person | null> => {
  if(!isInputSafe(id)){
    throw new Error("unsafe DB input");
  }
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

  if(!isInputSafe(usename)){
    throw new Error("unsafe DB input");
  }
  const result = await query(`DELETE FROM public.person WHERE username = '${usename}' RETURNING *`);

  return result.length > 0; // Returns true if a user was deleted, false otherwise
};
