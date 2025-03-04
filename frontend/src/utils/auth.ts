// src/utils/auth.ts
import { User } from "../context/UserContext"; // Import User type from context

export async function loginUser(loginField: string, password: string): Promise<{ message: string; accessToken: string; refreshToken: string; userData: User }> {
  try {
    //const response = await fetch(`http://127.0.0.1:3000/account/login`, {
    const response = await fetch(`https://iv1201backend-aaa2e6c3c425.herokuapp.com/account/login`, {
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
    const { message, data } = res;
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
