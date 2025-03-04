import { Box, Button, Typography } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import React from "react";
import { useApplication } from '../hooks/useApply';

const ApplicationForm: React.FC = () => {
    const { application, loading, error } = useApplication();

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
            <Typography variant="h6">Application Status</Typography>

            {loading && <Typography>Loading...</Typography>}
            {error && <Typography color="error">{error}</Typography>}
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
            >
                {application ? 'Update' : 'Send'}
            </Button>
        </Box>
    );
};

export default ApplicationForm;
