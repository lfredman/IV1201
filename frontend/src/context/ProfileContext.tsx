import React, { createContext, useState, useContext, ReactNode } from "react";

/**
 * Competence interface
 * 
 * This interface defines the structure for a competence object, which includes:
 * - competence_id: A unique identifier for the competence.
 * - competence_name: The name of the competence.
 * - years_of_experience: The number of years the user has experience in this competence.
 * 
 * @interface Competence
 */
export interface Competence {
  competence_id: number;
  competence_name: string;
  years_of_experience: number;
}

// Define the context type
interface CompetenceContextType {
  competences: Competence[];
  tempCompetences: Competence[];
  addCompetence: (newCompetence: Competence) => void;
  deleteCompetence: (competence_id: number) => void;
  setCompetencesAndCache: (newCompetences: Competence[]) => void; 
  updateProfile: () => void; 
  resetChanges: () => void; 
}

const CompetenceContext = createContext<CompetenceContextType | undefined>(undefined);

/**
 * ProfileProvider Component
 * 
 * This provider component wraps the application and provides the competences data
 * and functions (e.g., addCompetence, deleteCompetence, etc.) via the CompetenceContext.
 * It manages both the permanent competences state and temporary changes state, 
 * and syncs the data to local storage when updated.
 * 
 * @component
 * @param {Object} props - The component's props
 * @param {ReactNode} props.children - The children components to be wrapped by this provider.
 * 
 * @returns {JSX.Element} The wrapped children components with context provided.
 */
export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [competences, setCompetences] = useState<Competence[]>([]); // Stored competences (permanent locally)
  const [tempCompetences, setTempCompetences] = useState<Competence[]>([]); // Temporary changes

  const setCompetencesAndCache = (newCompetences: Competence[]) => {
    setCompetences(newCompetences);
    setTempCompetences(newCompetences); // Sync temp state
    localStorage.setItem("competences", JSON.stringify(newCompetences)); 
  };
  // Add or update competence in temporary state
  const addCompetence = (newCompetence: Competence) => {
    setTempCompetences((prev) => {
      // Check if competence already exists
      const exists = prev.some(comp => comp.competence_id === newCompetence.competence_id);
      
      if (exists) {
        return prev.map(comp =>
          comp.competence_id === newCompetence.competence_id ? { ...comp, ...newCompetence } : comp
        );
      } else {
        return [...prev, newCompetence]; // Add new competence
      }
    });
  };

  // Delete competence from temporary state
  const deleteCompetence = (id: number) => {
    setTempCompetences((prev) => prev.filter((comp) => comp.competence_id !== id));
  };

  const updateProfile = () => {
    setCompetencesAndCache(tempCompetences);
  };

  const resetChanges = () => {
    setTempCompetences(competences); // Reset temp changes
  };


  return (
    <CompetenceContext.Provider value={{ competences, tempCompetences, setCompetencesAndCache, addCompetence, deleteCompetence, updateProfile, resetChanges }}>
      {children}
    </CompetenceContext.Provider>
  );
};

/**
 * useProfile Hook
 * 
 * This custom hook allows any component to easily access the competences context.
 * It provides a convenient way to use the context's state and functions.
 * 
 * @hook
 * @returns {CompetenceContextType} The context value with competences data and functions.
 * 
 * @throws {Error} If used outside of the ProfileProvider.
 */
export const useProfile = () => {
  const context = useContext(CompetenceContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
