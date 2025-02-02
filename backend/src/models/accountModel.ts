import { query } from "../utils/db";

export interface Person {
  id: number;
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

    const result = await query(
      `INSERT INTO person (name, surname, pnr, username, email, password) 
       VALUES ($1, $2, $3, $4, $5, $6) 
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