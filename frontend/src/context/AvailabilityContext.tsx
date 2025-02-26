import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the Availability type
interface Availability {
  availability_id: number; // Optional if not needed initially
  from_date: string;
  to_date: string;
}

// Define the context type
interface AvailabilityContextType {
  availabilities: Availability[];
  tempAvailabilities: Availability[];
  addAvailability: (newAvailability: Availability) => void;
  deleteAvailability: (from_date: string, to_date: string) => void;
  setAvailabilitiesAndCache: (newAvailabilities: Availability[]) => void;
  updateAvailability: () => void;  // New function
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
    newAvailability.availability_id = Date.now() //unique id for front end only
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

  const updateAvailability = () => {
    setAvailabilitiesAndCache(tempAvailabilities);
    console.log("Updated availability:", tempAvailabilities);
  };

  const deleteAvailability = (from_date: string, to_date: string) => {
    setTempAvailabilities((prev) => prev.filter((av) => !(av.from_date === from_date && av.to_date === to_date)));
    console.log("Deleted availability:", from_date, " to ", to_date);
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
