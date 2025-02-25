import { Request, Response } from "express";
import { getApplicationService, updateApplicationService } from "../services/adminService";
import { AuthRequest } from "../middleware/authMiddleware";  // Import the AuthRequest type

export const getApplications = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const data = await getApplicationService(req.query as { ids: string });
        res.status(200).json({ message: "Applications parsed successfully", data });
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
  };

export const updateApplication = async (req: AuthRequest, res: Response): Promise<void> => {
try {
    const data = await updateApplicationService(req.body);
    res.status(201).json({ message: "User application updated successfully", data });
} catch (error) {
    if (error instanceof Error) {
        res.status(400).json({ message: error.message });
    } else {
        res.status(500).json({ message: "An unknown error occurred" });
    }
}
};