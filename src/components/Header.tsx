import { Box, Typography } from "@mui/material";

export function Header() {
  return (
    <Box
      component="header"
      sx={{
        pt: 2,
        pb: 1,
        borderBottom: "0.5px solid #21262d",
        mb: 2,
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "baseline", gap: 1.5 }}>
        <Typography
          sx={{
            fontFamily: "monospace",
            fontSize: "2.5rem",
            fontWeight: "bold",
            letterSpacing: "0.3em",
          }}
        >
          UTIL
          <Box component="span" sx={{ color: "#3fb950" }}>
            CLICKER
          </Box>
        </Typography>
      </Box>

      <Typography
        variant="body1"
        sx={{
          fontSize: "0.85rem",
          letterSpacing: "0.15em",
          fontStyle: "italic",
        }}
      >
        MAXIMISE UTILITY. WHATEVER IT TAKES.
      </Typography>
    </Box>
  );
}
