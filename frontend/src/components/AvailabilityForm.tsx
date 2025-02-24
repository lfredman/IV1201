import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box, Button, Typography, IconButton, Tooltip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Modal, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { useAvailability } from '../hooks/useAvailiblity';

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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontSize: 14,
    fontWeight: 'bold',
}));

interface AvailabilityFormProps {
    editable?: boolean;
}

const AvailabilityForm: React.FC<AvailabilityFormProps> = ({ editable = false }) => {
    const { availabilities, tempAvailabilities, loading, error, saveAvailabilitiesChanges, discardChanges, add, handleDeleteAvailability, } = useAvailability();
    const [isEditing, setIsEditing] = React.useState(editable);
    const [open, setOpen] = React.useState(false);
    const [newAvailability, setNewAvailability] = React.useState<{ start: Dayjs | null; end: Dayjs | null }>({ start: dayjs(), end: dayjs() });

    const displayedAvailabilities = isEditing ? tempAvailabilities : availabilities;

    const handleEditToggle = () => setIsEditing((prev) => !prev);
    const handleDiscard = () => {
        discardChanges();
        setIsEditing(false);
    };
    const handleSave = async () => {
        await saveAvailabilitiesChanges();
        setIsEditing(false);
    };
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

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
        <Box sx={{ mx: 'auto', mt: 5, p: 3, borderRadius: 2, boxShadow: 3, textAlign: 'center' }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h6">Your Availability</Typography>
                <IconButton aria-label="edit" size="small" onClick={handleEditToggle}>
                    <EditNoteIcon fontSize="inherit" />
                </IconButton>
            </Stack>

            {loading && <Typography>Loading...</Typography>}
            {error && <Typography color="error">{error}</Typography>}

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
                                console.log(row); // Logs the availability_id for debugging purposes
                                return (
                                    <TableRow key={row.availability_id}>
                                        <TableCell align="center">{row.from_date}</TableCell>
                                        <TableCell align="center">{row.to_date}</TableCell>
                                        {isEditing && (
                                            <TableCell align="center">
                                                <IconButton color="error" onClick={() => handleDeleteAvailability(row?.availability_id)}>
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
