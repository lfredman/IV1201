import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { UserProvider, useUser } from "../context/UserContext";



// Mock user data
const mockUser = {
  username: "john_doe",
  person_id: 100000,
  role_id: 1,
  name: "John",
  surname: "Doe",
  email: "john@example.com",
  pnr: 1234567800,
};

/**
 * Test component that uses the UserContext to display and manage user state.
 * It allows login, logout, and token update for testing purposes.
 */

const TestComponent = () => {
  const { user, loginUser, logoutUser, updateAccessToken, accessToken } = useUser();

  return (
    <div>
      {user ? (
        <>
          <h1>{user.name} {user.surname}</h1>
          <p>{user.email}</p>
          <p>Token: {accessToken}</p>
          <button onClick={logoutUser}>Logout</button>
          <button onClick={() => updateAccessToken("new-access-token")}>Update Token</button>
        </>
      ) : (
        <>
          <p>No user logged in</p>
          <button onClick={() => loginUser(mockUser, "mock-access-token", "mock-refresh-token")}>
            Login
          </button>
        </>
      )}
    </div>
  );
};

/**
 * Wrapper function to render the TestComponent with the UserProvider
 * and BrowserRouter context for routing.
 */

const renderWithContext = () => {
  return render(
    <BrowserRouter>
      <UserProvider>
        <TestComponent />
      </UserProvider>
    </BrowserRouter>
  );
};

/**
 * Test suite for the UserContext functionality, including login, logout,
 * token management, and data persistence using localStorage.
 */

describe("UserContext", () => {
  beforeEach(() => {
    localStorage.clear(); // Ensure no previous data remains
  });

  /**
   * Test case to check that the app initially shows "No user logged in"
   * when no user is logged in.
   */


  it("should start with no user logged in", () => {
    renderWithContext();
    expect(screen.getByText("No user logged in")).toBeInTheDocument();
  });

  /**
   * Test case to check that when a user logs in, their data is stored
   * in localStorage and displayed in the UI.
   */

  it("should allow user to log in and store data", async () => {
    renderWithContext();
    await userEvent.click(screen.getByText("Login"));
    

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
      expect(screen.getByText("Token: mock-access-token")).toBeInTheDocument();
    });

    expect(localStorage.getItem("user")).toBe(JSON.stringify(mockUser));
    expect(localStorage.getItem("accessToken")).toBe("mock-access-token");
    expect(localStorage.getItem("refreshToken")).toBe("mock-refresh-token");
  });

  /**
   * Test case to check that when the user logs out, their data is cleared
   * from localStorage and the UI is updated to reflect that no user is logged in.
   */

  it("should allow user to log out and clear data", async () => {
    renderWithContext();
    await userEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText("Logout"));

    await waitFor(() => {
      expect(screen.getByText("No user logged in")).toBeInTheDocument();
    });

    expect(localStorage.getItem("user")).toBeNull();
    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(localStorage.getItem("refreshToken")).toBeNull();
  });

  /**
   * Test case to check that when the user updates their access token,
   * the updated token is reflected in the UI and saved in localStorage.
   */

  it("should update access token", async () => {
    renderWithContext();
    await userEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(screen.getByText("Token: mock-access-token")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText("Update Token"));

    await waitFor(() => {
      expect(screen.getByText("Token: new-access-token")).toBeInTheDocument();
    });

    expect(localStorage.getItem("accessToken")).toBe("new-access-token");
  });

  it("should load user data from localStorage on app start", async () => {
    localStorage.setItem("user", JSON.stringify(mockUser));
    localStorage.setItem("accessToken", "saved-access-token");
    localStorage.setItem("refreshToken", "saved-refresh-token");

    renderWithContext();

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Token: saved-access-token")).toBeInTheDocument();
    });
  });
});