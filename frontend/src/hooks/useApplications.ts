import { useState, useEffect } from "react";
import useAuthFetch from "./useAuthFetch";

export interface Application {
  person_id: number;
  username: string;
  name: string;
  surname: string;
  email: string;
  pnr: string;
  application_status: string;
  created_at: string;
  competences: { name: string; years: number }[];
}

const useApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const authFetch = useAuthFetch(); // Assuming this fetch is stable and does not change on each render

  const fetchApplications = async () => {
    console.log("APA")
    try {
      const response = await authFetch(`/admin/applications`, {
        method: "GET",
      });
      const res = await response.json();

      if (res.data && Array.isArray(res.data)) {
        setApplications(res.data);
      } else {
        setError("No applications found or invalid response format.");
      }
    } catch (err) {
      setError("Error fetching applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []); 

  const updateApplication = async (user_id: number, action: string) => {
    setLoading(true); // Set loading to true while fetching
    try {
      const response = await authFetch(`/admin/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: user_id,
          action: action,
        }),
      });
  
      const res = await response.json();
  
      if (res.data && Array.isArray(res.data)) {
        setApplications(prevApplications => {
          return prevApplications.map(application => 
            application.person_id === user_id 
              ? { ...application, ...res.data[0] }
              : application
          );
        });
      } else {
        setError("No applications found or invalid response format.");
      }
      return res.data[0];
    } catch (err) {
      setError("Error updating applications.");
    } finally {
      setLoading(false); // Set loading to false after the fetch is complete
    }
  };
  


  return { applications, loading, error, updateApplication };
};

export default useApplications;
