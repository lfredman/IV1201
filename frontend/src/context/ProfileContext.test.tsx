import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProfileProvider, useProfile } from "./ProfileContext";

// Mock Competence Data
const mockCompetence = {
  competence_id: 1,
  competence_name: "React Development",
  years_of_experience: 3,
};

/**
 * Test component that interacts with ProfileContext, allowing adding,
 * deleting, updating, and resetting competences.
 */

const TestComponent = () => {
  const {
    competences,
    tempCompetences,
    addCompetence,
    deleteCompetence,
    setCompetencesAndCache,
    updateProfile,
    resetChanges,
  } = useProfile();

  return (
    <div>
      <div data-testid="competences">
        {competences.map((comp) => (
          <div key={comp.competence_id}>
            {comp.competence_name} - {comp.years_of_experience} years
          </div>
        ))}
      </div>
      <div data-testid="temp-competences">
        {tempCompetences.map((comp) => (
          <div key={comp.competence_id}>
            {comp.competence_name} - {comp.years_of_experience} years
          </div>
        ))}
      </div>
      <button onClick={() => addCompetence(mockCompetence)}>Add Competence</button>
      <button onClick={() => deleteCompetence(mockCompetence.competence_id)}>Delete Competence</button>
      <button onClick={() => setCompetencesAndCache([mockCompetence])}>Set & Cache</button>
      <button onClick={updateProfile}>Update Profile</button>
      <button onClick={resetChanges}>Reset Changes</button>
    </div>
  );
};

/**
 * Helper function that renders the TestComponent wrapped inside the ProfileProvider
 * to provide the necessary context for testing.
 */

const renderWithContext = () => {
  return render(
    <ProfileProvider>
      <TestComponent />
    </ProfileProvider>
  );
};

/**
 * Test suite for ProfileProvider context functionality, including adding,
 * deleting, updating competences, setting and caching competences in localStorage, 
 * and resetting changes.
 */

describe("ProfileProvider Context", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  /**
   * Test case to check that adding a competence works as expected,
   * by updating the `tempCompetences` and displaying the competence in the UI.
   */

  it("should add a competence to tempCompetences", async () => {
    renderWithContext();
    await userEvent.click(screen.getByText("Add Competence"));

    await waitFor(() => {
      expect(screen.getByTestId("temp-competences")).toHaveTextContent("React Development - 3 years");
    });
  });

  /**
   * Test case to verify that deleting a competence removes it from `tempCompetences`
   * and updates the UI accordingly.
   */

  it("should delete a competence from tempCompetences", async () => {
    renderWithContext();
    await userEvent.click(screen.getByText("Add Competence"));
    await userEvent.click(screen.getByText("Delete Competence"));

    await waitFor(() => {
      expect(screen.getByTestId("temp-competences")).not.toHaveTextContent("React Development - 3 years");
    });
  });

  /**
   * Test case to ensure that setting competences and caching them in localStorage
   * works as expected. It should store the competences and display them in the UI.
   */

  it("should set competences and cache in localStorage", async () => {
    renderWithContext();
    await userEvent.click(screen.getByText("Set & Cache"));

    await waitFor(() => {
      expect(screen.getByTestId("competences")).toHaveTextContent("React Development - 3 years");
      expect(localStorage.getItem("competences")).toBe(JSON.stringify([mockCompetence]));
    });
  });

   /**
   * Test case to check that updating the profile successfully persists the competences.
   * It should also update the `competences` displayed in the UI.
   */

  it("should update the profile and persist competences", async () => {
    renderWithContext();
    await userEvent.click(screen.getByText("Add Competence"));
    await userEvent.click(screen.getByText("Update Profile"));

    await waitFor(() => {
      expect(screen.getByTestId("competences")).toHaveTextContent("React Development - 3 years");
    });
  });

  /**
   * Test case to verify that resetting changes correctly reverts any temporary changes made
   * to `tempCompetences` and clears them from the UI.
   */

  it("should reset changes and revert tempCompetences", async () => {
    renderWithContext();
    await userEvent.click(screen.getByText("Add Competence"));
    await userEvent.click(screen.getByText("Reset Changes"));

    await waitFor(() => {
      expect(screen.getByTestId("temp-competences")).toBeEmptyDOMElement();
    });
  });
});
