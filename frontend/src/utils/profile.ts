export async function getProfile(accessToken: string | null): Promise<null> {
  try {
    if (!accessToken) {
      throw new Error("No access token found. Please log in.");
    }

    const response = await fetch(`http://127.0.0.1:3000/profile/competence`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`, // Include the token in the Authorization header
        'Content-Type': 'application/json',
      },
    });

    // Check for non-OK status codes and throw an error with response message
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || 'Failed to fetch profile data');
    }

    const res = await response.json();
    console.log(res);  // Optionally log or process the response
    return null;

  } catch (err) {
    console.error('Error during fetching profile data:', err);
    throw err; // Propagate error to be handled by the caller
  }
}