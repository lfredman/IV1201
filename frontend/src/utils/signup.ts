// src/utils/auth.ts
import { User } from "../context/UserContext"; // Import User type from context

export async function signupUser(formData: {
    name: string;
    surname: string;
    pnr: string;
    username: string;
    email: string;
    password: string;
}
): Promise<{ message: string; accessToken: string; refreshToken: string; userData: User }> {
  try {
    const response = await fetch(`http://127.0.0.1:3000/account/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    // Check if the response is OK; otherwise, handle the error
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || "Signup failed");
    }

    const res = await response.json();

    console.log(res);
    // Validate response structure
    const { message, data } = res;
    if (!data || !data.user || !data.accessToken || !data.refreshToken) {
      throw new Error("Invalid response structure");
    }

    // Construct user data
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
    console.error("Error during signup:", err);
    throw err; // Propagate error to be handled by the caller
  }
}
