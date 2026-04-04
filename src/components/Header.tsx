import { Box, Typography } from "@mui/material";

export function Header() {
  return (
    <Box
      component="header"
      sx={{
        textAlign: "center",
        py: 2,
        borderBottom: "2px solid",
        borderColor: "primary.main",
        mb: 2,
      }}
    >
      <Typography fontSize="3.5rem" variant="h1">
        Util Clicker
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontStyle: "italic",
          color: "primary.main",
          mt: 0.5,
          letterSpacing: "0.04em",
        }}
      >
        Maximise utility. Whatever it takes.
      </Typography>
    </Box>
  );
}
