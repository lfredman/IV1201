import { useUser } from '../context/UserContext'; // Import your custom hook
import { useState, useCallback } from 'react';

const useAuthFetch = () => {
  const { accessToken, refreshToken, updateAccessToken, logoutUser } = useUser();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  if (!BACKEND_URL){
    throw new Error('Could not find backend server!');
  }

  // Memoizing authFetch to ensure it doesn't change on each render
  const authFetch = useCallback(
    async (url: string, options: RequestInit = {}, customToken?: string) => {
      const tokenToUse = customToken ?? accessToken; // Use the provided token or fallback to state token

      const headers = {
        ...options.headers,
        Authorization: `Bearer ${tokenToUse}`,
      };

      try {
        const response = await fetch(BACKEND_URL + url, { ...options, headers });

        if (response.status === 401 && refreshToken && !isRefreshing) {
          setIsRefreshing(true);
          console.log("REFRESHING TOKEN");

          const refreshResponse = await fetch(`${BACKEND_URL}/account/refresh?refreshToken=${refreshToken}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });

          if (refreshResponse.ok) {
            const { data } = await refreshResponse.json();
            console.log("NEW TOKEN", data.accessToken);
            updateAccessToken(data.accessToken);

            return fetch(BACKEND_URL + url, {
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
    [accessToken, refreshToken, isRefreshing, updateAccessToken, logoutUser, BACKEND_URL] // Add dependencies to ensure stable function
  );

  return authFetch;
};

export default useAuthFetch;
