import { Avatar, Box, ButtonBase, Typography } from "@mui/material";
import {
  RESEARCHES,
  RESEARCH_TYPE_LABELS,
  RESEARCH_UNLOCK_THRESHOLD,
  type Research,
  type ResearchType,
} from "../data/research";
import { ACTIONS } from "../store/reducer";
import { formatUtils } from "../utils/format";
import { useGame } from "../context/GameContext";

type ResearchStatus = "available" | "locked" | "purchased";

const CATEGORY_ORDER: ResearchType[] = ["AI", "PANDEMIC", "NUCLEAR"];

const gridSx = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 1.5,
};
function ResearchCard({
  research,
  status,
  currentUtils,
  onBuy,
}: {
  research: Research;
  status: ResearchStatus;
  currentUtils: number;
  onBuy: (id: string) => void;
}) {
  const canAfford = status === "available" && currentUtils >= research.cost;
  const isUnlocked = status === "available" || status === "purchased";

  return (
    <ButtonBase
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        px: 1.5,
        pt: 1.5,
        pb: 1,
        bgcolor: "background.paper",
        border: "1px solid",
        borderTop: "2.5px solid",
        borderColor: "divider",
        borderTopColor:
          status === "purchased"
            ? "#3a7a3a"
            : canAfford
              ? "primary.main"
              : "divider",
        borderRadius: 1,
        opacity: isUnlocked ? (canAfford ? 1 : 0.75) : 0.5,
        cursor: canAfford ? "pointer" : isUnlocked ? "auto" : "not-allowed",
        transition: "all 100ms ease",
        textAlign: "left",
        "&:hover": canAfford
          ? {
              bgcolor: "#f5e8e8",
              boxShadow: "0 2px 8px rgba(26,20,8,0.12)",
            }
          : {},
      }}
      onClick={() => canAfford && onBuy(research.id)}
      disableRipple={!canAfford}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <Avatar
          src={isUnlocked ? research.icon : ""}
          sx={{ width: 32, height: 32 }}
        />
        <Typography sx={{ fontSize: "1rem", fontWeight: 600, flex: 1 }}>
          {isUnlocked ? research.name : "???"}
        </Typography>
      </Box>

      <Box
        sx={{
          borderTop: "0.5px solid",
          borderColor: "divider",
          mt: "auto",
        }}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          mt: 1,
        }}
      >
        <Typography
          variant="caption"
          sx={{ fontStyle: "italic", fontSize: "1rem" }}
        >
          {status === "purchased" ? "purchased" : "cost"}
        </Typography>
        <Typography
          variant="caption"
          sx={{ fontSize: "1rem", fontWeight: 550 }}
        >
          {status === "purchased" ? "✓" : `${formatUtils(research.cost)} utils`}
        </Typography>
      </Box>
    </ButtonBase>
  );
}

function SectionHeader({ label, count }: { label: string; count: number }) {
  return (
    <Typography
      variant="caption"
      sx={{
        display: "block",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "text.secondary",
        fontSize: "1rem",
        mb: 1,
        mt: 3,
        "&:first-of-type": { mt: 0 },
      }}
    >
      {label} ({count})
    </Typography>
  );
}

export function ResearchPanel() {
  const { state, dispatch } = useGame();
  const { utils, totalUtilsEarned, purchasedResearches } = state;

  function handleBuy(researchId: string) {
    dispatch({ type: ACTIONS.BUY_RESEARCH, payload: { researchId } });
  }

  const byType = CATEGORY_ORDER.map((type) => {
    const all = RESEARCHES.filter((r: Research) => r.researchType === type);
    const available = all.filter(
      (r) => !purchasedResearches[r.id] && totalUtilsEarned >= r.cost,
    );
    const locked = all.filter((r) => totalUtilsEarned < r.cost);
    const purchased = all.filter((r) => purchasedResearches[r.id]);
    return { type, available, locked, purchased };
  });

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
      {state.totalUtilsEarned < RESEARCH_UNLOCK_THRESHOLD ? (
        <Typography
          variant="body2"
          sx={{
            fontSize: "1rem",
            fontStyle: "italic",
            color: "text.secondary",
          }}
        >
          Research is not available yet.
        </Typography>
      ) : (
        byType.map(({ type, available, locked, purchased }) => {
          const visible = available.length + locked.length + purchased.length;
          if (visible === 0) return null;

          return (
            <Box key={type} sx={{ mb: 4 }}>
              <Typography
                sx={{
                  fontSize: "1rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  color: "text.primary",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  pb: 0.5,
                  mb: 1.5,
                }}
              >
                {RESEARCH_TYPE_LABELS[type]}
              </Typography>

              {available.length > 0 && (
                <>
                  <SectionHeader label="Available" count={available.length} />
                  <Box sx={gridSx}>
                    {available.map((r: Research) => (
                      <ResearchCard
                        key={r.id}
                        research={r}
                        status="available"
                        currentUtils={utils}
                        onBuy={handleBuy}
                      />
                    ))}
                  </Box>
                </>
              )}

              {locked.length > 0 && (
                <>
                  <SectionHeader label="Locked" count={locked.length} />
                  <Box sx={gridSx}>
                    {locked.map((r: Research) => (
                      <ResearchCard
                        key={r.id}
                        research={r}
                        status="locked"
                        currentUtils={utils}
                        onBuy={handleBuy}
                      />
                    ))}
                  </Box>
                </>
              )}

              {purchased.length > 0 && (
                <>
                  <SectionHeader label="Purchased" count={purchased.length} />
                  <Box sx={gridSx}>
                    {purchased.map((r: Research) => (
                      <ResearchCard
                        key={r.id}
                        research={r}
                        status="purchased"
                        currentUtils={utils}
                        onBuy={handleBuy}
                      />
                    ))}
                  </Box>
                </>
              )}
            </Box>
          );
        })
      )}
    </Box>
  );
}
