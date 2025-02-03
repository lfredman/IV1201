import { query } from "../utils/db";

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