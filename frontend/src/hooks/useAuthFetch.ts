import { useUser } from '../context/UserContext'; // Import your custom hook
import { useState } from 'react';

const useAuthFetch = () => {
  const { accessToken, refreshToken, updateAccessToken, logoutUser } = useUser();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const backendURL = 'http://localhost:3000';

  const authFetch = async (url: string, options: RequestInit = {}) => {
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    };

    try {
      const response = await fetch(backendURL+url, { ...options, headers });

      if (response.status === 401 && refreshToken && !isRefreshing) {
        setIsRefreshing(true);
        console.log("REFRESHING TOKEN")
        const refreshResponse = await fetch(`${backendURL}/account/refresh?refreshToken=${refreshToken}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });
          
        if (refreshResponse.ok) {
          const { data } = await refreshResponse.json();
          
          console.log(data.accessToken)
          updateAccessToken(data.accessToken);

          return fetch(backendURL+url, {
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
      console.error('Request failed:', error);
      return Promise.reject(error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return authFetch;
};

export default useAuthFetch;
