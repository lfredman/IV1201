import { getCompetenceById, updateCompetenceById, Competences} from '../models/competenceModel';

export const getCompetenceService = async (user_id: string) => {
    const id = Number(user_id);

    if (isNaN(id)) {
        throw new Error("Invalid user_id");
    }

    return await getCompetenceById(id);
};


export const updateCompetenceService = async (user_id: string, competences: Competences) => {
    // Convert user_id to a number
    const id = Number(user_id);
    if (isNaN(id)) {
        throw new Error("Invalid user_id");
    }

    // Validate the `competences` object
    if (!competences || !Array.isArray(competences.competences)) {
        throw new Error("Invalid competences data");
    }

    // Add user_id as person_id in the `competences` object
    competences.person_id = id;

    console.log("Validated Competences Object:", competences);

    // Call the model function to update the database
    try {
        const result = await updateCompetenceById(id, competences);
        return result; // Return the result from the model
    } catch (error) {
        console.error("Error updating competences:", error);
        throw new Error("Failed to update competences");
    }
};
