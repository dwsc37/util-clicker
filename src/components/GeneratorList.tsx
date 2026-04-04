import { Avatar, Box, ButtonBase, Typography } from "@mui/material";
import { GENERATORS } from "../data/generators";
import { ACTIONS, getGeneratorCost, getGeneratorUPS } from "../store/reducer";
import { formatUtils } from "../utils/format";
import { useGame } from "../context/GameContext";

export function GeneratorList() {
  const { state, dispatch } = useGame();

  function handleBuy(generatorId: string) {
    dispatch({ type: ACTIONS.BUY_GENERATOR, payload: { generatorId } });
  }

  return (
    <Box
      sx={{
        p: 2,
        overflowY: "auto",
        "&::-webkit-scrollbar": { width: "4px" },
        "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
        "&::-webkit-scrollbar-thumb": {
          bgcolor: "#c2c9cc",
          borderRadius: "2px",
        },
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1.5,
        }}
      >
        {GENERATORS.map((gen) => {
          const owned = state.ownedGenerators[gen.id] ?? 0;
          const cost = getGeneratorCost(gen.id, owned, state.purchasedUpgrades);
          const canAfford = state.utils >= cost;
          const isUnlocked = state.totalUtilsEarned >= gen.baseCost;
          const upsEach = getGeneratorUPS(gen.id, 1, state.purchasedUpgrades);
          const upsTotal = getGeneratorUPS(
            gen.id,
            owned,
            state.purchasedUpgrades,
          );
          const totalEarned = state.generatorEarnings[gen.id] ?? 0;

          return (
            <ButtonBase
              key={gen.id}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                height: "100%",
                px: 1.5,
                pt: 1.5,
                pb: 1,
                bgcolor: "background.paper",
                border: "1px solid",
                borderTop: "2.5px solid",
                borderColor: "divider",
                borderTopColor: canAfford ? "primary.main" : "divider",
                borderRadius: 1,
                opacity: isUnlocked ? (canAfford ? 1 : 0.75) : 0.5,
                cursor: canAfford
                  ? "pointer"
                  : isUnlocked
                    ? "auto"
                    : "not-allowed",
                transition: "all 100ms ease",
                textAlign: "left",
                "&:hover": canAfford
                  ? {
                      bgcolor: "#f5e8e8",
                      boxShadow: "0 2px 8px rgba(26,20,8,0.12)",
                    }
                  : {},
              }}
              onClick={() => canAfford && handleBuy(gen.id)}
              disableRipple={!canAfford}
            >
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 1.25,
                }}
              >
                <Avatar
                  src={isUnlocked ? gen.icon : ""}
                  sx={{ width: 32, height: 32 }}
                />
                <Typography sx={{ fontWeight: 600, fontSize: "1rem", flex: 1 }}>
                  {isUnlocked ? gen.name : "???"}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.5rem",
                    color: "primary.main",
                    lineHeight: 1,
                  }}
                >
                  {owned}
                </Typography>
              </Box>

              <Box
                sx={{
                  borderTop: "0.5px solid",
                  borderColor: "divider",
                  mb: 0.75,
                  mt: "auto",
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.4,
                }}
              >
                <StatRow label="cost" value={`${formatUtils(cost)} utils`} />
                <StatRow
                  label="each"
                  value={`${formatUtils(upsEach)} utils/s`}
                />
                <StatRow
                  label="total"
                  value={`${formatUtils(upsTotal)} utils/s`}
                />
                <StatRow
                  label="earned"
                  value={`${formatUtils(totalEarned)} utils`}
                />
              </Box>
            </ButtonBase>
          );
        })}
      </Box>
    </Box>
  );
}

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
