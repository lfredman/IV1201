import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Box from '@mui/material/Box';
import { display } from '@mui/system';
import { Button, Typography } from '@mui/material';

const DateRangeScheduler: React.FC = () => {
    const [start, setStart] = React.useState<Dayjs | null>(dayjs());
    const [end, setEnd] = React.useState<Dayjs | null>(dayjs());
    return (
        //Box for schedule date range
        <Box sx={{ width: 200, mx: "auto", mt: 5, p: 3, borderRadius: 2, boxShadow: 3, textAlign: "center", display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant='h5'>
                Add availability
            </Typography>
            <Box sx={{display: "flex", flexDirection: "column", gap: 1}}> 
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Start"
                        value={start}
                        minDate={dayjs()}
                        onChange={(newValue) => {
                            setStart(newValue)
                            if (newValue && end && newValue.isAfter(end)) {
                                setEnd(newValue); // Adjust end if it’s before new start
                            }
                        }}
                    />
                    <DatePicker
                        label="end"
                        value={end}
                        minDate={start || dayjs()}
                        onChange={(newValue) => setEnd(newValue)}
                    />
                </LocalizationProvider>
            </Box>
            <Button variant="contained" size="medium" color="primary" >
                Add
            </Button>
        </Box>
    );
}

export default DateRangeScheduler;
