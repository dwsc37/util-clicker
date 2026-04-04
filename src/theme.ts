import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#f5f0e8",
      paper: "#eee8d8",
    },
    primary: {
      main: "#8b1a1a",
      light: "#c94040",
      contrastText: "#f5f0e8",
    },
    text: {
      primary: "#1a1408",
      secondary: "#5a4e38",
      disabled: "#b0a090",
    },
    divider: "#c8b89a",
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
