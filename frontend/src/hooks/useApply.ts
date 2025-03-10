import { useState, useEffect } from "react";
import useAuthFetch  from "./useAuthFetch";

/**
 * Interface representing the structure of an application.
 * 
 * - applicant_id: Unique identifier for the applicant.
 * - created_at: Timestamp indicating when the application was created.
 * - person_id: Unique identifier for the person associated with the application.
 * - status: Current status of the application (e.g., "pending", "approved", "rejected").
 */
interface ApplicationData {
    applicant_id: number;
    created_at: string;
    person_id: number;
    status: string;
}

/**
 * Custom hook for handling a user's job application.
 * 
 * This hook provides functionality to:
 * - Fetch the user's application from the backend.
 * - Submit a new application.
 * - Handle loading, error, and success states.
 * 
 * @returns {Object} The hook's return value includes:
 * - `application`: The user's application data, if available.
 * - `submitApplication`: A function to submit an application.
 * - `loading`: A boolean indicating whether an operation is in progress.
 * - `error`: A string containing any error message, if an error occurs.
 * - `success`: A boolean indicating whether an application was successfully submitted.
 */

export const useApplication = () => {
    const [application, setApplication] = useState<ApplicationData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const authFetch = useAuthFetch();

    const triggerError = (message: string, seconds = 5) => {
        setError(message);
        setTimeout(() => setError(null), seconds * 1000);
    };

    const triggerSuccess = (seconds = 5) => {
        setSuccess(true);
        setTimeout(() => setSuccess(false), seconds * 1000);
    };

    useEffect(() => {
        const fetchApplication = async () => {
            

            setLoading(true);
            setError(null);

            try {
            const response = await authFetch(`/profile/application`, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch application');
            }

            const res = await response.json();

            if (res.data) {
                setApplication(res.data); // assuming backend sends application in res.data
            }
            } catch (err) {
                console.error("Application Fetch Error:", err);
                triggerError("Failed to fetch application.");
            } finally {
                setLoading(false);
            }
        };

        fetchApplication();
    }, []);

    const submitApplication = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await authFetch(`/profile/application`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                const message = errorData.message || 'Failed to submit application';
                throw new Error(message);
            }

            const res = await response.json();
            triggerSuccess();

            if (res.data) {
                setApplication(res.data);
            }
        } catch (err) {
            if (err instanceof Error) {
                console.error('Caught error:', err.message);
                triggerError(err.message);
            } else {
                console.error('Caught unknown error:', err);
                triggerError('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return { application, submitApplication, loading, error, success };
};
