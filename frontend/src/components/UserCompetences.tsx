import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Stack, Button } from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useProfile } from '../hooks/useProfile'; // Using the custom hook
import { useNavigate } from 'react-router-dom';

interface UserCompetencesProps {
  editable?: boolean;
}

const UserCompetences: React.FC<UserCompetencesProps> = ({ editable = false }) => {
  const navigate = useNavigate();
  const { competences, tempCompetences, loading, error, resetChanges,saveProfileChanges, handleDeleteCompetence } = useProfile();

  // Use tempCompetences when editable, otherwise use competences
  const displayedCompetences = editable ? tempCompetences : competences;

  const competenceOptions = [
    { id: 1, name: "ticket sales" },
    { id: 2, name: "lotteries" },
    { id: 3, name: "roller coaster operation" },
  ];

  const handleEdit = (event: React.FormEvent) => {
    event.preventDefault();
    navigate('/editprofile');
  };

  const handleDiscard = (event: React.FormEvent) => {
    event.preventDefault();
    resetChanges();
    navigate('/profile');
  };

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    saveProfileChanges();
    navigate('/profile');
  };

  const handleDelete = (id: number) => {
    // Call the function to delete the competence with the given id
    handleDeleteCompetence(id);
  };


  // Function to get the dynamic headers from the first competence object
  const getTableHeaders = () => {
    if (displayedCompetences.length > 0) {
      return Object.keys(displayedCompetences[0]).slice(1);  // Dynamically get keys from the first competence
    }
    return [];
  };

  return (
    <Box sx={{ width: 400, mx: "auto", mt: 5, p: 3, borderRadius: 2, boxShadow: 3, textAlign: "center" }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h5" gutterBottom>Competences</Typography>
        {!editable && (
          <IconButton aria-label="edit" size="small" onClick={handleEdit}>
            <EditNoteIcon fontSize="inherit" />
          </IconButton>
        )}
      </Stack>

      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {getTableHeaders().map((header, index) => (
                  <TableCell key={index}><strong>{header.replace(/_/g, ' ')}</strong></TableCell>
                ))}
                {editable && <TableCell><strong>Actions</strong></TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedCompetences.length > 0 ? (
                displayedCompetences.map((comp, index) => (
                  <TableRow key={index}>
                    {Object.entries(comp).slice(1).map(([key, value], idx) => (
                      <TableCell key={idx}>{value}</TableCell>
                    ))}
                    {editable && (
                      <TableCell>
                        <IconButton aria-label="delete" size="small" color="error" onClick={() => handleDelete(comp.competence_id)}>
                          <DeleteOutlineIcon fontSize="inherit" />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={editable ? getTableHeaders().length + 1 : getTableHeaders().length} align="center">
                    No competences found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {editable && (
        <Box sx={{ mx: "auto", mt: 2, display: "flex", justifyContent: "space-between" }}>
          <Button variant="contained" size="medium" color="error" onClick={handleDiscard}>
            Discard changes
          </Button>
          <Button variant="contained" size="medium" color="primary" onClick={handleSave}>
            Save changes
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default UserCompetences;
