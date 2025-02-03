import { Request, Response } from "express";
import { getCompetenceService } from "../services/profileService";
import { AuthRequest } from "../middleware/authMiddleware";  // Import the AuthRequest type


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
