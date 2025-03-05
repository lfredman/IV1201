import { query, getClient, queryWithClient } from "../utils/db";

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

export interface SimpleApplication {
  application_id: number;
  person_id: number;
  status: string;
  created_at: string; // or Date if you want it parsed as Date
}

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
    return result[0];
  } else {
    return null;
  }
};

/*UPDATE APPLICATION IF IT EXISTS OR INSERT IF NOT*/
export const upsertApplication = async (userId: number, action: string): Promise<SimpleApplication | null> => {
  const client = await getClient();

  try {
    await client.query("BEGIN");

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

    await client.query("COMMIT");

    return getApplicationById(userId);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error upserting application:", error);
    throw error;
  } finally {
    client.release();
  }
};

export const getApplicationsByIds = async (person_ids: number[]): Promise<Application[]> => {
  if (!person_ids || person_ids.length === 0) {
    throw new Error("No person IDs provided");
  }

  return await fetchApplications("WHERE p.person_id = ANY($1)", [person_ids]);
};

export const getAllApplications = async (): Promise<Application[]> => {
  return await fetchApplications("", []);
};


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

