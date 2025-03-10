import React, { useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Stack, Button, InputLabel, FormControl, MenuItem, Select, TextField, Alert } from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import { useProfile } from '../hooks/useProfile'; // Using the custom hook
import competenceOptions from '../utils/competenceOptions';

interface UserCompetencesProps {
  editable?: boolean;
}


/**
 * UserCompetences Component
 * 
 * This component displays a list of competences for the user. The competences are either displayed as 
 * read-only or in an editable form, depending on the `editable` prop. 
 * If editable, the user can add, delete, and save changes to their competences.
 * 
 * Features:
 * - Displays competences in a table format.
 * - Provides options to edit, save, discard changes, and delete competences when `editable` is `true`.
 * - Handles loading and error states during the API call for fetching competences.
 * 
 * @param {Object} props - Component properties
 * @param {boolean} [props.editable=false] - Whether the competences are displayed in an editable state (default is false).
 * 
 * @returns {JSX.Element} The rendered component.
 */

const UserCompetences: React.FC<UserCompetencesProps> = ({ editable = false }) => {
  const { competences, tempCompetences, loading, error, success, handleAddCompetence, resetChanges, saveProfileChanges, handleDeleteCompetence} = useProfile();
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

  const handleDelete = (competence_id: number) => {
    handleDeleteCompetence(competence_id);
  };

  const handleAdd = () => {
    if (newCompetence.competence && newCompetence.years_of_experience) {
      handleAddCompetence({
        competence_id: parseInt(newCompetence.competence, 10),
        competence_name: competenceOptions.find(c => c.competence_id === parseInt(newCompetence.competence, 10))?.name || '',
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

  const blinkStyle = {
    animation: 'blink 1s infinite',
    '@keyframes blink': {
      '0%': {
        outline: 'none', // No outline at the start
      },
      '50%': {
        outline: '5px solid', // Green outline at 50% of the animation
        outlineOffset: '0px', // Creates space between the outline and the button
      },
      '100%': {
        outline: 'none', // Remove outline at the end
      },
    },
  };
  

  return (
    <Box sx={{ width: "auto", mx: "auto", mt: 5, p: 3, borderRadius: 2, boxShadow: 3, textAlign: "center", backgroundColor: "white" }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h5" gutterBottom>Competences</Typography>
        <IconButton aria-label="edit" size="medium" onClick={handleEditToggle}>
          <EditNoteIcon fontSize="inherit" />
        </IconButton>
      </Stack>

      {loading && <Typography>Loading...</Typography>}
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">Changes saved successfully!</Alert>}

      {!loading && (
        <>
        <TableContainer component={Paper} sx={{ marginBottom: '20px' }}>
          <Table>
            <TableHead>
            <TableRow>
              {getTableHeaders().map((header, index) => (
                <TableCell align="center" key={index}>
                  <strong>{header.charAt(0).toUpperCase() + header.slice(1).replace(/_/g, ' ')}</strong>
                </TableCell>
              ))}
              {isEditing && <TableCell><strong>Actions</strong></TableCell>}
            </TableRow>
            </TableHead>
            <TableBody>
              {displayedCompetences.length > 0 ? (
                displayedCompetences.map((comp, index) => (
                  <TableRow key={index}>
                    {Object.entries(comp).slice(1).map(([key, value], idx) => (
                      <TableCell align="center" key={idx}>
                        {typeof value === 'string' ? value.charAt(0).toUpperCase() + value.slice(1) : value}
                      </TableCell>
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
            </TableBody>
          </Table>
        </TableContainer>

        {isEditing && (
          <>
        <Typography style={{ fontSize: '0.8rem', padding: '10px', borderRadius: '5px' }}>
          You can add or edit competences in the table below.
          <br />
          Fill in the necessary fields and click the "Add" button to save.
        </Typography>

        {/* Editing Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow style={{
                fontWeight: 'bold',           // Bold text
                borderTop: '2px solid #ccc', // Border separating the row
              }}>
                <TableCell align="center">
                  <FormControl fullWidth>
                    <InputLabel>Competence</InputLabel>
                    <Select
                      name="competence"
                      value={newCompetence.competence}
                      onChange={(e) => setNewCompetence({ ...newCompetence, competence: e.target.value })}
                      label="Competence"
                      sx={{ width: 'auto', minWidth: '130px', textAlign: 'center' }}

                      autoWidth
                    >
                      {competenceOptions.map(({ competence_id, name }) => (
                        <MenuItem key={competence_id} value={competence_id.toString()}>{name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g, ' ')}</MenuItem>
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
                    sx={{ width: 'auto', maxWidth: '100px', textAlign: 'center' }}
                    inputProps={{ min: 0 }}
                  />
                </TableCell>
                <TableCell align="center">
                      <IconButton 
                        color="primary" 
                        size="small" 
                        onClick={handleAdd} 
                        sx={newCompetence.competence && newCompetence.years_of_experience ? blinkStyle : {}}
                      >
                      <AddIcon />
                    </IconButton>
                  
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        </>)}
      </>
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
