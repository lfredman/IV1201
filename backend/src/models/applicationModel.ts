import { query, getClient, queryWithClient } from "../utils/db";
import { isActionValid } from '../utils/validation';

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
  competences: { name: string; years: number }[];  // List of competences with their experience in years.
  availability: { to_date: string; from_date: string }[];  // List of availability periods.
}

/**
 * Interface for a simplified Application object.
 */
export interface SimpleApplication {
  applicant_id: number;
  person_id: number;
  status: string;
  created_at: string;  // Date or timestamp of application creation.
}

/**
 * Fetches a simplified application by person ID.
 * 
 * This function retrieves a simplified application for a person by querying the database
 * based on the provided `person_id`. It returns null if no application is found.
 * 
 * @param {number} person_id - The person ID for which the application is to be fetched.
 * @returns {Promise<SimpleApplication | null>} - A promise that resolves to a SimpleApplication or null.
 */
export const getApplicationById = async (person_id: number): Promise<SimpleApplication | null> => {
  const result = await query(
    `
    SELECT 
      applicant_id, 
      person_id, 
      status, 
      created_at
    FROM applicant
    WHERE person_id = $1
    `,
    [person_id]
  );

  if (result.length > 0) {
    return result[0];  // Return the first result if found.
  } else {
    return null;  // Return null if no application is found.
  }
};

/**
 * Updates or inserts an application based on whether it already exists for the given user ID.
 * 
 * This function checks whether an application exists for the provided `userId`. If it does, it updates the status,
 * otherwise it inserts a new application. The status is determined by the provided `action`.
 * 
 * @param {number} userId - The user ID for which the application will be updated or inserted.
 * @param {string} action - The new status to be set for the application.
 * @returns {Promise<SimpleApplication | null>} - A promise that resolves to the updated or inserted application.
 * @throws {Error} - Throws an error if the action is invalid.
 */
export const upsertApplication = async (userId: number, action: string): Promise<SimpleApplication | null> => {
  const client = await getClient();

  // Validate action before proceeding.
  if (!isActionValid(action)) {
    throw new Error("Invalid action!");  // Throw error if the action is invalid.
  }

  try {
    await client.query("BEGIN");  // Start a transaction.

    await client.query(
      `
      INSERT INTO applicant (person_id, status, created_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (person_id)
      DO UPDATE SET 
        status = EXCLUDED.status,
        created_at = NOW();
      `,
      [userId, action]
    );

    await client.query("COMMIT");  // Commit the transaction after successful query.

    return getApplicationById(userId);  // Return the updated or inserted application.
  } catch (error) {
    await client.query("ROLLBACK");  // Rollback the transaction in case of error.
    console.error("Error upserting application:", error);
    throw error;  // Propagate error.
  } finally {
    client.release();  // Release the client back to the pool.
  }
};

/**
 * Fetches applications for multiple person IDs.
 * 
 * This function retrieves a list of applications for the specified person IDs. If no IDs are provided, 
 * it throws an error.
 * 
 * @param {number[]} person_ids - An array of person IDs for which applications are to be fetched.
 * @returns {Promise<Application[]>} - A promise that resolves to an array of Application objects.
 * @throws {Error} - Throws an error if no person IDs are provided.
 */
export const getApplicationsByIds = async (person_ids: number[]): Promise<Application[]> => {
  if (!person_ids || person_ids.length === 0) {
    throw new Error("No person IDs provided");  // Throw error if person IDs are empty.
  }

  return await fetchApplications("WHERE p.person_id = ANY($1)", [person_ids]);
};

/**
 * Fetches all applications from the database.
 * 
 * This function retrieves all applications from the database without any filtering.
 * 
 * @returns {Promise<Application[]>} - A promise that resolves to an array of all Application objects.
 */
export const getAllApplications = async (): Promise<Application[]> => {
  return await fetchApplications("", []);
};

/**
 * Helper function to fetch applications based on a given SQL `WHERE` clause.
 * 
 * This function executes a database query to fetch applications by using the provided `whereClause` 
 * and the `params` array for query parameter binding. It retrieves detailed application data including
 * competences and availability.
 * 
 * @param {string} whereClause - The `WHERE` SQL clause to filter the results.
 * @param {any[]} params - An array of parameters to be used in the query.
 * @returns {Promise<Application[]>} - A promise that resolves to an array of Application objects.
 */
const fetchApplications = async (whereClause: string, params: [number[]] | []): Promise<Application[]> => {
  const client = await getClient();

  try {
    await client.query("BEGIN");  // Start the transaction.

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
        
        -- Gather competences
        COALESCE(
            JSONB_AGG(
                DISTINCT JSONB_BUILD_OBJECT(
                    'name', c.name,
                    'years', cp.years_of_experience
                )
            ) FILTER (WHERE c.name IS NOT NULL),
            '[]'::JSONB
        ) AS competences,

        -- Gather availabilities
        COALESCE(
            JSONB_AGG(
                DISTINCT JSONB_BUILD_OBJECT(
                    'from_date', av.from_date,
                    'to_date', av.to_date
                )
            ) FILTER (WHERE av.from_date IS NOT NULL),
            '[]'::JSONB
        ) AS availability

        FROM person p
        JOIN applicant a ON p.person_id = a.person_id
        LEFT JOIN competence_profile cp ON p.person_id = cp.person_id
        LEFT JOIN competence c ON cp.competence_id = c.competence_id
        LEFT JOIN availability av ON p.person_id = av.person_id
        ${whereClause}
        GROUP BY p.person_id, p.username, p.name, p.surname, p.email, p.pnr, a.status, a.created_at;
      `,
      params
    );

    await client.query("COMMIT");  // Commit the transaction after successful query.

    return result;  // Return the fetched applications.
  } catch (error) {
    await client.query("ROLLBACK");  // Rollback the transaction in case of error.
    console.error("Error fetching applications:", error);
    throw error;  // Propagate error.
  } finally {
    client.release();  // Release the client back to the pool.
  }
};

/**
 * Updates the status of an application for a given user.
 * 
 * This function updates the status of an application based on the provided `userId` and `action` (status).
 * It returns the updated application information after the status is updated.
 * 
 * @param {number} userId - The ID of the user whose application status is to be updated.
 * @param {string} action - The new status to set for the application.
 * @returns {Promise<Application[]>} - A promise that resolves to the updated application information.
 * @throws {Error} - Throws an error if the action is invalid.
 */
export const updateApplication = async (userId: number, action: string): Promise<Application[]> => {
  const client = await getClient();  // Acquire a client for transactions.

  // Validate action before proceeding.
  if (!isActionValid(action)) {
    throw new Error("Invalid action!");  // Throw error if the action is invalid.
  }

  try {
    await client.query("BEGIN");  // Start the transaction.

    await queryWithClient(
      client,
      `
      UPDATE applicant
      SET status = $1
      WHERE person_id = $2;
      `, [action, userId]
    );

    await client.query("COMMIT");  // Commit the transaction after successful update.

    return getApplicationsByIds([userId]);  // Return the updated application.
  } catch (error) {
    await client.query("ROLLBACK");  // Rollback the transaction in case of error.
    console.error("Error updating applications:", error);
    throw error;  // Propagate error.
  } finally {
    client.release();  // Release the client back to the pool.
  }
};
