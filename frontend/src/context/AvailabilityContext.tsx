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
  addAvailability: (newAvailability: Availability) => void;
  deleteAvailability: (availability_id: number) => void;
  updateAvailability: (updatedAvailability: Availability) => void;  // New function
  setAvailabilities: (newAvailabilities: Availability[]) => void;
}

const AvailabilityContext = createContext<AvailabilityContextType | undefined>(undefined);

export const AvailabilityProvider = ({ children }: { children: ReactNode }) => {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);

  const addAvailability = (newAvailability: Availability) => {
    setAvailabilities((prev) => {
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

  const updateAvailability = (updatedAvailability: Availability) => {
    setAvailabilities((prev) =>
      prev.map((av) =>
        av.availability_id === updatedAvailability.availability_id
          ? updatedAvailability
          : av
      )
    );
    console.log("Updated availability:", updatedAvailability);
  };

  const deleteAvailability = (availability_id: number) => {
    setAvailabilities((prev) => prev.filter((av) => av.availability_id !== availability_id));
    console.log("Deleted availability:", availability_id);
  };

  React.useEffect(() => {
    console.log("Updated availabilities:", availabilities);
  }, [availabilities]);

  return (
    <AvailabilityContext.Provider value={{ availabilities, addAvailability, deleteAvailability, updateAvailability, setAvailabilities }}>
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
