import React, { useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Stack, Button, InputLabel, FormControl, MenuItem, Select, TextField, Alert } from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useProfile } from '../hooks/useProfile'; // Using the custom hook

interface UserCompetencesProps {
  editable?: boolean;
}

const competenceOptions = [
  { id: 1, name: "ticket sales" },
  { id: 2, name: "lotteries" },
  { id: 3, name: "roller coaster operation" },
];

const UserCompetences: React.FC<UserCompetencesProps> = ({ editable = false }) => {
  const { competences, tempCompetences, loading, error, success, addCompetence, resetChanges, saveProfileChanges, handleDeleteCompetence} = useProfile();
  const [isEditing, setIsEditing] = useState(editable);
  const [newCompetence, setNewCompetence] = useState({ competence: '', years_of_experience: '' });
  
  const displayedCompetences = isEditing ? tempCompetences : competences;

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleDiscard = () => {
    resetChanges();
    setIsEditing(false);
  };

  const handleSave = () => {
    saveProfileChanges();
    setIsEditing(false);
  };

  const handleDelete = (id: number) => {
    handleDeleteCompetence(id);
  };

  const handleAddCompetence = () => {
    if (newCompetence.competence && newCompetence.years_of_experience) {
      addCompetence({
        competence_id: parseInt(newCompetence.competence, 10),
        competence_name: competenceOptions.find(c => c.id === parseInt(newCompetence.competence, 10))?.name || '',
        years_of_experience: parseFloat(newCompetence.years_of_experience),
      });
      setNewCompetence({ competence: '', years_of_experience: '' });
    }
  };

  const getTableHeaders = () => {
    if (displayedCompetences.length > 0) {
      return Object.keys(displayedCompetences[0]).slice(1);
    }
    return [];
  };

  return (
    <Box sx={{ width: "auto", mx: "auto", mt: 5, p: 3, borderRadius: 2, boxShadow: 3, textAlign: "center" }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h5" gutterBottom>Competences</Typography>
        <IconButton aria-label="edit" size="small" onClick={handleEditToggle}>
          <EditNoteIcon fontSize="inherit" />
        </IconButton>
      </Stack>

      {loading && <Typography>Loading...</Typography>}
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">Changes saved successfully!</Alert>}

      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {getTableHeaders().map((header, index) => (
                  <TableCell align="center" key={index}><strong>{header.replace(/_/g, ' ')}</strong></TableCell>
                ))}
                {isEditing && <TableCell><strong>Actions</strong></TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedCompetences.length > 0 ? (
                displayedCompetences.map((comp, index) => (
                  <TableRow key={index}>
                    {Object.entries(comp).slice(1).map(([key, value], idx) => (
                      <TableCell align="center" key={idx}>{value}</TableCell>
                    ))}
                    {isEditing && (
                      <TableCell align="center">
                        <IconButton aria-label="delete" size="small" color="error" onClick={() => handleDelete(comp.competence_id)}>
                          <DeleteOutlineIcon fontSize="inherit" />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={isEditing ? getTableHeaders().length + 1 : getTableHeaders().length} align="center">
                    No competences found.
                  </TableCell>
                </TableRow>
              )}

              {isEditing && (
                <TableRow>
                  <TableCell align="center">
                    <FormControl fullWidth>
                      <InputLabel>Competence</InputLabel>
                      <Select
                        name="competence"
                        value={newCompetence.competence}
                        onChange={(e) => setNewCompetence({ ...newCompetence, competence: e.target.value })}
                        label="Competence"
                        autoWidth
                      >
                        {competenceOptions.map(({ id, name }) => (
                          <MenuItem key={id} value={id.toString()}>{name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      type="number"
                      value={newCompetence.years_of_experience}
                      onChange={(e) => setNewCompetence({ ...newCompetence, years_of_experience: e.target.value })}
                      label="Years"
                      sx={{width: 'auto', maxWidth: "100px", textAlign: 'center'}}
                      
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" size='small' onClick={handleAddCompetence}>
                      <AddIcon/>
                    </IconButton>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {isEditing && (
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
