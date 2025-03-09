import { Response } from "express";
import {
  getCompetenceService,
  updateCompetenceService,
  getAvailabilityService,
  updateAvailabilityService,
  getApplicationService,
  upsertApplicationService,
} from "../services/profileService";
import { AuthRequest } from "../middleware/authMiddleware";  // Import the AuthRequest type

// Helper function to get the user ID, either from the token or the request parameters.
const getUserId = (req: AuthRequest): string => {
  const idFromParams = req.params.id;
  const idFromToken = req.user?.userId;

  // If `idFromParams` is available, return it; otherwise, return the token `userId` as a string.
  return idFromParams || idFromToken?.toString() || ''; // Fallback to an empty string if both are undefined
};

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
    const id = getUserId(req); // Get user ID from either token or route parameter
    const data = await getCompetenceService(id);
    res.status(200).json({ message: "User competence parsed successfully", data });
  } catch (error) {
    handleError(res, error);
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
    const id = getUserId(req); // Get user ID from either token or route parameter
    const data = await updateCompetenceService(id, req.body);
    res.status(201).json({ message: "User competence updated successfully", data });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Retrieves the availability data for a user. 
 * By default, it fetches the logged-in user's availability data, 
 * but if a specific user ID is provided in the route parameters, 
 * it fetches the availability data for that user.
 * Sends a success message along with the availability data, or an error message if an error occurs.
 *
 * @param {AuthRequest} req - The request object containing user information and route parameters.
 * @param {Response} res - The response object used to send back the availability data or an error message.
 * @returns {Promise<void>} - A promise that resolves when the response is sent to the client.
 */
export const getAvailability = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = getUserId(req); // Get user ID from either token or route parameter
    const data = await getAvailabilityService(id);
    res.status(200).json({ message: "User availability parsed successfully", data });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Updates the availability data for a user.
 * By default, it updates the logged-in user's availability data, 
 * but if a specific user ID is provided in the route parameters, 
 * it updates the availability data for that user.
 * Sends a success message along with the updated availability data, or an error message if an error occurs.
 *
 * @param {AuthRequest} req - The request object containing user information and the data to be updated.
 * @param {Response} res - The response object used to send back the updated availability data or an error message.
 * @returns {Promise<void>} - A promise that resolves when the response is sent to the client.
 */
export const updateAvailability = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = getUserId(req); // Get user ID from either token or route parameter
    const data = await updateAvailabilityService(id, req.body);
    res.status(201).json({ message: "User availability updated successfully", data });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Retrieves the application data for a user.
 * By default, it fetches the logged-in user's application data, 
 * but if a specific user ID is provided in the route parameters, 
 * it fetches the application data for that user.
 * Sends a success message along with the application data, or an error message if an error occurs.
 *
 * @param {AuthRequest} req - The request object containing user information and route parameters.
 * @param {Response} res - The response object used to send back the application data or an error message.
 * @returns {Promise<void>} - A promise that resolves when the response is sent to the client.
 */
export const getApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = getUserId(req); // Get user ID from either token or route parameter
    const data = await getApplicationService(id);
    res.status(200).json({ message: "User application retrieved successfully", data });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Updates or inserts the application data for a user.
 * By default, it updates or inserts the logged-in user's application data, 
 * but if a specific user ID is provided in the route parameters, 
 * it updates or inserts the application data for that user.
 * Sends a success message along with the updated application data, or an error message if an error occurs.
 *
 * @param {AuthRequest} req - The request object containing user information and the data to be updated or inserted.
 * @param {Response} res - The response object used to send back the application data or an error message.
 * @returns {Promise<void>} - A promise that resolves when the response is sent to the client.
 */
export const upsertApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = getUserId(req); // Get user ID from either token or route parameter
    const data = await upsertApplicationService(id);
    res.status(201).json({ message: "User application updated successfully", data });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Handles the error response for all service-related errors.
 * @param {Response} res - The response object used to send back the error message.
 * @param {Error} error - The error that was thrown during the service execution.
 */
const handleError = (res: Response, error: unknown): void => {
  if (error instanceof Error) {
    res.status(400).json({ message: error.message });
  } else {
    res.status(500).json({ message: "An unknown error occurred" });
  }
};
