import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the Availability type
interface Availability {
  availability_id?: number; // Optional if not needed initially
  from_date: string;
  to_date: string;
}

// Define the context type
interface AvailabilityContextType {
  availabilities: Availability[];
  tempAvailabilities: Availability[];
  addAvailability: (newAvailability: Availability) => void;
  deleteAvailability: (availability_id: number) => void;
  setAvailabilitiesAndCache: (newAvailabilities: Availability[]) => void;
  updateAvailability: (updatedAvailability: Availability) => void;  // New function
  setAvailabilities: (newAvailabilities: Availability[]) => void;
  saveAvailabilities: () => void;  // New function
  discardChanges: () => void;  // New function
}

const AvailabilityContext = createContext<AvailabilityContextType | undefined>(undefined);

export const AvailabilityProvider = ({ children }: { children: ReactNode }) => {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [tempAvailabilities, setTempAvailabilities] = useState<Availability[]>([]);
  
  const setAvailabilitiesAndCache = (newAvailabilities: Availability[]) => {
    setAvailabilities(newAvailabilities);
    setTempAvailabilities(newAvailabilities);
    localStorage.setItem("availabilities", JSON.stringify(newAvailabilities));
    }

    const addAvailability = (newAvailability: Availability) => {
    setTempAvailabilities((prev) => {
      if (prev.length === 0) {
        console.log("Adding the first availability");
        return [{ ...newAvailability, availability_id: Date.now() }];
      }

      const exists = prev.some(
        (av) =>
          av.from_date === newAvailability.from_date &&
          av.to_date === newAvailability.to_date
      );

      if (exists) {
        console.log("Availability already exists. Updating...");
        return prev.map((av) =>
          av.from_date === newAvailability.from_date && av.to_date === newAvailability.to_date
            ? { ...newAvailability, availability_id: av.availability_id }
            : av
        );
      } else {
        console.log("Adding a new availability");
        return [...prev, { ...newAvailability, availability_id: Date.now() }];
      }
    });
  };

  const updateAvailability = () => {
    setAvailabilitiesAndCache(tempAvailabilities);
    console.log("Updated availability:", tempAvailabilities);
  };

  const deleteAvailability = (availability_id: number) => {
    setTempAvailabilities((prev) => prev.filter((av) => av.availability_id !== availability_id));
    console.log("Deleted availability:", availability_id);
  };

  React.useEffect(() => {
    console.log("Updated availabilities:", availabilities);
  }, [availabilities]);

  const saveAvailabilities = () => {
    setAvailabilities(tempAvailabilities);
    console.log("Changes saved.");
  };

  const discardChanges = () => {
    setTempAvailabilities(availabilities);
    console.log("Changes discarded.");
  };


  return (
    <AvailabilityContext.Provider value={{availabilities, tempAvailabilities, saveAvailabilities,discardChanges, addAvailability, deleteAvailability, updateAvailability, setAvailabilities, setAvailabilitiesAndCache }}>
      {children}
    </AvailabilityContext.Provider>
  );
};

// Custom hook to use the AvailabilityContext
export const useAvailability = () => {
  const context = useContext(AvailabilityContext);
  if (!context) {
    throw new Error("useAvailability must be used within an AvailabilityProvider");
  }
  return context;
};
