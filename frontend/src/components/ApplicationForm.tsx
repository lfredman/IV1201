import { Alert, Box, Button, Typography } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import React from "react";
import { useApplication } from '../hooks/useApply';

/**
 * ApplicationForm Component
 *
 * This component allows users to submit or update a job application. It provides:
 * - Display of the current application status if one exists.
 * - Submission button to create or update an application.
 * - Loading, success, and error messages for feedback.
 *
 * Uses:
 * - `useApplication` hook to manage application state and submission.
 *
 * Features:
 * - Displays application details (status and creation date) if already submitted.
 * - Shows relevant messages if no application is found.
 * - Role-based UI feedback based on application status (accepted, rejected, unhandled).
 *
 * @returns {JSX.Element} The rendered application form with submission functionality.
 */

const ApplicationForm: React.FC = () => {
    const { application, loading, error, success, submitApplication } = useApplication();

    const handleSubmit = async () => {
        await submitApplication();
    };

    return (
        <Box
            sx={{
                mx: 'auto',
                mt: 5,
                p: 3,
                borderRadius: 2,
                boxShadow: 3,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                maxWidth: 400,
                backgroundColor: "white",

            }}
        >
            <Typography variant="h5">Application</Typography>

            {loading && <Typography>Loading...</Typography>}
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">Your application has been submitted!</Alert>}
            {!application && !error && !loading && (
                <Typography
                    style={{ fontSize: '0.8rem', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}
                >
                    You have not submitted any application! <br />
                    Add your availability + competences and click submit!
                </Typography>

            )}
            {application && (
                <>
                    <Box
                        component="span"
                        sx={{
                            display: "inline-block",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontWeight: "bold",
                            backgroundColor: application.status === "accepted"
                                ? "green"
                                : application.status === "rejected"
                                    ? "red"
                                    : "orange",
                            color: "white",
                            marginLeft: "8px",
                        }}
                    >
                        <Typography>Status: {application.status.charAt(0).toUpperCase() + application.status.slice(1).replace(/_/g, ' ')}</Typography>

                    </Box>
                    <Typography>Created at: {new Date(application.created_at).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false,
                    })}</Typography>
                </>
            )}

            <Button
                variant="contained"
                endIcon={<SendIcon />}
                disabled={loading}
                onClick={handleSubmit}
            >
                {application ? 'Update' : 'Submit'}
            </Button>
        </Box>
    );
};

export default ApplicationForm;
