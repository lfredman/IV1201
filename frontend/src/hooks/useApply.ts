import { useState, useEffect } from "react";
import useAuthFetch  from "./useAuthFetch";

export const useApplication = () => {
    const [application, setApplication] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const authFetch = useAuthFetch();

    useEffect(() => {
        const fetchApplication = async () => {
            

            setLoading(true);
            setError(null);

            try {
            const response = await authFetch(`/profile/application`, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch application');
            }

            const res = await response.json();
            console.log("APPLICATION DATA:", res);

            if (res.data) {
                setApplication(res.data); // assuming backend sends application in res.data
            }
            } catch (err) {
            console.error("Application Fetch Error:", err);
            setError("Failed to fetch application.");
            } finally {
            setLoading(false);
            }
        };

        fetchApplication();
    }, []);

    return { application, loading, error };
};
