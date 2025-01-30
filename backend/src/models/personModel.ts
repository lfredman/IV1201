import { query } from "../utils/db";

interface Person {
  id: number;
  name: string;
  email: string;
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
  email: string
): Promise<Person> => {
  console.log(name, email);
  const result = await query(
    `INSERT INTO person (name, email) VALUES ('${name}', '${email}') RETURNING *`
  );
  return result[0];
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
