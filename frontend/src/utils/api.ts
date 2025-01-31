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
  