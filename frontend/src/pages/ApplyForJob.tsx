import React from "react";
import ApplyForAJob from "../components/ApplyForAJob"; // Import the form
import { useUser } from "../context/UserContext";
import UserSchedule from "../components/UserSchedule";
import DateRangeScheduler from "../components/AvailabilityForm";
import { Box, Typography, Container } from "@mui/material";
import AddCompetence from "../components/AddCompetence";
import UserCompetences from "../components/UserCompetences";
import ApplicationForm from "../components/ApplicationForm";


const ApplyForJob: React.FC = () => {
  const { user } = useUser();

  return (
    <Container>
      {user ? (
        <Box>
          <Typography variant="h4" align="center" gutterBottom>
            Welcome to apply for a job {user.name}
          </Typography>
          <Typography variant="h6" align="center" gutterBottom>
            Start fill your competence & availability
          </Typography>
          <ApplicationForm/>
          <UserCompetences editable={false} />

          
          <DateRangeScheduler />
        </Box>
      ) : (
        <Typography variant="h4" align="center" gutterBottom>
          You must log in in first to apply for a job
        </Typography>
      )}

    </Container>
  );
};

export default ApplyForJob;
