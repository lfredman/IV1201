import { useEffect, useState } from "react";
import { getProfile } from "../utils/profile"; // API call function
import { useUser } from "../context/UserContext"; // User context for tokens
import { useAvailability as useAvailabilityContext } from "../context/AvailabilityContext"; // Profile context
import useAuthFetch  from "./useAuthFetch";

export const useAvailability = () => {
  const { user, accessToken } = useUser(); 
  const {availabilities, tempAvailabilities, saveAvailabilities,discardChanges, addAvailability, deleteAvailability, updateAvailability, setAvailabilitiesAndCache} = useAvailabilityContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const authFetch = useAuthFetch();

  // Update tempCompetences first, and only apply them when updateProfile is called
  const saveAvailabilitiesChanges = async () => {
    console.log("TEMP", tempAvailabilities)
    try {
      const response = await authFetch(`/profile/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          availabilities: availabilities,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update competences');
      }

      const res = await response.json();
      console.log(res.data.availabilities)

      //setAvailabilitiesAndCache(res.data.av)
      //updateAvailability(); 
      
      return res.data;
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating competences');
      console.error(err);
      throw err;
    }
    

  };

  // Delete competence from temporary state
  const handleDeleteAvailability = (competence_id: number) => {
    deleteAvailability(competence_id); // Removes selected competence from tempCompetences
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!accessToken) return; // Ensures there's an access token before fetching

      // Check if competences are available in localStorage
      const cachedCompetences = localStorage.getItem("competences");
      if (cachedCompetences) {
        const parsedCompetences = JSON.parse(cachedCompetences);
        setAvailabilitiesAndCache(parsedCompetences); // Use cached data if available
        return;
      }

      setLoading(true);
      setError(null);

      try {
          const response = await authFetch(`/profile/availability`, {
            method: 'GET',

            body: JSON.stringify({
              availabilities: availabilities,
            }),
          });
    
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update competences');
          }
    
          const res = await response.json();
          console.log(res.data.availabilities)

        if (res.data.availabilities) {
          setAvailabilitiesAndCache(res.data.availabilities); // Load data into competences
        }
      } catch (err) {
        console.error("Profile Fetch Error:", err);
        setError("Failed to fetch profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [accessToken]); // ✅ Only re-fetch when token changes

  return { 
    availabilities, 
    tempAvailabilities, // Expose tempCompetences so UI can show changes before saving
    loading, 
    error, 
    saveAvailabilitiesChanges, // Call this to apply changes
    handleDeleteAvailability,
    discardChanges // Call this to discard changes
  };
};
