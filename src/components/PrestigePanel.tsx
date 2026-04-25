import { useState } from "react";
import {
  Box,
  ButtonBase,
  Typography,
  Dialog,
  DialogContent,
  Divider,
} from "@mui/material";
import {
  PRESTIGE_HERALD_THRESHOLD,
  PRESTIGE_UNLOCK_THRESHOLD,
  computePrestigeMultiplier,
  prestigeProgress,
} from "../data/prestige";
import { formatUtils } from "../utils/format";
import { useGame } from "../context/GameContext";
import { ACTIONS } from "../store/reducer";
import StatRow from "./StatRow";
import { useAudio } from "../context/AudioContext";

export function PrestigePanel() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [consuming, setConsuming] = useState(false);
  const { state, dispatch } = useGame();
  const { lifetimeUtilsEarned, prestigeCount, prestigeMultiplier } = state;
  const { playClick, playConsume } = useAudio();

  const progress = prestigeProgress(lifetimeUtilsEarned);
  const isUnlocked = lifetimeUtilsEarned >= PRESTIGE_UNLOCK_THRESHOLD;
  const isVisible = lifetimeUtilsEarned >= PRESTIGE_HERALD_THRESHOLD;
  const newMultiplier = computePrestigeMultiplier(lifetimeUtilsEarned);

  if (!isVisible) return null;

  const handlePrestige = () => {
    playClick();
    setConsuming(true);
    playConsume();
    setTimeout(() => {
      setDialogOpen(false);
      dispatch({ type: ACTIONS.PRESTIGE });
    }, 2000);
  };

  return (
    <>
      <ButtonBase
        disableRipple={!isUnlocked}
        onClick={
          isUnlocked
            ? () => {
                playClick();
                setConsuming(false);
                setDialogOpen(true);
              }
            : undefined
        }
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          width: "100%",
          mt: 2,
          px: 1.5,
          pt: 1.5,
          pb: 1,
          bgcolor: "background.paper",
          border: "1px solid",
          borderTop: "2.5px solid",
          borderColor: isUnlocked ? "error.light" : "divider",
          borderTopColor: isUnlocked ? "error.main" : "divider",
          borderRadius: 1,
          cursor: isUnlocked ? "pointer" : "default",
          textAlign: "left",
          transition: "all 100ms ease",
          "@keyframes monsterPulse": {
            "0%, 100%": { boxShadow: "0 0 6px rgba(140, 50, 50, 0.08)" },
            "50%": { boxShadow: "0 0 16px rgba(140, 50, 50, 0.18)" },
          },
          animation: isUnlocked
            ? "monsterPulse 3.5s ease-in-out infinite"
            : "none",
          "&:hover": isUnlocked
            ? {
                bgcolor: "#d4c8c8",
                boxShadow: "0 2px 8px rgba(26,31,26,0.15)",
              }
            : {},
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.25 }}>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "1.2rem",
              flex: 1,
              color: isUnlocked ? "error.dark" : "text.disabled",
              transition: "color 600ms ease",
            }}
          >
            {isUnlocked ? "UTILITY MONSTER" : "???"}
          </Typography>
        </Box>

        {!isUnlocked && (
          <Box
            sx={{
              height: "2px",
              bgcolor: "divider",
              borderRadius: "2px",
              mb: 1.25,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                height: "100%",
                width: `${progress * 100}%`,
                bgcolor: "error.dark",
                borderRadius: "2px",
                transition: "width 0.5s",
              }}
            />
          </Box>
        )}

        <Box
          sx={{
            borderTop: "0.5px solid",
            borderColor: "divider",
            mb: 0.75,
            mt: "auto",
          }}
        />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.4 }}>
          {isUnlocked ? (
            <>
              <StatRow
                label="current util multiplier"
                value={`×${prestigeMultiplier.toFixed(1)}`}
              />
              <StatRow label="worlds consumed" value={String(prestigeCount)} />
            </>
          ) : (
            <StatRow
              label="approaching"
              value={`${formatUtils(lifetimeUtilsEarned)} / ${formatUtils(PRESTIGE_UNLOCK_THRESHOLD)} utils`}
            />
          )}
        </Box>
      </ButtonBase>

      <Dialog
        open={dialogOpen}
        onClose={
          consuming
            ? undefined
            : () => {
                playClick();
                setDialogOpen(false);
              }
        }
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "error.light",
              borderRadius: 1,
              backgroundImage: "none",
            },
          },
        }}
      >
        <DialogContent sx={{ p: 4 }}>
          <Typography
            color="error.main"
            sx={{ fontSize: "1.3rem", textTransform: "uppercase", mb: 3 }}
          >
            Utility Monster — Consumption Event
          </Typography>

          <Typography
            color="text.primary"
            sx={{ fontSize: "1.1rem", lineHeight: 1.9, mb: 3 }}
          >
            The Monster extends an offer. Everything that exists — your
            generators, your upgrades, your research — consumed, and converted
            into raw potential for the next world.
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 2,
              mb: 4,
            }}
          >
            <Box>
              <Typography
                variant="caption"
                sx={{
                  fontStyle: "italic",
                  fontSize: "1.2rem",
                  color: "text.secondary",
                  mb: 0.5,
                }}
              >
                Current Util Multiplier
              </Typography>
              <Typography sx={{ fontSize: "1.4rem", color: "text.primary" }}>
                ×{prestigeMultiplier.toFixed(1)}
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="caption"
                sx={{
                  fontStyle: "italic",
                  fontSize: "1.2rem",
                  color: "text.secondary",
                  mb: 0.5,
                }}
              >
                New Util Multiplier
              </Typography>
              <Typography sx={{ fontSize: "1.4rem", color: "error.main" }}>
                ×{newMultiplier.toFixed(1)}
              </Typography>
            </Box>
          </Box>

          {!consuming ? (
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <ButtonBase
                onClick={handlePrestige}
                sx={{
                  flex: 1,
                  py: 1.75,
                  border: "1px solid",
                  borderColor: "error.main",
                  color: "error.dark",
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "1rem",
                  letterSpacing: "0.15em",
                  borderRadius: 0.5,
                  transition: "all 100ms ease",
                  "&:hover": {
                    bgcolor: "#d4c8c8",
                    boxShadow: "0 2px 8px rgba(26,31,26,0.15)",
                  },
                }}
              >
                FEED THE MONSTER
              </ButtonBase>

              <ButtonBase
                onClick={() => {
                  playClick();
                  setDialogOpen(false);
                }}
                sx={{
                  px: 2.5,
                  py: 1.75,
                  border: "1px solid",
                  borderColor: "divider",
                  color: "text.secondary",
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "1rem",
                  letterSpacing: "0.1em",
                  borderRadius: 0.5,
                  transition: "all 100ms ease",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
                }}
              >
                RESIST
              </ButtonBase>
            </Box>
          ) : (
            <Typography
              variant="caption"
              sx={{
                display: "block",
                textAlign: "center",
                color: "error.main",
                fontSize: "1rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                "@keyframes consumptionText": {
                  "0%": { opacity: 0, letterSpacing: "0.05em" },
                  "30%": { opacity: 1, letterSpacing: "0.3em" },
                  "60%": { opacity: 1, letterSpacing: "0.6em" },
                  "80%": { opacity: 1 },
                  "100%": { opacity: 0, letterSpacing: "0.9em" },
                },
                animation: "consumptionText 2s ease forwards",
              }}
            >
              Consuming...
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
