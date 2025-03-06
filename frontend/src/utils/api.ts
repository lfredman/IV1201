

/**
 * Fetches a list of users or a specific user from the server based on the provided arguments.
 * 
 * The function makes a `GET` request to fetch user data. It supports:
 * - Fetching all users if no additional argument is provided.
 * - Fetching a specific user when an `id` (string or number) is provided as the second argument.
 * - Handling multiple user IDs when an array is provided (though not fully implemented in this version).
 *
 * @param token - A valid authentication token to authorize the request.
 * @param additional - An optional parameter that can be:
 *   - A single user ID (string or number) to fetch a specific user.
 *   - An array of user IDs to fetch multiple users (not implemented in this version).
 *   - Undefined or no argument, in which case all users will be fetched.
 * 
 * @returns {Promise<string>} A promise that resolves with the user data in JSON format (string).
 * @throws {Error} Throws an error if the fetch operation fails or if the API does not return a valid response.
 */
export async function getUsers(
    token: string,  // First argument must always be a single token (string)
    additional?: string | number | (string | number)[]  // Second argument is optional, can be string, number, or array
  ): Promise<string> {
    
    // Declare a variable to store the URL
    let url: string;
  
    // If the second argument is provided and it's an array, handle it as a list
    if (Array.isArray(additional)) {
      console.log("Handling multiple values:", additional);
      console.log("This is not implemented...");
      // Process the list (example: log all the values)
      additional.forEach(item => console.log(item));
      throw new Error('Failed to fetch users');
    } else if (additional !== undefined) {
      // If the second argument is a single string or number, fetch specific user
      console.log("Handling single value:", additional);
      url = `http://localhost:3000/persons/${additional}`;  // Construct URL with specific user ID
    } else {
      // If no `additional` argument, fetch all users
      console.log("Getting all users.");
      throw new Error('Failed to fetch users');
      url = 'http://localhost:3000/persons';  // Construct URL to get all users
    }
  
    // Fetch users with the provided token (still only one token is used in the fetch)
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,  // Use the single token for authorization
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
  
    const data = await response.json();
    console.log(data);
    return data;  // Assuming the response includes user data or token
  }
  