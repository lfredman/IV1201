import React from "react";
import ApplyForAJob from "../components/ApplyForAJob"; // Import the form
import { useUser } from "../context/UserContext";

const ApplyForJob: React.FC = () => {
  const {user}= useUser();

  return (
    <div>
      {user ? (
        <h2>Apply for a Job</h2>
      ) : (
        <h2>You need to be logged in to apply for a job</h2>
      )}
    </div>
  );
};

export default ApplyForJob;
