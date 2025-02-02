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


// Define the database interaction methods (CRUD operations)
export const getAllPersons = async (): Promise<Person[]> => {
  const result = await query("SELECT * FROM public.person");
  return result;
};

export const getPersonById = async (id: number): Promise<Person | null> => {
  console.log(`SELECT * FROM public.person WHERE public.id = ${id}`);
  const result = await query(
    `SELECT * FROM public.person WHERE person_id = ${id}`
  );
  return result.length > 0 ? result[0] : null;
};

export const createPerson = async (
  name: string, 
  surname: string,
  pnr: string,
  username: string,
  email: string,
  password: string
): Promise<Person | null> => {
  try {
    // Hash the password before storing it
    //const hashedPassword = await bcrypt.hash(password, 10);

    // Use parameterized query to prevent SQL injection
    const result = await query(
      `INSERT INTO person (name, surname, pnr, username, email, password) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [name, surname, pnr, username, email, password]
    );

    // Ensure result is not empty, otherwise return null
    if (result && result.length > 0) {
      return result[0];
    }
    return null;
  } catch (error) {
    console.error('Error creating person:', error);
    throw new Error('Unable to create person');
  }
};

export const updatePerson = async (
  id: number,
  name: string,
  email: string
): Promise<Person | null> => {
  const result = await query(
    `UPDATE person SET name = '${name}', email = '${email}' WHERE person_id = '${id}' RETURNING *`
  );
  return result.length > 0 ? result[0] : null;
};

export const deletePerson = async (id: number): Promise<boolean> => {
  const result = await query(
    `DELETE FROM public.person WHERE person_id = ${id}`
  );
  console.log(result);
  return true;
  //return result.rowCount > 0;
};

export const getUserByUsername = async (username: string): Promise<Person | null> => {
  const result = await query(`SELECT * FROM public.person WHERE username = '${username}'`);
  return result.length > 0 ? result[0] : null;
};

export const getUserByEmail = async (email: string): Promise<Person | null> => {
  const result = await query(`SELECT * FROM public.person WHERE email = '${email}'`);
  return result.length > 0 ? result[0] : null;
};