import { query, getClient, queryWithClient } from "../utils/db";

export interface Availability {
  from_date: string;
  to_date: string;
}

export interface Availabilities {
  person_id: number;
  availabilities: Availability[];
}

export const getAvailabilityById = async (person_id: number): Promise<Availabilities | null> => {
  const result = await query(
    `SELECT from_date, to_date FROM availability WHERE person_id = $1;`,
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
      from_date: row.from_date,
      to_date: row.to_date
    }))
  };
};


export const updateAvailabilityById = async (person_id: number, availabilities: Availability[]): Promise<Availabilities | null> => {
  const client = await getClient(); // Acquire a client for transactions

  try {
    await client.query("BEGIN"); // Start the transaction


    // Delete availabilities that are not in the new list
    if (availabilities.length > 0) {
      await queryWithClient(
        client,
        `DELETE FROM availability WHERE person_id = $1 AND availability_id NOT IN (${availabilities.map((_, i) => `$${i + 2}`).join(",")})`,
        [person_id]
      );
    } else {
      // If no availabilities are provided, delete all for this person
      await queryWithClient(client, `DELETE FROM availability WHERE person_id = $1`, [person_id]);
    }

    // Insert or update each availability
    for (const availability of availabilities) {
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
