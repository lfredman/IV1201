import { SxProps, Theme } from "@mui/system";

const pickersDayStyles = (
  isStart: boolean,
  isEnd: boolean,
  isInRange: boolean
): SxProps<Theme> => ({
  position: "relative",
  backgroundColor: isStart || isEnd || isInRange ? "#90caf9" : undefined, 
  color: isStart || isEnd || isInRange ? "white" : undefined,
  "&:hover": {
    backgroundColor: "#64b5f6", 
  },
  "&:focus": {
    outline: "none", 
  },
  "&:active": {
    backgroundColor: "white", 
  },
});

export default pickersDayStyles;
