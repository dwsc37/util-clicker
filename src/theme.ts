import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#b8bfc8",
      paper: "#d0d5dc",
    },
    primary: {
      main: "#3a4a3a",
      light: "#4e6b4e",
      contrastText: "#e8ede8",
    },
    text: {
      primary: "#1a1e1a",
      secondary: "#3a3f3a",
      disabled: "#7a8a7a",
    },
    divider: "#9aa0a8",
  },
  typography: {
    fontFamily: "'Barlow Condensed', sans-serif",
    h1: {
      fontFamily: "'Barlow Condensed', sans-serif",
      fontWeight: 500,
      letterSpacing: "0.25em",
      textTransform: "uppercase",
    },
    overline: {
      fontFamily: "'Share Tech Mono', monospace",
      letterSpacing: "0.2em",
      textTransform: "uppercase",
    },
    caption: {
      fontFamily: "'Barlow Condensed', sans-serif",
      fontWeight: 400,
    },
    body1: {
      fontFamily: "'Share Tech Mono', monospace",
    },
    body2: {
      fontFamily: "'Share Tech Mono', monospace",
    },
  },
});
