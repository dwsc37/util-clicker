import { Box, Typography } from "@mui/material";

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        gap: 0.5,
      }}
    >
      <Typography
        variant="caption"
        sx={{
          fontStyle: "italic",
          fontSize: "1rem",
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          fontSize: "1rem",
          textAlign: "right",
          fontWeight: 550,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export default StatRow;
