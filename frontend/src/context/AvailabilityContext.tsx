import React, { createContext, useState, useContext, ReactNode } from "react";

/**
 * Availability type representing the available time range for a user.
 * 
 * @interface Availability
 * @property {number | null} [availability_id] - An optional unique ID for the availability entry.
 * @property {string} from_date - The start date of the availability.
 * @property {string} to_date - The end date of the availability.
 */

export interface Availability {
  availability_id?: number | null;
  from_date: string;
  to_date: string;
}

/**
 * The context type that defines all the operations available for managing availability.
 * 
 * @interface AvailabilityContextType
 * @property {Availability[]} availabilities - The current list of available time ranges.
 * @property {Availability[]} tempAvailabilities - A temporary list of availability for editing purposes.
 * @property {(newAvailability: Availability) => void} addAvailability - Function to add a new availability.
 * @property {(from_date: string, to_date: string) => void} deleteAvailability - Function to delete an availability based on date range.
 * @property {(newAvailabilities: Availability[]) => void} setAvailabilitiesAndCache - Function to update the availabilities and cache them in local storage.
 * @property {() => void} updateAvailability - Function to update the availabilities and store changes.
 * @property {(newAvailabilities: Availability[]) => void} setAvailabilities - Function to update the availabilities directly.
 * @property {() => void} saveAvailabilities - Function to save the temporary availabilities as the final list.
 * @property {() => void} discardChanges - Function to discard any changes made to the temporary availabilities.
 */

interface AvailabilityContextType {
  availabilities: Availability[];
  tempAvailabilities: Availability[];
  addAvailability: (newAvailability: Availability) => void;
  deleteAvailability: (from_date: string, to_date: string) => void;
  setAvailabilitiesAndCache: (newAvailabilities: Availability[]) => void;
  updateAvailability: () => void;  
  setAvailabilities: (newAvailabilities: Availability[]) => void;
  saveAvailabilities: () => void;  
  discardChanges: () => void;  
}

/**
 * The AvailabilityContext is used to provide and manage availability data throughout the app.
 * 
 * @const AvailabilityContext
 * @type {React.Context<AvailabilityContextType | undefined>}
 */

const AvailabilityContext = createContext<AvailabilityContextType | undefined>(undefined);

/**
 * AvailabilityProvider component wraps the children components and provides the context for availability management.
 * 
 * @param {ReactNode} children - The child components that will have access to the Availability context.
 * 
 * @returns {JSX.Element} The AvailabilityProvider component wrapping the children.
 */

export const AvailabilityProvider = ({ children }: { children: ReactNode }) => {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [tempAvailabilities, setTempAvailabilities] = useState<Availability[]>([]);

  /**
   * Set the availabilities and cache them in local storage.
   * 
   * @param {Availability[]} newAvailabilities - The new availabilities list to update and store.
   */
  
  
  const setAvailabilitiesAndCache = (newAvailabilities: Availability[]) => {
    setAvailabilities(newAvailabilities);
    setTempAvailabilities(newAvailabilities);
    localStorage.setItem("availabilities", JSON.stringify(newAvailabilities));
  }

  /**
   * Add a new availability or update an existing one in the tempAvailabilities state.
   * 
   * @param {Availability} newAvailability - The new availability to add or update.
   */

  const addAvailability = (newAvailability: Availability) => {
    newAvailability.availability_id = null;
    setTempAvailabilities((prev) => {
      const exists = prev.some(
        (av) => av.from_date === newAvailability.from_date && av.to_date === newAvailability.to_date
      );
  
      if (exists) {
        return prev.map((av) =>
          av.from_date === newAvailability.from_date && av.to_date === newAvailability.to_date
            ? newAvailability
            : av
        );
      } else {
        return [...prev, newAvailability];
      }
    });
  };

   /**
   * Update the availabilities by setting the temporary availabilities as the final list.
   */

  const updateAvailability = () => {
    setAvailabilitiesAndCache(tempAvailabilities);
  };

  /**
   * Delete an availability based on the date range provided.
   * 
   * @param {string} from_date - The start date of the availability to delete.
   * @param {string} to_date - The end date of the availability to delete.
   */

  const deleteAvailability = (from_date: string, to_date: string) => {
    setTempAvailabilities((prev) => prev.filter((av) => !(av.from_date === from_date && av.to_date === to_date)));
  };

  /**
   * Save the temporary availabilities as the final list.
   */
  const saveAvailabilities = () => {
    setAvailabilities(tempAvailabilities);
  };

  /**
   * Discard any changes made to the temporary availabilities and restore the original list.
   */

  const discardChanges = () => {
    setTempAvailabilities(availabilities);
  };


  return (
    <AvailabilityContext.Provider value={{availabilities, tempAvailabilities, saveAvailabilities,discardChanges, addAvailability, deleteAvailability, updateAvailability, setAvailabilities, setAvailabilitiesAndCache }}>
      {children}
    </AvailabilityContext.Provider>
  );
};

/**
 * Custom hook to use the AvailabilityContext.
 * 
 * @returns {AvailabilityContextType} The context value for managing availabilities.
 * 
 * @throws Will throw an error if used outside of an AvailabilityProvider.
 */

export const useAvailability = () => {
  const context = useContext(AvailabilityContext);
  if (!context) {
    throw new Error("useAvailability must be used within an AvailabilityProvider");
  }
  return context;
};
