import { getCompetenceById, updateCompetenceById, Competences, hasCompetence } from '../models/competenceModel';
import { getAvailabilityById, updateAvailabilityById, Availabilities, hasAvailability } from '../models/availabilityModel';
import { getApplicationById, upsertApplication } from '../models/applicationModel';
import { logger } from '../utils/logger';
import { isInputSafe, isCompetencesValid, isDateValid } from '../utils/validation';

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

    logger.info(`User ${user_id} retrieves competences.`);

    // Validate user_id
    if (isNaN(id)) {
        logger.warn(`Invalid userID: ${user_id}`);
        throw new Error("Invalid user_id tones2");
    }

    if (!isInputSafe(user_id)) {
        logger.warn("Not safe user ID");
        throw new Error("Invalid user_id");
    }

    // Fetch competence data by user ID
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
    const id = Number(user_id);

    logger.info(`User ${user_id} updates competences.`);

    // Validate user ID and competence data
    if (isNaN(id)) {
        logger.warn(`Invalid userID: ${user_id}`);
        throw new Error("Invalid user_id");
    }

    if (!competences || !isCompetencesValid(competences)) {
        logger.warn(`Invalid competences for user: ${user_id}`);
        throw new Error("Invalid competences data");
    }

    if (!isInputSafe(user_id)) {
        logger.warn("Not safe user ID");
        throw new Error("Invalid user ID, not safe");
    }

    // Add user_id as person_id in the `competences` object
    competences.person_id = id;

    try {
        logger.info(`Calling database to update competences for user ${user_id}`);
        const result = await updateCompetenceById(id, competences);
        logger.info(`Competences updated successfully for user: ${user_id}`);
        return result;
    } catch (error) {
        logger.error(`Error updating competences for user: ${user_id}`, { error });
        throw new Error("Failed to update competences");
    }
};

/**
 * Retrieves the availability data for a user based on the provided user ID.
 * If the user ID is invalid, throws an error.
 *
 * @param {string} user_id - The ID of the user whose availability data is to be fetched.
 * @returns {Promise<Object>} - A promise that resolves with the user's availability data.
 */
export const getAvailabilityService = async (user_id: string) => {
    const id = Number(user_id);

    logger.info(`User ${user_id} retrieves availability.`);

    // Validate user ID
    if (isNaN(id)) {
        logger.warn(`Invalid userID: ${user_id}`);
        throw new Error("Invalid user_id");
    }

    if (!isInputSafe(user_id)) {
        logger.warn("Not safe user ID");
        throw new Error("Invalid user ID, not safe");
    }

    // Fetch availability data by user ID
    return await getAvailabilityById(id);
};

/**
 * Updates the availability data for a specific user based on the provided user ID and availability details.
 * If the user ID or availability data is invalid, throws an error.
 * Logs each step for debugging purposes.
 *
 * @param {string} user_id - The ID of the user whose availability data is to be updated.
 * @param {Availabilities} availabilities - The availability data to update, including the user's availabilities.
 * @returns {Promise<Object>} - A promise that resolves with the updated availability data.
 */
export const updateAvailabilityService = async (user_id: string, availabilities: Availabilities) => {
    const id = Number(user_id);

    logger.info(`User ${user_id} updates availability.`);

    // Validate user ID and availability data
    if (isNaN(id)) {
        logger.warn(`Invalid userID: ${user_id}`);
        throw new Error("Invalid user_id");
    }

    if (!availabilities) {
        logger.warn(`Invalid availability data for user: ${user_id}`);
        throw new Error("Invalid availability data");
    }

    // Validate each availability entry for correct dates
    if (Array.isArray(availabilities.availabilities)) {
        for (const av of availabilities.availabilities) {
            if (!isDateValid(av.from_date) || !isDateValid(av.to_date)) {
                logger.warn("Invalid date in availabilities");
                throw new Error("Invalid date!");
            }
        }
    } else {
        logger.warn("Availabilities is not an iterable array.");
        throw new Error("Availabilities data is invalid or missing.");
    }

    availabilities.person_id = id;

    try {
        logger.info(`Updating availability for user: ${user_id}`);
        const result = await updateAvailabilityById(id, availabilities.availabilities);
        logger.info(`Updated availability successfully for user: ${user_id}`);
        return result;
    } catch (error) {
        logger.error(`Error updating availability for user: ${user_id}`, { error });
        throw new Error("Failed to update availabilities");
    }
};

/**
 * Retrieves the application data for a user based on the provided user ID.
 * If the user ID is invalid, throws an error.
 *
 * @param {string} user_id - The ID of the user whose application data is to be fetched.
 * @returns {Promise<Object>} - A promise that resolves with the user's application data.
 */
export const getApplicationService = async (user_id: string) => {
    logger.info(`Get Application service for user: ${user_id}`);

    if (!isInputSafe(user_id)) {
        logger.warn(`Invalid userID: ${user_id}`);
        throw new Error(`Invalid user_id: ${user_id}`);
    }

    const id = Number(user_id);
    return await getApplicationById(id);
};

/**
 * Upserts the application data for a user based on the provided user ID.
 * Checks for the existence of availability before performing the upsert.
 *
 * @param {string} user_id - The ID of the user whose application data is to be upserted.
 * @returns {Promise<Object>} - A promise that resolves with the upserted application data.
 */
export const upsertApplicationService = async (user_id: string) => {
    logger.info(`Upsert Application service for user: ${user_id}`);

    if (!isInputSafe(user_id)) {
        logger.warn(`Invalid userID: ${user_id}`);
        throw new Error("Invalid user_id");
    }

    const id = Number(user_id);

    // Check for the existence of availability
    const [hasAvail] = await Promise.all([
        hasAvailability(id),
    ]);

    if (!hasAvail) {
        logger.warn(`Missing availability for user: ${user_id}`);
        throw new Error(`Missing availability`);
    }

    logger.info(`Upsert Application service successful for user: ${user_id}`);
    const application = await upsertApplication(id, 'unhandled');
    return application;
};
