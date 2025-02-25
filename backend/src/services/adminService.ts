import { getApplicationsByIds, getAllApplications, updateApplication } from '../models/applicationModel'
import { logger } from '../utils/logger';

export const getApplicationService = async (data: { ids?: string }) => {
    if (data.ids && typeof data.ids !== "string") {
        logger.error('Invalid ids query parameter', { data });
        throw new Error("Invalid 'ids' query parameter");
    }

    let users = [];

    try {
        if (data.ids) {
            logger.info('Processing specific IDs', { ids: data.ids });

            const idArray: number[] = data.ids
                .split(",")
                .map((id: string) => id.trim()) // Trim spaces
                .filter((id: string) => /^\d+$/.test(id)) // Ensure only digits
                .map((id: string) => Number(id)) // Convert to numbers
                .filter((id: number) => id > 0); // Keep only positive integers

            if (idArray.length === 0) {
                logger.error('No valid positive integers provided for IDs', { ids: data.ids });
                throw new Error("No valid positive integers provided");
            }

            const uniqueIdArray = [...new Set(idArray)];
            logger.info('Unique IDs after filtering and deduplication', { uniqueIdArray });

            users = await getApplicationsByIds(uniqueIdArray);
            logger.info('Fetched applications by IDs', { users });
        } else {
            logger.info('Fetching all applications');
            users = await getAllApplications();
        }

        return users;
    } catch (error) {
        logger.error('Error in getApplicationService', { error, data });
        throw error;
    }
};


export const updateApplicationService = async (data: { id: number, action: string }) => {
    if (typeof data.id !== "number" || data.id <= 0) {
        logger.error('Invalid id query parameter', { data });
        throw new Error("Invalid or missing 'id' query parameter");
    }

    if (typeof data.action !== "string" || !data.action.trim()) {
        logger.error('Invalid action query parameter', { data });
        throw new Error("Invalid or missing 'action' query parameter");
    }

    const validActions = ['unhandled', 'accepted', 'rejected'];
    if (!validActions.includes(data.action)) {
        logger.error('Invalid action provided', { data });
        throw new Error("Invalid action provided. Valid actions are 'unhandled', 'accepted' or 'rejected'");
    }

    try {
        logger.info('Updating application', { id: data.id, action: data.action });
        const application = await updateApplication(data.id, data.action);
        logger.info('Application updated successfully', { application });
        return application;
    } catch (error) {
        logger.error('Error in updateApplicationService', { error, data });
        throw error;
    }
};
