import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext"; // User context for tokens
import { Competence, useProfile as useProfileContext } from "../context/ProfileContext"; // Profile context
import useAuthFetch  from "./useAuthFetch";
import { useValidation } from "../hooks/useValidation";

/**
 * Custom hook for managing the user profile and their competences.
 * 
 * This hook provides functionality to:
 * 1. Fetch and manage the user's competences.
 * 2. Handle temporary changes to competences (before updating permanently).
 * 3. Apply or discard changes to competences.
 * 4. Handle error and loading states during the profile update process.
 * 5. Validate the competences before submitting them.
 * 
 * The hook interacts with the global user context and sends HTTP requests to update or fetch profile data.
 * It also allows for deleting competences from the temporary state and saving those changes to the server.
 * 
 * @returns {Object} - An object containing:
 *   - `competences`: The user's competences stored in the state.
 *   - `tempCompetences`: The temporary competences changes before saving.
 *   - `loading`: Boolean indicating if the profile data is being fetched or updated.
 *   - `error`: The error message, if any, that occurred during the fetch or update process.
 *   - `saveProfileChanges`: Function to apply changes to the competences (update profile).
 *   - `handleDeleteCompetence`: Function to delete a competence from temporary changes.
 *   - `resetChanges`: Function to discard any unsaved changes and reset to the initial competences.
 */
export const useProfile = () => {
  const { accessToken } = useUser(); 
  const { competences, tempCompetences, setCompetencesAndCache, addCompetence, deleteCompetence, updateProfile, resetChanges } = useProfileContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const authFetch = useAuthFetch();
  const { validateCompetences} = useValidation();

  /*Trigger error alert for 5 seconds*/
  const triggerError = (message: string, seconds = 5) => {
    setError(message);
    setTimeout(() => setError(null), seconds * 1000);
  };

  /*Trigger success alert for 5 seconds*/
  const triggerSuccess = (seconds = 5) => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), seconds * 1000);
  };
  
  // Update tempCompetences first, and only apply them when updateProfile is called
  const saveProfileChanges = async () => {
    try {

      if(!validateCompetences(tempCompetences)){
        throw new Error("Invalid competences");
      }
      

      const response = await authFetch(`/profile/competence`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          competences: tempCompetences,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        resetChanges();
        throw new Error(errorData.message || 'Failed to update competences');
      }
      triggerSuccess();
      const res = await response.json();
      

      updateProfile();
      
      return res.data;
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
  const handleAddCompetence = (newCompetence: Competence) => {
    if (newCompetence.years_of_experience <= 0 || newCompetence.years_of_experience >= 100) {
      triggerError("Years of experience must be greater than 0 and less than 100")
    }
    else {
      addCompetence(newCompetence);
    }
  }
  // Delete competence from temporary state
  const handleDeleteCompetence = (competence_id: number) => {
    deleteCompetence(competence_id); // Removes selected competence from tempCompetences
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!accessToken) return; // Ensures there's an access token before fetching

      // Check if competences are available in localStorage
      const cachedCompetences = localStorage.getItem("competences");
      if (cachedCompetences) {
        const parsedCompetences = JSON.parse(cachedCompetences);
        setCompetencesAndCache(parsedCompetences); // Use cached data if available
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const profileData = await authFetch(`/profile/competence`, {
        method: "GET",
      })
      const res = await profileData.json();

      if (res.data.competences && Array.isArray(res.data.competences)) {
          setCompetencesAndCache(res.data.competences); // Load data into competences
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

    fetchProfile();
  }, []); 

  return { 
    competences, 
    tempCompetences,
    loading, 
    error, 
    success,
    saveProfileChanges,
    handleDeleteCompetence,
    addCompetence,
    handleAddCompetence,
    resetChanges 
  };
};
