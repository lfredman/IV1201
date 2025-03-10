import { createContext, useState, useContext, ReactNode } from "react";

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

/**
 * The context type for managing competences.
 * 
 * This context provides the competences state, temporary competences state, and various actions like
 * adding, deleting, and updating competences.
 * 
 * @interface CompetenceContextType
 * @property {Competence[]} competences - The list of all competences.
 * @property {Competence[]} tempCompetences - The temporary list of competences for editing.
 * @property {(newCompetence: Competence) => void} addCompetence - Function to add or update a competence in the tempCompetences state.
 * @property {(competence_id: number) => void} deleteCompetence - Function to delete a competence by its id from the tempCompetences state.
 * @property {(newCompetences: Competence[]) => void} setCompetencesAndCache - Function to set the competences and store them in local storage.
 * @property {() => void} updateProfile - Function to update the profile by setting the tempCompetences as the final list of competences.
 * @property {() => void} resetChanges - Function to reset the changes made to tempCompetences and restore the original competences list.
 */
interface CompetenceContextType {
  competences: Competence[];
  tempCompetences: Competence[];
  addCompetence: (newCompetence: Competence) => void;
  deleteCompetence: (competence_id: number) => void;
  setCompetencesAndCache: (newCompetences: Competence[]) => void; 
  updateProfile: () => void; 
  resetChanges: () => void; 
}

/**
 * CompetenceContext provides a context for managing the competences data within the app.
 * It handles adding, deleting, updating, and caching the competences.
 * 
 * @const CompetenceContext
 * @type {React.Context<CompetenceContextType | undefined>}
 */

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

  /**
   * Sets the competences and caches them in local storage.
   * 
   * @param {Competence[]} newCompetences - The new list of competences to set and cache.
   */

  const setCompetencesAndCache = (newCompetences: Competence[]) => {
    setCompetences(newCompetences);
    setTempCompetences(newCompetences); // Sync temp state
    localStorage.setItem("competences", JSON.stringify(newCompetences)); 
  };

  /**
   * Adds a new competence or updates an existing one in the temporary state.
   * 
   * @param {Competence} newCompetence - The competence to add or update in the temporary state.
   */
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


   /**
   * Deletes a competence from the temporary state by its competence_id.
   * 
   * @param {number} id - The ID of the competence to delete.
   */
  
  const deleteCompetence = (id: number) => {
    setTempCompetences((prev) => prev.filter((comp) => comp.competence_id !== id));
  };

  /**
   * Updates the profile by setting the temporary competences as the final list of competences.
   */

  const updateProfile = () => {
    setCompetencesAndCache(tempCompetences);
  };

  /**
   * Resets any changes made to the temporary competences and restores the original competences list.
   */
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
