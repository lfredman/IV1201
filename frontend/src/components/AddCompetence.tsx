import React, { useState } from "react";
import { TextField, Button, Box, Typography, Alert, MenuItem, Select, InputLabel, FormControl, SelectChangeEvent } from "@mui/material";
import { useProfile } from '../context/ProfileContext';  

// Example competence options (replace with API data if needed)
const competenceOptions = [
  { id: 1, name: "ticket sales" },
  { id: 2, name: "lotteries" },
  { id: 3, name: "roller coaster operation" },
];

const AddCompetence: React.FC = () => {
  const { addCompetence } = useProfile(); 

  // Initialize formData with null for competence and empty for years_of_experience
  const [formData, setFormData] = useState({
    competence: null as { id: number; name: string } | null, // Store full object
    years_of_experience: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle change for Select dropdown
  const handleChange = (e: SelectChangeEvent<string>) => {
    const competenceId = parseInt(e.target.value, 10);
    const selectedCompetence = competenceOptions.find(c => c.id === competenceId);
    setFormData((prev) => ({ ...prev, competence: selectedCompetence || null }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    // Check if all fields are filled
    if (!formData.competence || !formData.years_of_experience) {
      setError("All fields are required");
      return;
    }

    // Validate years of experience
    const years = parseInt(formData.years_of_experience, 10);
    if (isNaN(years) || years < 0) {
      setError("Years of experience must be a valid number");
      return;
    }

    // Simulate saving data
    setLoading(true);
    setTimeout(() => {
      if (formData.competence) {
        addCompetence({
          competence_id: formData.competence.id,
          competence_name: formData.competence.name,
          years_of_experience: years,
        });
      }

      // Reset form state after submission
      setFormData({ competence: null, years_of_experience: "" });
      setError(null);
      setLoading(false);
    }, 1000);
  };

  return (
    <Box sx={{ width: 320, mx: "auto", mt: 5, p: 3, borderRadius: 2, boxShadow: 3, textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>Add Competence</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        
        {/* Competence Select Dropdown */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Competence</InputLabel>
          <Select
            name="competence"
            value={formData.competence ? formData.competence.id.toString() : ""}
            onChange={handleChange}
            label="Competence"
          >
            {competenceOptions.map(({ id, name }) => (
              <MenuItem key={id} value={id.toString()}>
                {name}
              </MenuItem>
            ))}
          </Select>

        </FormControl>

        {/* Years of Experience Input */}
        <TextField
          name="years_of_experience"
          label="Years of Experience"
          variant="outlined"
          fullWidth
          margin="normal"
          type="number"
          value={formData.years_of_experience}
          onChange={(e) => setFormData(prev => ({ ...prev, years_of_experience: e.target.value }))}
          autoComplete="off"
        />

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
          {loading ? "Adding..." : "Add"}
        </Button>
      </form>
    </Box>
  );
};

export default AddCompetence;
