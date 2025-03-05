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
  
  const [success, setSuccess] = useState(false);

  const triggerSuccess = (seconds = 5) => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), seconds * 1000);
  };

  // Update tempAvalilibty first, and only apply them when updateProfile is called
  const saveAvailabilitiesChanges = async () => {
    console.log("TEMP", tempAvailabilities)
    try {
      const response = await authFetch(`/profile/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          availabilities: tempAvailabilities,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update availabilities');
      }
      triggerSuccess();
      const res = await response.json();
      setAvailabilitiesAndCache(res.data.availabilities);
      
      return res.data;
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating availabilities');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
    

  };

  
  const handleDeleteAvailability = (from_date: string, to_date: string) => {
    deleteAvailability(from_date, to_date); 
    //   
    };

  const add = (availability: any) => {
    addAvailability(availability); 
  }

  useEffect(() => {
    const fetchProfile = async () => {
      if (!accessToken) return; // Ensures there's an access token before fetching

      // Check if availibity are available in localStorage
      const cachedAvailibility = localStorage.getItem("availabilities");
      if (cachedAvailibility) {
        const parsedAvailibity = JSON.parse(cachedAvailibility);
        setAvailabilitiesAndCache(parsedAvailibity); // Use cached data if available
        return;
      }

      setLoading(true);
      setError(null);

      try {
          console.log("FETCHING AVAILABILITY")
          const response = await authFetch(`/profile/availability`, {
            method: 'GET'
          });
    
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update availability');
          }
    
          const res = await response.json();
          console.log("AVAILABILITIES RESPONSE: ", res.data.availabilities)

        if (res.data.availabilities) {
          setAvailabilitiesAndCache(res.data.availabilities); // Load data into availability
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
    tempAvailabilities, // Expose tempavailability so UI can show changes before saving
    error,
    loading,
    success,
    add,
    addAvailability,
    saveAvailabilitiesChanges, // Call this to apply changes
    handleDeleteAvailability,
    discardChanges // Call this to discard changes
  };
};
