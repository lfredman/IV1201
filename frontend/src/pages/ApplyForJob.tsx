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
<Typography 
  variant="h5" 
  align="center" 
  gutterBottom 
  sx={{ 
    fontWeight: 600, 
    color: "white", 
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" // Added shadow effect
  }}
>
  Welcome to apply for a job, {user.name}
</Typography>

<Typography 
  variant="h6" 
  align="center" 
  gutterBottom 
  sx={{ 
    mb: 4, 
    color: "white", 
    textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)" // Added shadow effect
  }}
>
  Start by filling in your competencies and availability
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
