import React from "react";
import { Container, Typography } from "@mui/material";

const ApplyForAJob: React.FC = () => {
  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", marginTop: "50px" }}>
      <Typography variant="h4" component="h1">
        Apply for a Job
      </Typography>
    </Container>
  );
};

export default ApplyForAJob;
