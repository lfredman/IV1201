import { Response } from "express";
import { getApplicationService, updateApplicationService } from "../services/adminService";
import { AuthRequest } from "../middleware/authMiddleware"; 

/**
 * Handles the retrieval of applications based on provided query parameters.
 * If successful, sends back the list of applications with a success message.
 * In case of an error, sends a 400 status with the error message or a 500 status for an unknown error.
 *
 * @param {AuthRequest} req - The request object containing the query parameters, including the application IDs for filtering.
 *                            The query may include one or more application IDs to narrow down the list of applications.
 * @param {Response} res - The response object used to send back the parsed application data or error message.
 * @returns {Promise<void>} - A promise that resolves when the response is sent to the client.
 */
export const getApplications = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // Extract the 'ids' query parameter and pass it to the service for retrieving the relevant applications.
        const data = await getApplicationService(req.query as { ids: string });
        // Send back the successfully retrieved applications with a 200 status code.
        res.status(200).json({ message: "Applications parsed successfully", data });
    } catch (error) {
        // Handle errors by sending a 400 status if the error is an instance of Error,
        // or a 500 status if it is an unknown error.
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};

/**
 * Handles updating a user's application with the provided data.
 * If successful, sends back a success message and the updated data.
 * In case of an error, sends a 400 status with the error message or a 500 status for an unknown error.
 *
 * @param {AuthRequest} req - The request object containing the application data to be updated.
 *                            This typically includes information such as application details or status that needs to be modified.
 * @param {Response} res - The response object used to send back the updated application data or error message.
 * @returns {Promise<void>} - A promise that resolves when the response is sent to the client.
 */
export const updateApplication = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // Pass the request body data to the service for updating the application.
        const data = await updateApplicationService(req.body);
        // Send back the successfully updated application with a 201 status code.
        res.status(201).json({ message: "User application updated successfully", data });
    } catch (error) {
        // Handle errors by sending a 400 status if the error is an instance of Error,
        // or a 500 status if it is an unknown error.
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};
