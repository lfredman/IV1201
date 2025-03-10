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
  key: keyof Application | "totalCompetences" | "totalYears" | "totalAvailability" | null;
  direction: "asc" | "desc";
}



/**
 * ApplicationsList Component
 *
 * This component displays a list of job applications, allowing an admin user to:
 * - View applicant details
 * - Search applications
 * - Sort applications by different criteria (name, email, status, competences, etc.)
 * - Open a modal with full application details
 * - Update the application status (Accept, Reject, Unhandled)
 *
 * Role-based access control:
 * - Only users with `role_id = 1` (admin) can access this page.
 *
 * Uses:
 * - `useApplications` hook to fetch and manage application data.
 * - `useUser` hook to get the logged-in user's role.
 *
 * @returns {JSX.Element} The rendered list of applications with sorting, filtering, and status update functionality.
 */
const ApplicationsList: React.FC = () => {
  const { applications, loading, error, updateApplication } = useApplications();
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: "asc" });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const user = useUser()

  const sortedApplications = [...applications].sort((a, b) => {
    if (!sortConfig.key) return 0;
  
    // Determine the value to sort based on the key
    const getTotalAvailability = (app: Application): number => {
      return app.availability.reduce((sum, comp) => {
        const fromDate = new Date(comp.from_date);
        const toDate = new Date(comp.to_date);
        return sum + (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24); // Convert milliseconds to days
      }, 0);
    };
  
    const aValue =
      sortConfig.key === "totalCompetences"
        ? a.competences.length
        : sortConfig.key === "totalYears"
        ? a.competences.reduce((sum, comp) => sum + comp.years, 0)
        : sortConfig.key === "totalAvailability"
        ? getTotalAvailability(a)
        : a[sortConfig.key];
  
    const bValue =
      sortConfig.key === "totalCompetences"
        ? b.competences.length
        : sortConfig.key === "totalYears"
        ? b.competences.reduce((sum, comp) => sum + comp.years, 0)
        : sortConfig.key === "totalAvailability"
        ? getTotalAvailability(b)
        : b[sortConfig.key];
  
    if (aValue === null || aValue === undefined) return -1;
    if (bValue === null || bValue === undefined) return 1;
  
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });
  

  /**
   * Filters applications based on the search query. Searches across all application fields.
   * 
   * @returns {Application[]} The filtered list of applications based on the search query.
   */
  const filteredApplications = sortedApplications.filter(app =>
    Object.values(app).some(value => {
      const strValue = value ? value.toString() : "";
      return strValue.toLowerCase().includes(searchQuery.toLowerCase());
    })
  );

 /**
 * Handles sorting by different application attributes.
 * Allows sorting by "name", "email", "application_status", "competences", "totalYears", and "totalAvailability".
 * 
 * @param {keyof Application | "totalCompetences" | "totalYears" | "totalAvailability"} key - The field to sort by.
 */

  const handleSort = (key: keyof Application | "totalCompetences" | "totalYears" | "totalAvailability" ) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  /**
 * Handles updating the status of the selected application.
 * Accepts, rejects, or sets the application as unhandled based on the passed action.
 * 
 * @param {ApplicationAction} action - The action to take on the application: "unhandled", "accepted", or "rejected".
 * @throws Will throw an error if the status update fails.
 */
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
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", }}>
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
      backgroundColor: "white",
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
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === "totalAvailability"}
                  direction={sortConfig.key === "totalAvailability" ? sortConfig.direction : "asc"}
                  onClick={() => handleSort("totalAvailability")}
                >
                  Total available dates
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredApplications.map(app => {
              const numCompetences = app.competences.length;
              const totalYears = app.competences.reduce((sum, comp) => sum + comp.years, 0);
              const totalAvailability: number = (app.availability ?? []).reduce((sum, comp) => {
                const fromDate: Date = new Date(comp.from_date);
                const toDate: Date = new Date(comp.to_date);
                const differenceInDays: number = (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24);
                return sum + differenceInDays;
            }, 0);
                       

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
                  <TableCell>{totalAvailability}</TableCell>
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

              {selectedApplication && selectedApplication.availability.length > 0 ? (
                <TableContainer component={Paper} sx={{ mt: 2, mb: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>From date</TableCell>
                        <TableCell>To date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedApplication.availability.map((availability, index) => (
                        <TableRow key={index}>
                          <TableCell>{availability.from_date}</TableCell>
                          <TableCell>{availability.to_date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>No available dates</Typography>
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
