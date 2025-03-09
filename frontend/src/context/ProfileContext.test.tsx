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

// Test Component
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

// Render with Context
const renderWithContext = () => {
  return render(
    <ProfileProvider>
      <TestComponent />
    </ProfileProvider>
  );
};

// Tests
describe("ProfileProvider Context", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should add a competence to tempCompetences", async () => {
    renderWithContext();
    await userEvent.click(screen.getByText("Add Competence"));

    await waitFor(() => {
      expect(screen.getByTestId("temp-competences")).toHaveTextContent("React Development - 3 years");
    });
  });

  it("should delete a competence from tempCompetences", async () => {
    renderWithContext();
    await userEvent.click(screen.getByText("Add Competence"));
    await userEvent.click(screen.getByText("Delete Competence"));

    await waitFor(() => {
      expect(screen.getByTestId("temp-competences")).not.toHaveTextContent("React Development - 3 years");
    });
  });

  it("should set competences and cache in localStorage", async () => {
    renderWithContext();
    await userEvent.click(screen.getByText("Set & Cache"));

    await waitFor(() => {
      expect(screen.getByTestId("competences")).toHaveTextContent("React Development - 3 years");
      expect(localStorage.getItem("competences")).toBe(JSON.stringify([mockCompetence]));
    });
  });

  it("should update the profile and persist competences", async () => {
    renderWithContext();
    await userEvent.click(screen.getByText("Add Competence"));
    await userEvent.click(screen.getByText("Update Profile"));

    await waitFor(() => {
      expect(screen.getByTestId("competences")).toHaveTextContent("React Development - 3 years");
    });
  });

  it("should reset changes and revert tempCompetences", async () => {
    renderWithContext();
    await userEvent.click(screen.getByText("Add Competence"));
    await userEvent.click(screen.getByText("Reset Changes"));

    await waitFor(() => {
      expect(screen.getByTestId("temp-competences")).toBeEmptyDOMElement();
    });
  });
});
