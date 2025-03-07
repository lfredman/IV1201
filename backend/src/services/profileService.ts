import { getCompetenceById, updateCompetenceById, Competences, hasCompetence} from '../models/competenceModel';
import { getAvailabilityById, updateAvailabilityById, Availabilities, hasAvailability } from '../models/availabilityModel';
import {getApplicationById, upsertApplication } from '../models/applicationModel'
import { logger } from '../utils/logger';

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

    logger.info("user: " + user_id + " retrives competences.");

    if (isNaN(id)) {
        logger.warn("Invalid userID: " + user_id);
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
    logger.info("user: " + user_id + " updates competences.");
    const id = Number(user_id);
    if (isNaN(id)) {
        logger.warn("Invalid userID: " + user_id);
        throw new Error("Invalid user_id");
    }

    // Validate the `competences` object
    if (!competences || !Array.isArray(competences.competences)) {
        logger.warn("Invalid competences for user: " + user_id);
        throw new Error("Invalid competences data");
    }

    // Add user_id as person_id in the `competences` object
    competences.person_id = id;

    // Call the model function to update the database
    try {
        logger.info(user_id+" calls database for update ");
        const result = await updateCompetenceById(id, competences);
        return result; // Return the result from the model
    } catch (error) {
        console.error("Error updating competences:", error);
        logger.error("Error updating competences for user: " + user_id);
        throw new Error("Failed to update competences");
    }
};


export const getAvailabilityService = async (user_id: string) => {

    logger.info("user: " + user_id + " retrives availability service.");
    const id = Number(user_id);

    if (isNaN(id)) {
        logger.warn("Invalid userID: " + user_id);
        throw new Error("Invalid user_id");
    }

    return await getAvailabilityById(id);
};


export const updateAvailabilityService = async (user_id: string, availabilities: Availabilities) => {
    // Convert user_id to a number
    const id = Number(user_id);
    logger.info("user: " + user_id + " updates availability.");
    if (isNaN(id)) {

        logger.warn("Invalid userID: " + user_id);
        throw new Error("Invalid user_id");
    }

    // Validate the `competences` object
    if (!availabilities || !Array.isArray(availabilities.availabilities)) {
        logger.warn("Invalid competences data for user: " + user_id);
        throw new Error("Invalid competences data");
    }

    // Add user_id as person_id in the `competences` object
    availabilities.person_id = id;

    logger.info("Validated competences data for user: " + user_id);

    // Call the model function to update the database
    try {
        const result = await updateAvailabilityById(id, availabilities.availabilities);
        logger.info("Updated availability successful for user: " + user_id);
        return result; // Return the result from the model
    } catch (error) {
        console.error("Error updating availabilities:", error);
        logger.error("Updated availability NOT successful for user: " + user_id);
        throw new Error("Failed to update availabilities");
    }
};

export const getApplicationService = async (user_id: string) => {
    // Convert user_id to a number
    const id = Number(user_id);
    logger.info("Get Application service for user: " + user_id);
    if (isNaN(id)) {
        logger.warn("Invalid userID: " + user_id);
        throw new Error("Invalid user_id");
    }
    return await getApplicationById(id);
}

export const upsertApplicationService = async (user_id: string) => {
    
    logger.info("Upsert Application service for user: " + user_id);
    const id = Number(user_id);
    if (isNaN(id)) {
        logger.warn("Invalid userID: " + user_id);
        throw new Error("Invalid user_id");
    }

    const [hasComp, hasAvail] = await Promise.all([
        hasCompetence(id),
        hasAvailability(id)
    ]);

    if (!hasComp || !hasAvail) {
        logger.warn("Missing fields! For user: " + user_id);
        throw new Error(
            `Missing ${!hasComp ? 'competence' : ''}${!hasComp && !hasAvail ? ' and ' : ''}${!hasAvail ? 'availability' : ''}`
        );
    }

    logger.info("Upsert Application service successful for user: " + user_id);

    const application = await upsertApplication(id, 'unhandled');
    return application;
};