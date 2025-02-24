import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Box from '@mui/material/Box';
import { Button, Typography, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Modal from '@mui/material/Modal';
import { useAvailability } from '../context/AvailabilityContext';

interface DateRangeSchedulerProps {
    editable?: boolean;
  }

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
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const DateRangeScheduler: React.FC = () => {
    const [start, setStart] = React.useState<Dayjs | null>(dayjs());
    const [end, setEnd] = React.useState<Dayjs | null>(dayjs());
    const [open, setOpen] = React.useState(false);

    // Get availability and functions from context
    const { availabilities, addAvailability, deleteAvailability } = useAvailability();

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleAddAvailability = () => {
        if (start && end) {
            addAvailability({
                availability_id: new Date().getTime(), // Temporary unique ID
                from_date: start.format('YYYY-MM-DD'),
                to_date: end.format('YYYY-MM-DD')
            });
            setStart(dayjs());
            setEnd(dayjs());
            handleClose();
        }
    };

    const handleDelete = (id: number) => {
        deleteAvailability(id);
    };

    return (
        <Box sx={{ mx: 'auto', mt: 5, p: 3, borderRadius: 2, boxShadow: 3, textAlign: 'center' }}>
        {/* Add the following flex container */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
                Your Availability
            </Typography>
            <Tooltip title="Click to add availability">
                <IconButton onClick={handleOpen} aria-label="Add Availability" color="primary">
                    <AddIcon fontSize="large" />
                </IconButton>
            </Tooltip>
        </Box>

            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" mb={2}>
                        Add Availability
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <DatePicker label="Start" value={start} onChange={setStart} minDate={dayjs()} />
                            <DatePicker label="End" value={end} onChange={setEnd} minDate={start || dayjs()} />
                        </Box>
                    </LocalizationProvider>
                    <Button variant="contained" size="medium" color="primary" onClick={handleAddAvailability} sx={{ mt: 2 }}>
                        Add
                    </Button>
                </Box>
            </Modal>

            {/* Availability Table */}
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 400 }} aria-label="availability table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>From Date</StyledTableCell>
                            <StyledTableCell>To Date</StyledTableCell>
                            <StyledTableCell align="center">Actions</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {availabilities.map((row) => (
                            <StyledTableRow key={row.availability_id}>
                                <StyledTableCell>{row.from_date}</StyledTableCell>
                                <StyledTableCell>{row.to_date}</StyledTableCell>
                                <StyledTableCell align="center">
                                    <IconButton color="error" onClick={() => handleDelete(row.availability_id!)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default DateRangeScheduler;
