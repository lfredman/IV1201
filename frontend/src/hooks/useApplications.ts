import { useState, useEffect } from "react";
import useAuthFetch from "./useAuthFetch";

/**
 * Application interface
 * 
 * This interface defines the structure of an application object. It includes the following properties:
 * - person_id: A unique identifier for the person submitting the application.
 * - username: The username of the applicant.
 * - name: The first name of the applicant.
 * - surname: The last name of the applicant.
 * - email: The email address of the applicant.
 * - pnr: The personal number (identification number) of the applicant.
 * - application_status: The current status of the application (e.g., pending, approved).
 * - created_at: The timestamp when the application was created.
 * - competences: An array of objects representing the competences of the applicant, with each object containing the name and years of experience.
 * 
 * @interface Application
 */
export interface Application {
  person_id: number;
  username: string;
  name: string;
  surname: string;
  email: string;
  pnr: string;
  application_status: string;
  created_at: string;
  competences: { name: string; years: number }[];
  availability: { to_date: string; from_date: string }[];
}


/**
 * useApplications hook
 * 
 * This custom hook handles fetching, updating, and managing a list of applications. It provides the following:
 * - Fetches a list of applications from the server.
 * - Updates the application status by making a POST request.
 * - Manages loading, error, and application data states.
 * 
 * @hook
 * @returns {Object} The hook's return value, including the applications data, loading state, error state, and updateApplication function.
 * 
 * @property {Application[]} applications - The list of applications fetched from the server.
 * @property {boolean} loading - Indicates whether the application data is currently being fetched.
 * @property {string | null} error - Holds any error message related to fetching or updating applications.
 * @property {Function} updateApplication - A function used to update the status of an application.
 * 
 * @example
 * const { applications, loading, error, updateApplication } = useApplications();
 */
const useApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const authFetch = useAuthFetch(); // Assuming this fetch is stable and does not change on each render

  const fetchApplications = async () => {
    try {
      const response = await authFetch(`/admin/applications`, {
        method: "GET",
      });
      const res = await response.json();

      if (res.data && Array.isArray(res.data)) {
        setApplications(res.data);
      } else {
        setError("No applications found or invalid response format.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        const errMsg = `Application fetch failed! ${err.message || "An unknown error occurred."}`;
        setError(errMsg);
      } else {
        setError("An unexpected error occurred while fetching applications.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []); 

  const updateApplication = async (user_id: number, action: string) => {
    setLoading(true); // Set loading to true while fetching
    try {
      const response = await authFetch(`/admin/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: user_id,
          action: action,
        }),
      });
  
      const res = await response.json();
  
      if (res.data && Array.isArray(res.data)) {
        setApplications(prevApplications => {
          return prevApplications.map(application => 
            application.person_id === user_id 
              ? { ...application, ...res.data[0] }
              : application
          );
        });
      } else {
        setError("No applications found or invalid response format.");
      }
      return res.data[0];
    } catch (err: unknown) {
      if (err instanceof Error) {
        const errMsg = `Application update failed! ${err.message || "An unknown error occurred."}`;
        setError(errMsg);
      } else {
        setError("An unexpected error occurred while fetching applications.");
      }
    } finally {
      setLoading(false);
    }
  };
  


  return { applications, loading, error, updateApplication };
};

export default useApplications;
