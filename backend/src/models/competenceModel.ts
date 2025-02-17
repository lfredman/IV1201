import { query, getClient, queryWithClient } from "../utils/db";

export interface Competence {
  competence_id: number;
  competence_name: string;
  years_of_experience: number;
}

export interface Competences {
  person_id: number;
  competences: Competence[];
}

export const getCompetenceById = async (person_id: number): Promise<Competences | null> => {
  const result = await query(`
    SELECT 
        c.competence_id,
        c.name AS competence_name,
        cp.years_of_experience
    FROM person p
    LEFT JOIN competence_profile cp ON p.person_id = cp.person_id
    LEFT JOIN competence c ON cp.competence_id = c.competence_id
    WHERE p.person_id = '${person_id}'
  `);

  // If result is an array directly, you can return it as is
  if (result && Array.isArray(result)) {
    return {
      person_id,  // Include the person_id
      competences: result.map((competence) => ({
        competence_id: competence.competence_id,
        competence_name: competence.competence_name,
        years_of_experience: parseFloat(competence.years_of_experience),  // Convert string to number
      }))
    };
  } else {
    return null;  // In case no results were found
  }
};

export const updateCompetenceById = async (person_id: number, competences: Competences): Promise<Competences | null> => {
  const client = await getClient(); // Acquire a client for transactions

  try {
    await client.query("BEGIN"); // Start the transaction
    
    // Extract competence IDs to keep
    const competenceIds = competences.competences.map(c => c.competence_id);
    
    // Delete competences that are not in the new list
    if (competenceIds.length > 0) {
      await queryWithClient(
        client,
        `DELETE FROM competence_profile WHERE person_id = $1 AND competence_id NOT IN (${competenceIds.map((_, i) => `$${i + 2}`).join(",")})`,
        [person_id, ...competenceIds]
      );
    } else {
      // If no competences are provided, delete all competences for this person
      await queryWithClient(client, `DELETE FROM competence_profile WHERE person_id = $1`, [person_id]);
    }

    // Insert or update each competence
    for (const competence of competences.competences) {
      await queryWithClient(
        client,
        `
        INSERT INTO competence_profile (person_id, competence_id, years_of_experience)
        VALUES ($1, $2, $3)
        ON CONFLICT (person_id, competence_id)
        DO UPDATE SET years_of_experience = EXCLUDED.years_of_experience
        `,
        [person_id, competence.competence_id, competence.years_of_experience]
      );
    }

    await client.query("COMMIT"); // Commit the transaction

    // Return the updated competences
    return getCompetenceById(person_id);
  } catch (error) {
    await client.query("ROLLBACK"); // Rollback on error
    console.error("Error updating competences:", error);
    throw error; // Propagate error
  } finally {
    client.release(); // Release the client back to the pool
  }
};
