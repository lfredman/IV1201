import { useEffect, useState } from "react";
import { getProfile } from "../utils/profile"; // API call function
import { useUser } from "../context/UserContext"; // User context for tokens
import { useProfile as useProfileContext } from "../context/ProfileContext"; // Profile context

export const useProfile = () => {
  const { user, accessToken } = useUser(); 
  const { competences, tempCompetences, setCompetencesAndCache, addCompetence, deleteCompetence, updateProfile, resetChanges } = useProfileContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update tempCompetences first, and only apply them when updateProfile is called
  const saveProfileChanges = () => {
    updateProfile(); // Apply tempCompetences to competences
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
        const profileData = await getProfile(accessToken); // Fetch data from API

        if (profileData) {
          setCompetencesAndCache(profileData); // Load data into competences
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
    competences, 
    tempCompetences, // Expose tempCompetences so UI can show changes before saving
    loading, 
    error, 
    saveProfileChanges, // Call this to apply changes
    handleDeleteCompetence,
    resetChanges // Call this to discard changes
  };
};
