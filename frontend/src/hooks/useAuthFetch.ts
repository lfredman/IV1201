import { useUser } from '../context/UserContext'; // Import your custom hook
import { useState, useCallback } from 'react';

/**
 * useAuthFetch custom hook
 * 
 * This custom hook provides a fetch function (`authFetch`) that automatically includes an Authorization
 * header with the access token for authenticated API requests. It handles token refreshing when the 
 * current access token expires (HTTP 401 status), and retries the failed request with the new token.
 * 
 * - It handles authentication and refresh token logic for the request.
 * - If a request returns a 401 error, it attempts to refresh the access token using the refresh token.
 * - The token is updated automatically without the user needing to manually log in again.
 * 
 * @returns {Function} The `authFetch` function that can be used for making authenticated API requests.
 * 
 * @example
 * const authFetch = useAuthFetch();
 * const response = await authFetch('/api/data');
 */
const useAuthFetch = () => {
  const { accessToken, refreshToken, updateAccessToken, logoutUser } = useUser();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const backendURL = 'http://localhost:3000';

  // Memoizing authFetch to ensure it doesn't change on each render
  const authFetch = useCallback(
    async (url: string, options: RequestInit = {}, customToken?: string) => {
      const tokenToUse = customToken ?? accessToken; // Use the provided token or fallback to state token

      const headers = {
        ...options.headers,
        Authorization: `Bearer ${tokenToUse}`,
      };

      try {
        const response = await fetch(backendURL + url, { ...options, headers });

        if (response.status === 401 && refreshToken && !isRefreshing) {
          setIsRefreshing(true);
          console.log("REFRESHING TOKEN");

          const refreshResponse = await fetch(`${backendURL}/account/refresh?refreshToken=${refreshToken}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });

          if (refreshResponse.ok) {
            const { data } = await refreshResponse.json();
            console.log("NEW TOKEN", data.accessToken);
            updateAccessToken(data.accessToken);

            return fetch(backendURL + url, {
              ...options,
              headers: {
                ...options.headers,
                Authorization: `Bearer ${data.accessToken}`,
              },
            });
          } else {
            logoutUser();
            return Promise.reject(new Error('Session expired. Please log in again.'));
          }
        }

        return response;
      } catch (error) {
        // Check for network errors like net::ERR_CONNECTION_REFUSED
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
          console.error('Network error or server unreachable:', error);
          return Promise.reject(new Error('Unable to connect to the server. Please check your internet connection or try again later.'));
        }

        // Catch any other errors
        console.error('Request failed:', error);
        return Promise.reject(error);
      } finally {
        setIsRefreshing(false);
      }
    },
    [accessToken, refreshToken, isRefreshing, updateAccessToken, logoutUser, backendURL] // Add dependencies to ensure stable function
  );

  return authFetch;
};

export default useAuthFetch;
