import { useState, useEffect } from "react";
import useAuthFetch  from "./useAuthFetch";

export const useApplication = () => {
    const [application, setApplication] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const authFetch = useAuthFetch();

    const triggerError = (message: string, seconds = 5) => {
        setError(message);
        setTimeout(() => setError(null), seconds * 1000);
    };

    const triggerSuccess = (seconds = 5) => {
        setSuccess(true);
        setTimeout(() => setSuccess(false), seconds * 1000);
    };

    const loadFromCache = () => {
        const cachedApplication = localStorage.getItem("application");
        if (cachedApplication) {
        const parsedApplication = JSON.parse(cachedApplication);
        setApplication(parsedApplication);
        }
    };

    // Save to localStorage
    const saveToCache = (data: any) => {
        localStorage.setItem("application", JSON.stringify(data));
        setApplication(data); // Also update the state
    };

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
                triggerError("Failed to fetch application.");
            } finally {
                setLoading(false);
            }
        };

        fetchApplication();
    }, []);

    const submitApplication = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await authFetch(`/profile/application`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                const message = errorData.message || 'Failed to submit application';
                console.log('Throwing error:', message);
                throw new Error(message);
            }

            const res = await response.json();
            triggerSuccess();
            console.log("APPLICATION SUBMIT RESPONSE:", res);

            if (res.data) {
                setApplication(res.data);
            }
        } catch (err) {
            if (err instanceof Error) {
                console.error('Caught error:', err.message);
                triggerError(err.message);
            } else {
                console.error('Caught unknown error:', err);
                triggerError('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return { application, submitApplication, loading, error, success };
};
