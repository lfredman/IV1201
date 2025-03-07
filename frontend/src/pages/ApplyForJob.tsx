import React from "react";
import { useUser } from "../context/UserContext";
import DateRangeScheduler from "../components/AvailabilityForm";
import { Box, Typography, Container, Grid } from "@mui/material";
import UserCompetences from "../components/UserCompetences";
import ApplicationForm from "../components/ApplicationForm";


/**
 * `ApplyForJob` Component
 *  Not done yet
 */
const ApplyForJob: React.FC = () => {
  const { user } = useUser();

  return (
    <Container sx={{ mt: 4 }}>
      {user ? (
        <Box>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 600 }}>
            Welcome to apply for a job, {user.name}
          </Typography>
          <Typography variant="h6" align="center" gutterBottom sx={{ mb: 4 }}>
            Start filling in your competencies & availability
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={8} md={6}>
              <ApplicationForm />
            </Grid>

            <Grid item xs={12} sm={8} md={6}>
              <UserCompetences editable={false} />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4 }}>
            <DateRangeScheduler />
          </Box>
        </Box>
      ) : (
        <Typography variant="h5" align="center" sx={{ fontWeight: 500, color: 'gray' }}>
          You must log in first to apply for a job
        </Typography>
      )}
    </Container>
  );
};

export default ApplyForJob;
