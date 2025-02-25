import { getApplicationsByIds, getAllApplications, updateApplication } from '../models/applicationModel'

export const getApplicationService = async (data: { ids?: string }) => {
    if (data.ids && typeof data.ids !== "string") {
        throw new Error("Invalid 'ids' query parameter");
    }
    
    let users = [];

    if (data.ids){
        const idArray: number[] = data.ids
        .split(",")
        .map((id: string) => id.trim()) // Trim spaces
        .filter((id: string) => /^\d+$/.test(id)) // Ensure only digits
        .map((id: string) => Number(id)) // Convert to numbers
        .filter((id: number) => id > 0); // Keep only positive integers

        if (idArray.length === 0) {
            throw new Error("No valid positive integers provided");
        }
        // Remove duplicates using Set
        const uniqueIdArray = [...new Set(idArray)];

        const users = await getApplicationsByIds(uniqueIdArray)
        return users
    } else {
        const users = await getAllApplications()
        return users

    }
};

export const updateApplicationService = async (data: { id: number, action: string }) => {
    if (typeof data.id !== "number" || data.id <= 0) {
        throw new Error("Invalid or missing 'id' query parameter");
    }

    if (typeof data.action !== "string" || !data.action.trim()) {
        throw new Error("Invalid or missing 'action' query parameter");
    }

    const validActions = ['unhandled', 'accepted', 'rejected'];
    if (!validActions.includes(data.action)) {
        throw new Error("Invalid action provided. Valid actions are 'unhandled', 'accepted' or 'rejected'");
    }

    const application = await updateApplication(data.id, data.action);
    return application;
};