import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext"; // User context for tokens
import { useAvailability as useAvailabilityContext } from "../context/AvailabilityContext"; // Profile context
import useAuthFetch  from "./useAuthFetch";

/**
 * Custom hook for managing user availability.
 * 
 * This hook provides functionalities to:
 * - Fetch user availability from the backend.
 * - Temporarily store availability changes before committing them.
 * - Save or discard availability changes.
 * - Handle errors and success states.
 * 
 * @returns {Object} The hook's return values, including:
 * - `availabilities`: The current availability data.
 * - `tempAvailabilities`: Temporarily stored availability before being saved.
 * - `error`: Error message if something goes wrong.
 * - `loading`: Boolean indicating if a request is in progress.
 * - `success`: Boolean indicating if an operation was successful.
 * - `add`: Function to add a new availability.
 * - `addAvailability`: Function to add availability directly to context.
 * - `saveAvailabilitiesChanges`: Function to commit temporary changes.
 * - `handleDeleteAvailability`: Function to delete an availability.
 * - `discardChanges`: Function to discard temporary changes.
 */

export const useAvailability = () => {
  const { accessToken } = useUser(); 
  const {availabilities, tempAvailabilities,discardChanges, addAvailability, deleteAvailability, setAvailabilitiesAndCache} = useAvailabilityContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const authFetch = useAuthFetch();
  
  const [success, setSuccess] = useState(false);

  const triggerError = (message: string, seconds = 5) => {
    setError(message);
    setTimeout(() => setError(null), seconds * 1000);
  };
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

  
  const handleDeleteAvailability = (from_date: string, to_date: string) => {
    deleteAvailability(from_date, to_date); 
  };

  interface Availability {
    from_date: string;
    to_date: string;
  }

  const add = (availability: Availability) => {
    console.log("AVA", availability)
    if (availability.from_date === 'Invalid Date' || availability.to_date === 'Invalid Date') {
      triggerError("Availability contains invalid dates!");
    }
    else if (availability.to_date < availability.from_date) {
      triggerError("To date must be later than from date!");
    }
    else {
      addAvailability(availability);
    }
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
        triggerError("Failed to fetch profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [accessToken]);
  
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
