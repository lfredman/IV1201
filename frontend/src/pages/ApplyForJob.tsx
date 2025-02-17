import React from "react";
import ApplyForAJob from "../components/ApplyForAJob"; // Import the form
import { useUser } from "../context/UserContext";
import UserSchedule from "../components/UserSchedule"
import DateRangeScheduler from "../components/AvailabilityForm";
import { Box, Typography } from "@mui/material";

const ApplyForJob: React.FC = () => {
  const {user}= useUser();

  return (
    <div>
      {user ? (
          <Box 
            component="section" 
            sx={{ 
              p: 2, 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100vh',  // Full viewport height to vertically center content
              textAlign: 'center'
            }}
          >
            <div>
              <Typography variant="h4">Apply for a Job</Typography>
              {user ?
                <Box sx={{mx: 'auto', display: 'flex', }}>
                    <UserSchedule/>
                    <DateRangeScheduler/> 
                </Box>
                :
                <p>You cant be here</p>}
            </div>
          </Box>
    
        ) : (
            <h2>You need to be logged in to apply for a job</h2>
        )
      }
    </div>
  );
};

export default ApplyForJob;
