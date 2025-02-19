import React from "react";
import ApplyForAJob from "../components/ApplyForAJob"; // Import the form
import { useUser } from "../context/UserContext";
import UserSchedule from "../components/UserSchedule";
import DateRangeScheduler from "../components/AvailabilityForm";
import { Box, Typography, Container } from "@mui/material";

const ApplyForJob: React.FC = () => {
  const { user } = useUser();

  if (!user) {
    return <h2>You need to be logged in to apply for a job</h2>;
  }

  return (
    <Container>
      <ApplyForAJob />

      {/* Main Content Section */}
     
    </Container>
  );
};

export default ApplyForJob;
