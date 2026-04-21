import { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { GeneratorList } from "./GeneratorPanel";
import { UpgradePanel } from "./UpgradePanel";
import { useGame } from "../context/GameContext";
import { UPGRADES } from "../data/upgrades";
import { RESEARCHES } from "../data/research";
import { ResearchPanel } from "./ResearchPanel";

export function ShopPanel() {
  const [tab, setTab] = useState<"generators" | "upgrades" | "research">(
    "generators",
  );
  const { state } = useGame();

  const availableUpgradeCount = UPGRADES.filter((u) => {
    if (state.purchasedUpgrades[u.id]) return false;
    const owned = state.ownedGenerators[u.targetGeneratorId] ?? 0;
    return owned >= u.minOwned;
  }).length;

  const availableResearchCount = RESEARCHES.filter((r) => {
    if (state.purchasedResearches[r.id]) return false;
    return state.totalUtilsEarned >= r.cost;
  }).length;

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          minHeight: 50,
          flexShrink: 0,
          "& .MuiTab-root": {
            fontSize: "1.1rem",
            minHeight: 50,
            textTransform: "none",
            letterSpacing: "0.05em",
            "&.Mui-selected": { color: "text.primary" },
          },
        }}
      >
        <Tab sx={{ width: "33%" }} value="generators" label="Generators" />
        <Tab
          sx={{ width: "33%" }}
          value="upgrades"
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              Upgrades
              {availableUpgradeCount > 0 && (
                <Box
                  sx={{
                    mt: 0.2,
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    borderRadius: "10px",
                    px: 0.75,
                    py: 0.1,
                    fontSize: "0.7rem",
                    fontFamily: "monospace",
                    lineHeight: 1.6,
                  }}
                >
                  {availableUpgradeCount}
                </Box>
              )}
            </Box>
          }
        />
        <Tab
          sx={{ width: "33%" }}
          value="research"
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              Research
              {availableResearchCount > 0 && (
                <Box
                  sx={{
                    mt: 0.2,
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    borderRadius: "10px",
                    px: 0.75,
                    py: 0.1,
                    fontSize: "0.7rem",
                    fontFamily: "monospace",
                    lineHeight: 1.6,
                  }}
                >
                  {availableResearchCount}
                </Box>
              )}
            </Box>
          }
        />
      </Tabs>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {tab === "generators" ? (
          <GeneratorList />
        ) : tab === "upgrades" ? (
          <UpgradePanel />
        ) : (
          <ResearchPanel />
        )}
      </Box>
    </Box>
  );
}
