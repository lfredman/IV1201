import { SxProps, Theme } from "@mui/system";

const pickersDayStyles = (
  isStart: boolean,
  isEnd: boolean,
  isInRange: boolean
): SxProps<Theme> => ({
  position: "relative",
  backgroundColor: isStart || isEnd || isInRange ? "#90caf9" : undefined, // Highlight start, end, and in-range
  color: isStart || isEnd || isInRange ? "white" : undefined, // White text for highlighted days
  "&:hover": {
    backgroundColor: "#64b5f6", // Hover effect for highlighted days
  },
  "&:focus": {
    outline: "none", // Remove the default outline on focus
  },
  "&:active": {
    backgroundColor: "white", // Maintain the same color when clicked but no additional styles
  },
});

export default pickersDayStyles;
