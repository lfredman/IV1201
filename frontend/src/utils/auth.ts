// src/utils/auth.ts
import { User } from "../context/UserContext"; // Import User type from context

export async function loginUser(username: string, password: string): Promise<{ message: string; token: string; userData: User }> {
  const response = await fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  console.log(data);

  // Assuming the response includes message, token, and userData
  // Explicitly type the userData object
  const userData: User = {
    username: data.userData.username,
    token: data.token,
    person_id: data.userData.person_id,
    role_id: data.userData.role_id,
    name: data.userData.name,  // Default value if null or undefined
    surname: data.userData.surname,  // Default value if null or undefined
    email: data.userData.email,  // Default value if null or undefined
    pnr: data.userData.pnr,  // Default value of 0 if null
  };

  return {
    message: data.message,
    token: data.token,
    userData, // Return the properly typed userData
  };
}
