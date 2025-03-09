// src/utils/auth.ts
import { User } from "../context/UserContext"; // Import User type from context


/**
 * Logs a user in by sending login credentials to the server and retrieves user data along with access and refresh tokens.
 * 
 * @param loginField - The username or email of the user.
 * @param password - The user's password.
 * @returns A promise that resolves to an object containing:
 *   - message: A string message indicating the result of the login attempt.
 *   - accessToken: The JWT access token for authenticating future requests.
 *   - refreshToken: The JWT refresh token used to renew the access token.
 *   - userData: The user's data (username, role, email, etc.).
 * @throws Will throw an error if the login request fails or the response structure is invalid.
 */
export async function loginUser(loginField: string, password: string): Promise<{ message: string; accessToken: string; refreshToken: string; userData: User }> {
  try {

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    if (!BACKEND_URL){
      throw new Error('Could not find backend server!');
    }
    
    const response = await fetch(`${BACKEND_URL}/account/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ loginField, password }),
    });

    // Check for non-OK status codes and throw an error with response message
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || 'Login failed');
    }

    const res = await response.json();
    
    // Validate response structure to ensure all required fields exist
    const { data } = res;
    if (!data || !data.user || !data.accessToken || !data.refreshToken) {
      throw new Error('Invalid response structure');
    }

    // Use optional chaining and provide defaults for missing values
    const userData: User = {
      username: data.user.username,
      person_id: data.user.person_id,
      role_id: data.user.role_id || -1,
      name: data.user.name || '',
      surname: data.user.surname || '',
      email: data.user.email || '',
      pnr: data.user.pnr || 0,
    };

    return {
      message: res.message,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      userData,
    };
  } catch (err) {
    console.error('Error during login:', err);
    throw err; // Propagate error to be handled by the caller
  }
}
