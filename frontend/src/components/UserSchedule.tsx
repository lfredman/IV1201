import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import pickersDayStyles from '../styles/PickersDayStyles';
import { Box, Typography } from '@mui/material'; // Import Typography for the title

dayjs.extend(isBetween); // Enable isBetween()

const startDate = dayjs().subtract(3, 'day');
const endDate = dayjs().add(3, 'day');

const CustomDayRenderer = (props: PickersDayProps<Dayjs>) => {
    const { day, outsideCurrentMonth, ...other } = props;

    if (outsideCurrentMonth) return <PickersDay {...props} />;

    const isStart = day.isSame(startDate, 'day');
    const isEnd = day.isSame(endDate, 'day');
    const isInRange = day.isBetween(startDate, endDate, 'day', '()');

    return (
        <PickersDay
            {...other}
            day={day}
            outsideCurrentMonth={outsideCurrentMonth}
            sx={pickersDayStyles(isStart, isEnd, isInRange)}
        />
    );
};

export default function UserSchedule() {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ width: "fit-content", mx: "auto", mt: 5, p: 3, borderRadius: 2, boxShadow: 3, textAlign: "center", display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="h5" >
                Availability
            </Typography>
            <DateCalendar
                defaultValue={dayjs()}
                readOnly
                slots={{ day: CustomDayRenderer }}         
            />
        </Box>
        </LocalizationProvider>
    );
}
