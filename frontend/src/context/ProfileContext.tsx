import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the Competence type with an id
interface Competence {
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

  const clearCachedCompetences = () => {
    localStorage.removeItem("competences");
  }

  return (
    <CompetenceContext.Provider value={{ competences, tempCompetences, setCompetencesAndCache, addCompetence, deleteCompetence, updateProfile, resetChanges }}>
      {children}
    </CompetenceContext.Provider>
  );
};

// Custom hook to use the CompetenceContext
export const useProfile = () => {
  const context = useContext(CompetenceContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
