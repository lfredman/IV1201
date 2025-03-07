import { Alert, Box, Button, Typography } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import React from "react";
import { useApplication } from '../hooks/useApply';

const ApplicationForm: React.FC = () => {
    const { application, loading, error, success,submitApplication } = useApplication();

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
                maxWidth: 400
            }}
        >
            <Typography variant="h6">Application</Typography>

            {loading && <Typography>Loading...</Typography>}
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">Your application has been submitted!</Alert>}
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
                                            <Typography>Status: {application.status}</Typography>

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
