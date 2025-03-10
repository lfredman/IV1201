import { query, getClient, queryWithClient } from "../utils/db";
import dayjs from "dayjs";
import { isDateValid } from '../utils/validation';

/**
 * Interface representing an availability record.
 */
export interface Availability {
  availability_id: string | number | null;  // Unique ID for the availability record (null for new records).
  from_date: string;  // Start date of availability.
  to_date: string;    // End date of availability.
}

/**
 * Interface representing availabilities for a person.
 */
export interface Availabilities {
  person_id: number;  // The ID of the person for whom the availabilities are listed.
  availabilities: Availability[];  // List of availability records.
}

/**
 * Fetches the availability for a person based on their ID.
 * 
 * This function retrieves all availability records associated with the provided person ID
 * from the database. If no availabilities are found, it returns an empty array.
 * 
 * @param {number} person_id - The person ID for which availability data is to be fetched.
 * @returns {Promise<Availabilities | null>} - A promise that resolves to an object containing 
 *          the person's ID and a list of their availability records.
 */
export const getAvailabilityById = async (person_id: number): Promise<Availabilities | null> => {

  const result = await query(
    `SELECT availability_id, from_date, to_date FROM availability WHERE person_id = $1;`,
    [person_id]
  );

  if (result.length === 0) {
    return {
      person_id,
      availabilities: []  // Return empty list if no availabilities are found.
    };
  }

  // Map the result to a format that includes formatted date strings.
  return {
    person_id,
    availabilities: result.map(row => ({
      availability_id: row.availability_id,
      from_date: dayjs(row.from_date).format('YYYY-MM-DD'),  // Format date to 'YYYY-MM-DD'
      to_date: dayjs(row.to_date).format('YYYY-MM-DD')     // Format date to 'YYYY-MM-DD'
    }))
  };
};

/**
 * Updates or inserts the availability records for a given person.
 * 
 * This function updates or inserts availability records for a person by performing the following steps:
 * - Deletes availabilities that are no longer part of the new list.
 * - Inserts new availability records.
 * - Updates existing records (if necessary).
 * 
 * If no availabilities are provided, it deletes all availability records for the person.
 * 
 * @param {number} person_id - The ID of the person whose availabilities are being updated.
 * @param {Availability[]} availabilities - The list of availabilities to update or insert.
 * @returns {Promise<Availabilities | null>} - A promise that resolves to the updated availabilities of the person.
 * @throws {Error} - Throws an error if any of the dates are invalid.
 */
export const updateAvailabilityById = async (person_id: number, availabilities: Availability[]): Promise<Availabilities | null> => {
  const client = await getClient(); // Acquire a client for transactions.

  // Validate all provided dates (start and end dates).
  for (const av of availabilities) {
    if (!isDateValid(av.from_date) || !isDateValid(av.to_date)) {
      throw new Error("Invalid date!");  // Throw error if any date is invalid.
    }
  }

  try {
    await client.query("BEGIN");  // Start a transaction.

    // Delete availabilities that are not part of the new list.
    if (availabilities.length > 0) {
      await queryWithClient(
        client,
        `DELETE FROM availability 
        WHERE person_id = $1 
        AND (from_date, to_date) NOT IN (${availabilities.map((_, i) => `($${i * 2 + 2}, $${i * 2 + 3})`).join(",")})`,
        [person_id, ...availabilities.flatMap(a => [a.from_date, a.to_date])]
      );
    } else {
      // If no availabilities are provided, delete all for this person.
      await queryWithClient(client, `DELETE FROM availability WHERE person_id = $1`, [person_id]);
    }

    // Filter new availabilities that do not already exist.
    const newAvailabilities = availabilities.filter(av => !av.availability_id);

    // Insert new availability records for this person.
    for (const availability of newAvailabilities) {
      await queryWithClient(
        client,
        `INSERT INTO availability (person_id, from_date, to_date)
        VALUES ($1, $2, $3)`,
        [person_id, availability.from_date, availability.to_date]
      );
    }

    await client.query("COMMIT");  // Commit the transaction after successful query execution.

    // Return the updated availabilities for the person.
    return getAvailabilityById(person_id);
  } catch (error) {
    await client.query("ROLLBACK");  // Rollback the transaction if an error occurs.
    console.error("Error updating availabilities:", error);
    throw error;  // Propagate error for further handling.
  } finally {
    client.release();  // Release the client back to the pool.
  }
};

/**
 * Checks if a person has any availability records.
 * 
 * This function checks whether any availability records exist for the given person ID. 
 * It returns a boolean indicating whether the person has availability records or not.
 * 
 * @param {number} person_id - The ID of the person to check for availability.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether
 *          the person has availability records.
 */
export const hasAvailability = async (person_id: number): Promise<boolean> => {
  const result = await query(
    `SELECT 1 FROM availability WHERE person_id = $1 LIMIT 1;`,
    [person_id]
  );

  // Return true if at least one availability record exists, otherwise false.
  return result.length > 0;
};
