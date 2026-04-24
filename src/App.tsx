import { ThemeProvider, CssBaseline } from "@mui/material";
import { Box } from "@mui/material";
import { theme } from "./theme";
import { GameProvider } from "./context/GameContext";
import { Header } from "./components/Header";
import { UtilCounter } from "./components/UtilCounter";
import { UtilButton } from "./components/UtilButton";
import { ShopPanel } from "./components/ShopPanel";
import { Terminal } from "./components/Terminal";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GameProvider>
        <Box
          sx={{
            px: 3,
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            pb: 3,
          }}
        >
          <Header />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "290px 500px 1fr",
              gap: 2.5,
              alignItems: "start",
              flexGrow: 1,
              overflow: "hidden",
            }}
          >
            <Box>
              <UtilCounter />
              <UtilButton />
            </Box>

            <Terminal />

            <ShopPanel />
          </Box>
        </Box>
      </GameProvider>
    </ThemeProvider>
  );
}
