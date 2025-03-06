import React from "react";
import { Container, Typography } from "@mui/material";

/**
 * ApplyForAJob Component
 *
 * A basic component that displays a heading for the "Apply for a Job" page.
 * 
 * @returns {JSX.Element} A centered heading inside a container.
 */
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
