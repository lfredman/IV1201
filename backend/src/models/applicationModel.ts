import { query, getClient, queryWithClient } from "../utils/db";

/**
 * Interface representing an Application object.
 */
export interface Application {
  person_id: number;
  username: string;
  name: string;
  surname: string;
  email: string;
  pnr: string;
  application_status: string;
  created_at: string;
  competences: { name: string; years: number }[];
}

/**
 * Fetches applications based on provided person IDs.
 * 
 * This function will query the database for applications of the specified persons.
 * 
 * @param {number[]} person_ids - An array of person IDs for which applications are to be fetched.
 * @returns {Promise<Application[]>} - A promise that resolves to an array of Application objects.
 * @throws {Error} - Throws an error if no person IDs are provided.
 */
export const getApplicationsByIds = async (person_ids: number[]): Promise<Application[]> => {
  if (!person_ids || person_ids.length === 0) {
    throw new Error("No person IDs provided");
  }

  return await fetchApplications("WHERE p.person_id = ANY($1)", [person_ids]);
};

/**
 * Fetches all applications from the database.
 * 
 * @returns {Promise<Application[]>} - A promise that resolves to an array of all Application objects.
 */
export const getAllApplications = async (): Promise<Application[]> => {
  return await fetchApplications("", []);
};

/**
 * Helper function to fetch applications with a given SQL `WHERE` clause.
 * 
 * This function builds and executes a database query to fetch application details.
 * It uses the provided `whereClause` to filter the results and the `params` array
 * for parameterized query binding.
 * 
 * @param {string} whereClause - The `WHERE` SQL clause to filter the results.
 * @param {any[]} params - An array of parameters to be used in the query.
 * @returns {Promise<Application[]>} - A promise that resolves to an array of Application objects.
 */
const fetchApplications = async (whereClause: string, params: any[]): Promise<Application[]> => {
  const client = await getClient(); 

  try {
    await client.query("BEGIN"); // Start the transaction

    const result: Application[] = await queryWithClient(
      client,
      `
      SELECT 
          p.person_id,
          p.username,
          p.name,
          p.surname,
          p.email,
          p.pnr,
          a.status AS application_status,
          a.created_at,
          
          COALESCE(
              JSONB_AGG(
                  DISTINCT JSONB_BUILD_OBJECT(
                      'name', c.name,
                      'years', cp.years_of_experience
                  )
              ) FILTER (WHERE c.name IS NOT NULL),
              '[]'::JSONB
          ) AS competences
      FROM person p
      JOIN applicant a ON p.person_id = a.person_id
      LEFT JOIN competence_profile cp ON p.person_id = cp.person_id
      LEFT JOIN competence c ON cp.competence_id = c.competence_id
      ${whereClause}
      GROUP BY p.person_id, p.username, p.name, p.surname, p.email, p.pnr, a.status, a.created_at;
      `,
      params
    );

    await client.query("COMMIT"); // Commit the transaction

    return result;
  } catch (error) {
    await client.query("ROLLBACK"); // Rollback on error
    console.error("Error fetching applications:", error);
    throw error; // Propagate error
  } finally {
    client.release(); // Release the client back to the pool
  }
};

/**
 * Updates the status of an application based on user ID.
 * 
 * This function updates the status of an application for a given user (person_id).
 * 
 * @param {number} userId - The ID of the user whose application status is to be updated.
 * @param {string} action - The new status to set for the user's application.
 * @returns {Promise<Application[]>} - A promise that resolves to the updated application information for the user.
 */
export const updateApplication = async (userId: number, action: string): Promise<Application[]> => {
  const client = await getClient(); // Acquire a client for transactions

  try {
    await client.query("BEGIN"); // Start the transaction

    const result: Application[] = await queryWithClient(
      client,
      `
      UPDATE applicant
      SET status = $1
      WHERE person_id = $2;
      `, [action, userId]
    );

    await client.query("COMMIT"); // Commit the transaction

    return getApplicationsByIds([userId]);
  } catch (error) {
    await client.query("ROLLBACK"); // Rollback on error
    console.error("Error updating applications:", error);
    throw error; // Propagate error
  } finally {
    client.release(); // Release the client back to the pool
  }
};
