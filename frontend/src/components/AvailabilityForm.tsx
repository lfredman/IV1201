import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box, Button, Typography, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Modal, Stack, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { useAvailability } from '../hooks/useAvailiblity';
import { nanoid } from 'nanoid';

const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

const StyledTableCell = styled(TableCell)(() => ({
    fontSize: 14,
    fontWeight: 'bold',
}));

interface AvailabilityFormProps {
    editable?: boolean;
}

/**
 * AvailabilityForm Component
 *
 * This component allows users to manage their availability by adding, editing, or deleting date ranges.
 *
 * Features:
 * - Displays a list of availability periods in a table.
 * - Enables editing mode to modify availability entries.
 * - Allows adding new availability periods using a date picker modal.
 * - Provides options to save or discard changes.
 * - Shows feedback messages for loading, errors, and successful updates.
 *
 * Uses:
 * - `useAvailability` hook to manage availability state and actions.
 *
 * @param {boolean} editable - Determines if the component starts in edit mode.
 * @returns {JSX.Element} The rendered availability management form.
 */

const AvailabilityForm: React.FC<AvailabilityFormProps> = ({ editable = false }) => {
    const { availabilities, tempAvailabilities, loading, error, success, saveAvailabilitiesChanges, discardChanges, add, handleDeleteAvailability, } = useAvailability();
    const [isEditing, setIsEditing] = React.useState(editable);
    const [open, setOpen] = React.useState(false);
    const [newAvailability, setNewAvailability] = React.useState<{ start: Dayjs | null; end: Dayjs | null }>({ start: dayjs(), end: dayjs() });

    const displayedAvailabilities = isEditing ? tempAvailabilities : availabilities;

    /**
    * Toggles the editing state of the component.
    * Switches between edit mode and view mode.
    */
    const handleEditToggle = () => setIsEditing((prev) => !prev);

    /**
     * Discards the changes made to the availability and exits edit mode.
     * Calls the `discardChanges` function to reset any temporary changes.
     */
    const handleDiscard = () => {
        discardChanges();
        setIsEditing(false);
    };

    /**
     * Saves the changes made to the availability and exits edit mode.
     * Calls the `saveAvailabilitiesChanges` function to persist the changes.
     */
    const handleSave = async () => {
        await saveAvailabilitiesChanges();
        setIsEditing(false);
    };
    /**
         * Opens the modal to add a new availability period.
         */
    const handleOpen = () => setOpen(true);

    /**
     * Closes the modal to add a new availability period.
     */
    const handleClose = () => setOpen(false);

    /**
     * Adds a new availability period to the list and resets the form fields.
     * Calls the `add` function from the `useAvailability` hook to update the availability state.
     * Closes the modal after adding the availability.
     */
    const handleAdd = () => {
        if (newAvailability.start && newAvailability.end) {
            add({
                from_date: newAvailability.start.format('YYYY-MM-DD'),
                to_date: newAvailability.end.format('YYYY-MM-DD'),
            });

            setNewAvailability({ start: dayjs(), end: dayjs() });
            handleClose();
        }
    };

    return (
        <Box sx={{ mx: 'auto', mt: 5, p: 3, borderRadius: 2, boxShadow: 3, textAlign: 'center', backgroundColor: "white" }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h6">Your Availability</Typography>
                <IconButton aria-label="edit" size="medium" onClick={handleEditToggle}>
                    <EditNoteIcon fontSize="inherit" />
                </IconButton>
            </Stack>

            {loading && <Typography>Loading...</Typography>}
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">Changes saved successfully!</Alert>}
            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center">From Date</StyledTableCell>
                            <StyledTableCell align="center">To Date</StyledTableCell>
                            {isEditing && <StyledTableCell align="center">Actions</StyledTableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayedAvailabilities.length > 0 ? (
                            displayedAvailabilities.map((row) => {
                                return (
                                    <TableRow key={nanoid()}>
                                        <TableCell align="center">{row.from_date}</TableCell>
                                        <TableCell align="center">{row.to_date}</TableCell>
                                        {isEditing && (
                                            <TableCell align="center">
                                                <IconButton color="error" onClick={() => handleDeleteAvailability(row.from_date, row.to_date)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={isEditing ? 3 : 2} align="center">No availability found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {isEditing && (
                <>
                    <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mt: 2 }}>
                        Add Availability
                    </Button>
                    <Modal open={open} onClose={handleClose}>
                        <Box sx={style}>
                            <Typography variant="h6" mb={2}>Add Availability</Typography>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <DatePicker label="Start" value={newAvailability.start} onChange={(date) => setNewAvailability({ ...newAvailability, start: date })} minDate={dayjs()} />
                                    <DatePicker label="End" value={newAvailability.end} onChange={(date) => setNewAvailability({ ...newAvailability, end: date })} minDate={newAvailability.start || dayjs()} />
                                </Box>
                            </LocalizationProvider>
                            <Button variant="contained" color="primary" onClick={handleAdd} sx={{ mt: 2 }}>
                                Add
                            </Button>
                        </Box>
                    </Modal>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button variant="contained" color="error" onClick={handleDiscard}>Discard Changes</Button>
                        <Button variant="contained" color="primary" onClick={handleSave}>Save Changes</Button>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default AvailabilityForm;
