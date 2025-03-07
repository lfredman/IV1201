import { Request, Response } from "express";
import { getCompetenceService, updateCompetenceService, getAvailabilityService, updateAvailabilityService, getApplicationService, upsertApplicationService } from "../services/profileService";
import { AuthRequest } from "../middleware/authMiddleware";  // Import the AuthRequest type

/**
 * Retrieves the competence data for a user. 
 * By default, it fetches the logged-in user's competence data, 
 * but if a specific user ID is provided in the route parameters, 
 * it fetches the competence data for that user.
 * Sends a success message along with the competence data, or an error message if an error occurs.
 *
 * @param {AuthRequest} req - The request object containing user information and route parameters.
 * @param {Response} res - The response object used to send back the competence data or an error message.
 * @returns {Promise<void>} - A promise that resolves when the response is sent to the client.
 */
export const getCompetence = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      let id = req.user.userId; // Use the token userid by default

      if (req.params.id){  // If any specific route was defined use that
        id = req.params.id;
      }

      const data = await getCompetenceService(id);
      res.status(201).json({ message: "User competence parsed successfully", data });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unknown error occurred' });
      }
    }
  };
  
/**
 * Updates the competence data for a user.
 * By default, it updates the logged-in user's competence data, 
 * but if a specific user ID is provided in the route parameters, 
 * it updates the competence data for that user.
 * Sends a success message along with the updated competence data, or an error message if an error occurs.
 *
 * @param {AuthRequest} req - The request object containing user information and the data to be updated.
 * @param {Response} res - The response object used to send back the updated competence data or an error message.
 * @returns {Promise<void>} - A promise that resolves when the response is sent to the client.
 */
export const updateCompetence = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      let id = req.user.userId; // Use the token userid by default

      if (req.params.id){  // If any specific route was defined use that
        id = req.params.id;
      }

      const data = await updateCompetenceService(id, req.body);
      res.status(201).json({ message: "User competence updated successfully", data });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unknown error occurred' });
      }
    }
  };

  export const getAvailability = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      let id = req.user.userId; // Use the token userid by default

      if (req.params.id){  // If any specific route was defined use that
        id = req.params.id;
      }

      const data = await getAvailabilityService(id);
      res.status(201).json({ message: "User availability parsed successfully", data });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unknown error occurred' });
      }
    }
  };

  export const updateAvailability = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      let id = req.user.userId; // Use the token userid by default

      if (req.params.id){  // If any specific route was defined use that
        id = req.params.id;
      }

      const data = await updateAvailabilityService(id, req.body);
      res.status(201).json({ message: "User competence updated successfully", data });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unknown error occurred' });
      }
    }
};

export const getApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let id = req.user.userId; // Use the token userid by default

    if (req.params.id){  // If any specific route was defined use that
      id = req.params.id;
    }

    const data = await getApplicationService(id);
    res.status(201).json({ message: "User application retrieved successfully", data });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const upsertApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let id = req.user.userId; // Use the token userid by default

    if (req.params.id){  // If any specific route was defined use that
      id = req.params.id;
    }

    const data = await upsertApplicationService(id);
    res.status(201).json({ message: "User application updated successfully", data });
} catch (error) {
    if (error instanceof Error) {
        res.status(400).json({ message: error.message });
    } else {
        res.status(500).json({ message: "An unknown error occurred" });
    }
}
};