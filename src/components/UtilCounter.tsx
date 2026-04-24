import { Paper, Box, Typography } from "@mui/material";
import { formatUtils } from "../utils/format";
import { useGame } from "../context/GameContext";

export function UtilCounter() {
  const { state } = useGame();
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        mb: 2,
        borderTop: "3px solid",
        borderTopColor: "primary.main",
        borderColor: "divider",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mb: 0.5 }}>
        <Typography
          sx={{
            fontSize: "2.8rem",
            fontWeight: 700,
            color: "primary.main",
            lineHeight: 1,
          }}
        >
          {formatUtils(state.utils)}
        </Typography>
        <Typography variant="overline" sx={{ fontSize: "1.2rem" }}>
          utils
        </Typography>
      </Box>

      <Typography
        variant="body2"
        sx={{
          fontSize: "1.1rem",
          fontStyle: "italic",
          color: "text.secondary",
        }}
      >
        {formatUtils(state.utilsPerSecond)} utils/s
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontSize: "1.1rem",
          fontStyle: "italic",
          color: "text.secondary",
        }}
      >
        {formatUtils(state.totalUtilsEarned)} total utils earned
      </Typography>
    </Paper>
  );
}
