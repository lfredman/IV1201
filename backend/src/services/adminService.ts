import { getApplicationsByIds, getAllApplications, updateApplication } from '../models/applicationModel';
import { logger } from '../utils/logger';
import { isActionValid } from '../utils/validation';

/**
 * Retrieves applications based on the provided query parameters.
 * If specific IDs are provided, it fetches applications for those IDs.
 * Otherwise, it fetches all applications. Filters out invalid IDs and logs any issues.
 * In case of an error, sends a 400 status for invalid query parameters, or a 500 status for server-related errors.
 *
 * @param {Object} data - The data object containing query parameters for fetching applications.
 * @param {string} [data.ids] - A comma-separated list of application IDs to fetch. Optional.
 * @returns {Promise<Array>} - A promise that resolves with an array of applications.
 */
export const getApplicationService = async (data: { ids?: string }) => {
    // Validate that ids are provided as a string
    if (data.ids && typeof data.ids !== "string") {
        logger.error('Invalid ids query parameter', { data });
        throw new Error("Invalid 'ids' query parameter");
    }

    let users = [];

    try {
        if (data.ids) {
            logger.info('Processing specific IDs', { ids: data.ids });

            // Convert comma-separated list of IDs into an array of valid positive integers
            const idArray: number[] = data.ids
                .split(",")
                .map((id: string) => id.trim()) // Trim spaces
                .filter((id: string) => /^\d+$/.test(id)) // Ensure only digits
                .map((id: string) => Number(id)) // Convert to numbers
                .filter((id: number) => id > 0); // Keep only positive integers

            // If no valid IDs are found, log error and throw
            if (idArray.length === 0) {
                logger.error('No valid positive integers provided for IDs', { ids: data.ids });
                throw new Error("No valid positive integers provided");
            }

            // Deduplicate the IDs and log the result
            const uniqueIdArray = [...new Set(idArray)];
            logger.info('Unique IDs after filtering and deduplication', { uniqueIdArray });

            // Fetch applications based on the unique IDs
            users = await getApplicationsByIds(uniqueIdArray);
            logger.info('Fetched applications by IDs', { users });
        } else {
            // Fetch all applications if no specific IDs are provided
            logger.info('Fetching all applications');
            users = await getAllApplications();
        }

        return users;
    } catch (error) {
        // Log the error and rethrow it
        logger.error('Error in getApplicationService', { error, data });
        throw error;
    }
};

/**
 * Updates the status of a specific application based on the provided action.
 * Valid actions are 'unhandled', 'accepted', and 'rejected'.
 * Logs the action and updates the application accordingly.
 * In case of an error, sends a 400 status if the parameters are invalid, or a 500 status for server-related errors.
 *
 * @param {Object} data - The data object containing the application ID and the action to be performed.
 * @param {number} data.id - The ID of the application to update.
 * @param {string} data.action - The action to perform on the application ('unhandled', 'accepted', or 'rejected').
 * @returns {Promise<Object>} - A promise that resolves with the updated application details.
 */
export const updateApplicationService = async (data: { id: number, action: string }) => {
    
    // Validate that the id is a positive number
    if (typeof data.id !== "number" || data.id <= 0) {
        logger.error('Invalid id query parameter', { data });
        throw new Error("Invalid or missing 'id' query parameter");
    }

    // Validate that action is a non-empty string
    if (typeof data.action !== "string" || !data.action.trim()) {
        logger.error('Invalid action query parameter', { data });
        throw new Error("Invalid or missing 'action' query parameter");
    }

    // Check if the provided action is valid
    if (!isActionValid(data.action)) {
        logger.error('Invalid action provided', { data });
        throw new Error("Invalid action provided. Valid actions are 'unhandled', 'accepted' or 'rejected'");
    }

    try {
        // Log the action before updating the application
        logger.info('Updating application', { id: data.id, action: data.action });

        // Perform the application update
        const application = await updateApplication(data.id, data.action);
        logger.info('Application updated successfully', { application });

        // Return the updated application
        return application;
    } catch (error) {
        // Log any errors that occur during the update process
        logger.error('Error in updateApplicationService', { error, data });
        throw error;
    }
};
