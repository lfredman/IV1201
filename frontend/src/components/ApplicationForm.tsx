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
                    <Typography>Status: {application.status}</Typography>
                    <Typography>Created at: {application.created_at}</Typography>
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
