import React, { useState } from "react";
import { Container, Typography, Box, Button, Modal } from "@mui/material";
import AddCompetence from "./AddCompetence";
import DateRangeScheduler from "./AvailabilityForm";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useProfile } from "../hooks/useProfile"; // Import the useProfile hook
import { useUser } from "../context/UserContext";

// Styled Table Components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // Hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

// Modal Style
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%", // Makes it responsive
  maxWidth: "800px", // Restricts max size on large screens
  maxHeight: "90vh", // Prevents overflow
  overflowY: "auto", // Enables scrolling if needed
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const ApplyForAJob: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [showCompetenceForm, setShowCompetenceForm] = useState(false);
  const [showAvailabilityForm, setShowAvailabilityForm] = useState(false);
  

  // Use the useProfile hook to fetch competences
  const { competences, loading, error, handleDeleteCompetence, resetChanges } = useProfile();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setShowCompetenceForm(false); // Reset when closing
    setShowAvailabilityForm(false);
  };

  return (
    <Container maxWidth="lg" sx={{ textAlign: "center", marginTop: "50px" }}>
      <Button variant="contained" onClick={handleOpen}>
      <Typography id="modal-title" variant="h6" gutterBottom>
         Apply for a Job {user?.name ? `, ${user.name}` : ""}
      </Typography>

      </Button>

      {/* Modal for Adding Competence and Availability */}
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" gutterBottom>
            Apply for a Job
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button variant="outlined" onClick={() => setShowCompetenceForm(true)}>
              Add Competence
            </Button>
            <Button variant="outlined" onClick={() => setShowAvailabilityForm(true)}>
              Add Availability
            </Button>
          </Box>

          {/* Show Competence Form when button is clicked */}
          {showCompetenceForm && (
            <Box mt={2}>
              <AddCompetence />
              {/* Add Close button */}
              <Button variant="outlined" color="secondary" onClick={() => setShowCompetenceForm(false)}>
                Close
              </Button>
            </Box>
          )}

          {/* Show Availability Form when button is clicked */}
          {showAvailabilityForm && (
            <Box mt={2}>
              <DateRangeScheduler  />
            </Box>
          )}

          <Box mt={4} sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button variant="text" onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Table to Display Competences */}
      <TableContainer component={Paper} sx={{ marginTop: 4 }}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Competence</StyledTableCell>
              <StyledTableCell align="right">Years of Experience</StyledTableCell>
              <StyledTableCell align="right">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <StyledTableRow>
                <StyledTableCell colSpan={3} align="center">
                  Loading...
                </StyledTableCell>
              </StyledTableRow>
            ) : error ? (
              <StyledTableRow>
                <StyledTableCell colSpan={3} align="center">
                  Error: {error}
                </StyledTableCell>
              </StyledTableRow>
            ) : competences.length === 0 ? (
              <StyledTableRow>
                <StyledTableCell colSpan={3} align="center">
                  No competences found.
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              competences.map((competence) => (
                <StyledTableRow key={competence.competence_id}>
                  <StyledTableCell component="th" scope="row">
                    {competence.competence_name}
                  </StyledTableCell>
                  <StyledTableCell align="right">{competence.years_of_experience}</StyledTableCell>
                  <StyledTableCell align="right">
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteCompetence(competence.competence_id)}
                    >
                      Delete
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ApplyForAJob;