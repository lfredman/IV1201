import { getCompetenceById, updateCompetenceById, Competences} from '../models/competenceModel';
import { getAvailabilityById, updateAvailabilityById, Availabilities} from '../models/availabilityModel';

/**
 * Retrieves the competence data for a user based on the provided user ID.
 * If the user ID is invalid (not a number), throws an error.
 * In case of an error while retrieving the data, sends a 500 status.
 *
 * @param {string} user_id - The ID of the user whose competence data is to be fetched.
 * @returns {Promise<Object>} - A promise that resolves with the user's competence data.
 */
export const getCompetenceService = async (user_id: string) => {
    const id = Number(user_id);

    if (isNaN(id)) {
        throw new Error("Invalid user_id");
    }

    return await getCompetenceById(id);
};

/**
 * Updates the competence data for a specific user based on the provided user ID and competence details.
 * If the user ID or competence data is invalid, throws an error.
 * Logs the competences object for debugging purposes before calling the model function to update the data.
 * In case of an error while updating, throws a generic error message.
 *
 * @param {string} user_id - The ID of the user whose competence data is to be updated.
 * @param {Competences} competences - The competence data to update, including the user's competences.
 * @returns {Promise<Object>} - A promise that resolves with the updated competence data.
 */
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


export const getAvailabilityService = async (user_id: string) => {
    const id = Number(user_id);

    if (isNaN(id)) {
        throw new Error("Invalid user_id");
    }

    return await getAvailabilityById(id);
};


export const updateAvailabilityService = async (user_id: string, availabilities: Availabilities) => {
    // Convert user_id to a number
    const id = Number(user_id);
    if (isNaN(id)) {
        throw new Error("Invalid user_id");
    }

    // Validate the `competences` object
    if (!availabilities || !Array.isArray(availabilities.availabilities)) {
        throw new Error("Invalid competences data");
    }

    // Add user_id as person_id in the `competences` object
    availabilities.person_id = id;

    console.log("Validated Availability Object:", availabilities);

    // Call the model function to update the database
    try {
        const result = await updateAvailabilityById(id, availabilities.availabilities);
        return result; // Return the result from the model
    } catch (error) {
        console.error("Error updating availabilities:", error);
        throw new Error("Failed to update availabilities");
    }
};