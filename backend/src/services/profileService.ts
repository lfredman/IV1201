import { getCompetenceById } from '../models/competenceModel';

export const getCompetenceService = async (user_id: string) => {
    const id = Number(user_id);

    if (isNaN(id)) {
        throw new Error("Invalid user_id");
    }

    return await getCompetenceById(id);
};
