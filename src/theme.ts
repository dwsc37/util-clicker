import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#f0f2f4",
      paper: "#e4e8ec",
    },
    primary: {
      main: "#007a6e",
      light: "#00b8a6",
      contrastText: "#f0f2f4",
    },
    text: {
      primary: "#0d1214",
      secondary: "#4a5c64",
      disabled: "#a0b0b8",
    },
    divider: "#c8ced4",
  },
  typography: {
    fontFamily: "'EB Garamond', Georgia, serif",
    h1: {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontWeight: 700,
      letterSpacing: "0.15em",
      textTransform: "uppercase",
    },
    h2: {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontWeight: 500,
    },
    overline: {
      fontFamily: "'EB Garamond', Georgia, serif",
      letterSpacing: "0.2em",
    },
    caption: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: 400,
    },
  },
});
