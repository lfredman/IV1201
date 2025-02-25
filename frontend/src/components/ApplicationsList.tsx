import React, { useState } from "react";
import useApplications, { Application } from "../hooks/useApplications";
import {
  CircularProgress,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Paper,
  Modal,
  Button,
  Grid,
} from "@mui/material";
import { useUser } from '../context/UserContext';

interface SortConfig {
  key: keyof Application | "totalCompetences" | "totalYears" | null;
  direction: "asc" | "desc";
}

const ApplicationsList: React.FC = () => {
  const { applications, loading, error, updateApplication } = useApplications();
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: "asc" });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const user = useUser()

  // Sorting function
  const sortedApplications = [...applications].sort((a, b) => {
    if (!sortConfig.key) return 0;

    // Determine the value to sort based on the key
    const aValue = sortConfig.key === "totalCompetences"
      ? a.competences.length
      : sortConfig.key === "totalYears"
      ? a.competences.reduce((sum, comp) => sum + comp.years, 0)
      : a[sortConfig.key];

    const bValue = sortConfig.key === "totalCompetences"
      ? b.competences.length
      : sortConfig.key === "totalYears"
      ? b.competences.reduce((sum, comp) => sum + comp.years, 0)
      : b[sortConfig.key];

    if (aValue === null || aValue === undefined) return -1;
    if (bValue === null || bValue === undefined) return 1;

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Search filter
  const filteredApplications = sortedApplications.filter(app =>
    Object.values(app).some(value => {
      const strValue = value ? value.toString() : "";
      return strValue.toLowerCase().includes(searchQuery.toLowerCase());
    })
  );

  // Handle sorting change
  const handleSort = (key: keyof Application | "totalCompetences" | "totalYears") => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Handle profile row click
  const handleProfileClick = (application: Application) => {
    setSelectedApplication(application);
    setModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setModalOpen(false);
  };

  type ApplicationAction = "unhandled" | "accepted" | "rejected";

  const handleApplicationAction = async (action: ApplicationAction) => {
    if (selectedApplication) {
      console.log(`${action} application for ${selectedApplication.name}`);
  
      try {
        const newApplication = await updateApplication(
          selectedApplication.person_id,
          action,
        );
        setSelectedApplication(newApplication);


      } catch (error) {
        console.error("Error updating application status:", error);
      }
    }
  };

  if (user.user?.role_id != 1){
    return(<div>You need to be an admin to access this!</div>)
  }


  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box  sx={{
      width: "100%",
      maxWidth: "100vw", // Ensures it does not exceed viewport width
      padding: 1,
      overflowX: "hidden", // Prevents horizontal overflow
      boxSizing: "border-box", // Ensures padding is included in width calculations
    }}>
      <TextField
        label="Search applications"
        variant="outlined"
        fullWidth
        margin="dense"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {["person_id", "name", "surname", "email", "application_status", "created_at"].map(column => (
                <TableCell key={column}>
                  <TableSortLabel
                    active={sortConfig.key === column}
                    direction={sortConfig.key === column ? sortConfig.direction : "asc"}
                    onClick={() => handleSort(column as keyof Application)}
                  >
                    {column.replace("_", " ").toUpperCase()}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === "totalCompetences"}
                  direction={sortConfig.key === "totalCompetences" ? sortConfig.direction : "asc"}
                  onClick={() => handleSort("totalCompetences")}
                >
                  No of Competences
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === "totalYears"}
                  direction={sortConfig.key === "totalYears" ? sortConfig.direction : "asc"}
                  onClick={() => handleSort("totalYears")}
                >
                  Total Years of Experience
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredApplications.map(app => {
              const numCompetences = app.competences.length;
              const totalYears = app.competences.reduce((sum, comp) => sum + comp.years, 0);

              return (
                <TableRow key={app.person_id} onClick={() => handleProfileClick(app)} style={{ cursor: "pointer" }}>
                  <TableCell>{app.person_id}</TableCell>
                  <TableCell>{app.name}</TableCell>
                  <TableCell>{app.surname}</TableCell>
                  <TableCell>{app.email}</TableCell>
                  <TableCell><Box
                    component="span"
                    sx={{
                      display: "inline-block",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontWeight: "bold",
                      backgroundColor: app.application_status === "accepted"
                        ? "green"
                        : app.application_status === "rejected"
                        ? "red"
                        : "orange",
                      color: "white",
                      marginLeft: "8px",
                    }}
                  >
                    {app.application_status}
                  </Box></TableCell>
                  <TableCell>
                    {new Date(app.created_at).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                    })}
                  </TableCell>
                  <TableCell>{numCompetences}</TableCell>
                  <TableCell>{totalYears.toFixed(2)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="user-details-modal"
        aria-describedby="user-details-description"
      >
        <Box sx={{ 
          position: "absolute", 
          top: "50%", 
          left: "50%", 
          transform: "translate(-50%, -50%)", 
          bgcolor: "white", 
          p: 4, 
          borderRadius: 2, 
          boxShadow: 3, 
          width: 400 
        }}>
          {selectedApplication && (
            <div>
              <Typography variant="h5">Application Details</Typography>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12}><strong>Id:</strong> {selectedApplication.person_id}</Grid>
                <Grid item xs={12}><strong>Name:</strong> {selectedApplication.name} {selectedApplication.surname}</Grid>
                <Grid item xs={12}><strong>Email:</strong> {selectedApplication.email}</Grid>
                <Grid item xs={12}><strong>Pnr:</strong> {selectedApplication.pnr}</Grid>
                <Grid item xs={12}><strong>Total experience:</strong> {selectedApplication.competences.reduce((sum, comp) => sum + comp.years, 0)} years</Grid>
                <Grid item xs={12}><strong>Submitted At:</strong> {selectedApplication.created_at}</Grid>
                <Grid item xs={12} ><strong>Status:</strong> 
                  <Box
                    component="span"
                    sx={{
                      display: "inline-block",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontWeight: "bold",
                      backgroundColor: selectedApplication.application_status === "accepted"
                        ? "green"
                        : selectedApplication.application_status === "rejected"
                        ? "red"
                        : "orange",
                      color: "white",
                      marginLeft: "8px",
                    }}
                  >
                    {selectedApplication.application_status}
                  </Box>
                
                </Grid>
              </Grid>

              {selectedApplication && selectedApplication.competences.length > 0 ? (
                <TableContainer component={Paper} sx={{ mt: 2, mb: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Competence Name</TableCell>
                        <TableCell>Years of Experience</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedApplication.competences.map((comp, index) => (
                        <TableRow key={index}>
                          <TableCell>{comp.name}</TableCell>
                          <TableCell>{comp.years}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>No competences</Typography>
              )}

              <Box sx={{ mt: 2 }}>
                {(["unhandled", "accepted", "rejected"] as ApplicationAction[])
                  .filter(status => status !== selectedApplication.application_status)
                  .map(status => (
                    <Button
                      key={status}
                      variant="contained"
                      color="primary" 
                      onClick={() => handleApplicationAction(status as ApplicationAction)}
                      sx={{ mr: 2 }}
                    >
                      Set {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  ))}
              </Box>


            </div>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default ApplicationsList;
