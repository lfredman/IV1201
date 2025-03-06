import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext"; // User context for tokens
import { useProfile as useProfileContext } from "../context/ProfileContext"; // Profile context
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
  const { user, accessToken } = useUser(); 
  const { competences, tempCompetences, setCompetencesAndCache, addCompetence, deleteCompetence, updateProfile, resetChanges } = useProfileContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const authFetch = useAuthFetch();
  const { validateCompetences} = useValidation();

  const triggerSuccess = (seconds = 5) => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), seconds * 1000);
  };
  
  // Update tempCompetences first, and only apply them when updateProfile is called
  const saveProfileChanges = async () => {
    console.log("TEMP", tempCompetences)
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
        throw new Error(errorData.message || 'Failed to update competences');
      }
      triggerSuccess();
      const res = await response.json();
      
      console.log(res.data.competences)
      console.log(competences);
      updateProfile(); // Apply tempCompetences to competence
      
      return res.data;
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating competences');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
      
    }
    

  };

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
      console.log("RES", res)

      if (res.data.competences && Array.isArray(res.data.competences)) {
          setCompetencesAndCache(res.data.competences); // Load data into competences
        }
      } catch (err) {
        console.error("Profile Fetch Error:", err);
        setError("Failed to fetch profile data.");
      } finally {
        setLoading(false);
        //setSuccess(true);
      }
    };

    fetchProfile();
  }, []); // ✅ Only re-fetch when token changes

  return { 
    competences, 
    tempCompetences, // Expose tempCompetences so UI can show changes before saving
    loading, 
    error, 
    success,
    saveProfileChanges, // Call this to apply changes
    handleDeleteCompetence,
    addCompetence,
    resetChanges // Call this to discard changes
  };
};
