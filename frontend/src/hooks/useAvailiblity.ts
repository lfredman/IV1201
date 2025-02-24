import { useState } from "react";
import { useUser } from "../context/UserContext";

const { accessToken } = useUser();
const [availability, setAvailability] = useState<string[]>([]);
export async function saveAvailability(accessToken: string | null, start: string, end: string): Promise<void> {
    try {
        if (!accessToken) throw new Error("No access token found. Please log in.");

        const response = await fetch('http://127.0.0.1:3000/profile/availability', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from_date: start,
                to_date: end,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.message || 'Failed to save availability');
        }

        console.log('Availability saved successfully');
    } catch (err) {
        console.error('Error during saving availability:', err);
        throw err;
    }
};