import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AvailabilityProvider, useAvailability } from "./AvailabilityContext";

// Helper component to test the context
const TestComponent = () => {
  const {
    availabilities,
    tempAvailabilities,
    addAvailability,
    deleteAvailability,
    updateAvailability,
    saveAvailabilities,
    discardChanges,
  } = useAvailability();

  return (
    <div>
      <div data-testid="availabilities">
        {availabilities.map((av, index) => (
          <div key={index}>
            {av.from_date} - {av.to_date}
          </div>
        ))}
      </div>
      <div data-testid="temp-availabilities">
        {tempAvailabilities.map((av, index) => (
          <div key={index}>
            {av.from_date} - {av.to_date}
          </div>
        ))}
      </div>
      <button onClick={() => addAvailability({ from_date: "2023-10-01", to_date: "2023-10-05" })}>
        Add Availability
      </button>
      <button onClick={() => deleteAvailability("2023-10-01", "2023-10-05")}>
        Delete Availability
      </button>
      <button onClick={updateAvailability}>Update Availability</button>
      <button onClick={saveAvailabilities}>Save Changes</button>
      <button onClick={discardChanges}>Discard Changes</button>
    </div>
  );
};

// Wrap the component with the context
const renderWithContext = () => {
  return render(
    <AvailabilityProvider>
      <TestComponent />
    </AvailabilityProvider>
  );
};

// Test cases
describe("AvailabilityContext", () => {
  beforeEach(() => {
    localStorage.clear(); // Clear localStorage before each test
  });

  it("should add an availability to tempAvailabilities", async () => {
    renderWithContext();

    // Click the "Add Availability" button
    await userEvent.click(screen.getByText("Add Availability"));

    // Check if the availability is added to tempAvailabilities
    await waitFor(() => {
      expect(screen.getByTestId("temp-availabilities")).toHaveTextContent("2023-10-01 - 2023-10-05");
    });
  });

  it("should delete an availability from tempAvailabilities", async () => {
    renderWithContext();

    // Add an availability
    await userEvent.click(screen.getByText("Add Availability"));

    // Delete the availability
    await userEvent.click(screen.getByText("Delete Availability"));

    // Check if the availability is removed from tempAvailabilities
    await waitFor(() => {
      expect(screen.getByTestId("temp-availabilities")).not.toHaveTextContent("2023-10-01 - 2023-10-05");
    });
  });

  it("should update availabilities and persist in localStorage", async () => {
    renderWithContext();

    // Add an availability
    await userEvent.click(screen.getByText("Add Availability"));

    // Update availabilities
    await userEvent.click(screen.getByText("Update Availability"));

    // Check if the availability is updated and persisted in localStorage
    await waitFor(() => {
      expect(screen.getByTestId("availabilities")).toHaveTextContent("2023-10-01 - 2023-10-05");
      expect(localStorage.getItem("availabilities")).toBe(
        JSON.stringify([{ from_date: "2023-10-01", to_date: "2023-10-05", availability_id: null }])
      );
    });
  });

  it("should save changes and update availabilities", async () => {
    renderWithContext();

    // Add an availability
    await userEvent.click(screen.getByText("Add Availability"));

    // Save changes
    await userEvent.click(screen.getByText("Save Changes"));

    // Check if the availability is saved to availabilities
    await waitFor(() => {
      expect(screen.getByTestId("availabilities")).toHaveTextContent("2023-10-01 - 2023-10-05");
    });
  });

  it("should discard changes and reset tempAvailabilities", async () => {
    renderWithContext();

    // Add an availability
    await userEvent.click(screen.getByText("Add Availability"));

    // Discard changes
    await userEvent.click(screen.getByText("Discard Changes"));

    // Check if tempAvailabilities is reset
    await waitFor(() => {
      expect(screen.getByTestId("temp-availabilities")).not.toHaveTextContent("2023-10-01 - 2023-10-05");
    });
  });
});