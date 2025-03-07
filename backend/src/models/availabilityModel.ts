import { query, getClient, queryWithClient } from "../utils/db";
import dayjs from "dayjs";
import {isEmailValid, isInputSafe, isPasswordValid, isPnrValid, isActionValid, isDateValid} from '../utils/validation';

export interface Availability {
  availability_id: any;
  from_date: string;
  to_date: string;
}

export interface Availabilities {
  person_id: number;
  availabilities: Availability[];
}

export const getAvailabilityById = async (person_id: number): Promise<Availabilities | null> => {

  //No need to validate number.

  const result = await query(
    `SELECT availability_id, from_date, to_date FROM availability WHERE person_id = $1;`,
    [person_id]
  );

  if (result.length === 0) {
    return {
      person_id,
      availabilities: []
    };
  }

  return {
    person_id,
    availabilities: result.map(row => ({
      availability_id: row.availability_id,
      from_date: dayjs(row.from_date).format('YYYY-MM-DD'),
      to_date: dayjs(row.to_date).format('YYYY-MM-DD')
    }))
  };
};


export const updateAvailabilityById = async (person_id: number, availabilities: Availability[]): Promise<Availabilities | null> => {
  const client = await getClient(); // Acquire a client for transactions

  //validation
  for(const av of availabilities){
    if(!isDateValid(av.from_date) || !isDateValid(av.to_date)){
      throw new Error("Invalid date!");
    }
  }

  console.log("BEGIN TRANSACTION AVAILABILITY");
  try {
    await client.query("BEGIN"); // Start the transaction


    // Delete availabilities that are not in the new list
    if (availabilities.length > 0) {
      await queryWithClient(
        client,
        `DELETE FROM availability 
        WHERE person_id = $1 
        AND (from_date, to_date) NOT IN (${availabilities.map((_, i) => `($${i * 2 + 2}, $${i * 2 + 3})`).join(",")})`,
        [person_id, ...availabilities.flatMap(a => [a.from_date, a.to_date])]
      );
    } else {
      // If no availabilities are provided, delete all for this person
      await queryWithClient(client, `DELETE FROM availability WHERE person_id = $1`, [person_id]);
    }

    console.log(availabilities);
    const newAvailabilities = availabilities.filter(av => !av.availability_id);
    console.log(newAvailabilities);
    // Insert or update each availability
    for (const availability of newAvailabilities) {
      await queryWithClient(
        client,
        `INSERT INTO availability (person_id, from_date, to_date)
        VALUES ($1, $2, $3)`,
        [person_id, availability.from_date, availability.to_date]
      );
    }

    await client.query("COMMIT"); // Commit the transaction

    // Return the updated availabilities
    return getAvailabilityById(person_id);
  } catch (error) {
    await client.query("ROLLBACK"); // Rollback on error
    console.error("Error updating availabilities:", error);
    throw error; // Propagate error
  } finally {
    client.release(); // Release the client back to the pool
  }
};

export const hasAvailability = async (person_id: number): Promise<boolean> => {
  const result = await query(
    `SELECT 1 FROM availability WHERE person_id = $1 LIMIT 1;`,
    [person_id]
  );

  return result.length > 0;
};
