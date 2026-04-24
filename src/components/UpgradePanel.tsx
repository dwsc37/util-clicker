import { Avatar, Box, ButtonBase, Typography } from "@mui/material";
import { UPGRADES, type Upgrade } from "../data/upgrades";
import { GENERATORS } from "../data/generators";
import { ACTIONS } from "../store/reducer";
import { formatUtils } from "../utils/format";
import { useGame } from "../context/GameContext";
import lock from "../assets/lock.png";

type UpgradeStatus = "available" | "locked" | "purchased";

function getEffectDescription(isUnlocked: boolean, upgrade: Upgrade): string {
  const gen = GENERATORS.find((g) => g.id === upgrade.targetGeneratorId);
  const name = gen?.name;
  if (!isUnlocked)
    return `Unlocks at ${upgrade.minOwned} ${name}${upgrade.minOwned !== 1 && "s"} owned`;
  if (upgrade.effect === "UPS")
    return `Increase production of ${name}s by ${((upgrade.multiplier - 1) * 100).toFixed(0)}%`;
  return `Decrease cost of ${name}s by ${((1 - upgrade.multiplier) * 100).toFixed(0)}%`;
}

const gridSx = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 1.5,
};

function UpgradeCard({
  status,
  upgrade,
  currentUtils,
  onBuy,
}: {
  status: UpgradeStatus;
  upgrade: Upgrade;
  currentUtils: number;
  onBuy: (id: string) => void;
}) {
  const canAfford = status === "available" && currentUtils >= upgrade.cost;
  const isUnlocked = status === "available" || status === "purchased";

  return (
    <ButtonBase
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        subgridGap: 50,
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
              bgcolor: "#c8d4c8",
              boxShadow: "0 2px 8px rgba(26,31,26,0.15)",
            }
          : {},
      }}
      onClick={() => canAfford && onBuy(upgrade.id)}
      disableRipple={!canAfford}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <Avatar
          src={isUnlocked ? upgrade.icon : lock}
          sx={{ width: 32, height: 32 }}
        />
        <Typography sx={{ fontSize: "1rem", fontWeight: 600, flex: 1 }}>
          {isUnlocked ? upgrade.name : "???"}
        </Typography>
      </Box>
      <Typography
        variant="caption"
        sx={{
          fontSize: "1rem",
          fontStyle: "italic",
        }}
      >
        {getEffectDescription(isUnlocked, upgrade)}
      </Typography>
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
          sx={{
            fontStyle: "italic",
            fontSize: "1rem",
          }}
        >
          cost
        </Typography>
        <Typography
          variant="caption"
          sx={{ fontSize: "1rem", fontWeight: 550 }}
        >
          {formatUtils(upgrade.cost)} utils
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

export function UpgradePanel() {
  const { state, dispatch } = useGame();
  const { utils, ownedGenerators, purchasedUpgrades } = state;

  function handleBuy(upgradeId: string) {
    dispatch({ type: ACTIONS.BUY_UPGRADE, payload: { upgradeId } });
  }

  const available = UPGRADES.filter((u) => {
    if (purchasedUpgrades[u.id]) return false;
    const owned = ownedGenerators[u.targetGeneratorId] ?? 0;
    return owned >= u.minOwned;
  }).sort((a, b) => a.cost - b.cost);

  const locked = UPGRADES.filter((u) => {
    if (purchasedUpgrades[u.id]) return false;
    const owned = ownedGenerators[u.targetGeneratorId] ?? 0;
    return owned > 0 && owned < u.minOwned;
  }).sort((a, b) => a.cost - b.cost);

  const purchased = UPGRADES.filter((u) => purchasedUpgrades[u.id]).sort(
    (a, b) => a.cost - b.cost,
  );

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
      {available.length > 0 && (
        <>
          <SectionHeader label="Available" count={available.length} />
          <Box sx={gridSx}>
            {available.map((u) => (
              <UpgradeCard
                key={u.id}
                status="available"
                upgrade={u}
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
            {locked.map((u) => (
              <UpgradeCard
                key={u.id}
                status="locked"
                upgrade={u}
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
            {purchased.map((u) => (
              <UpgradeCard
                key={u.id}
                status="purchased"
                upgrade={u}
                currentUtils={utils}
                onBuy={handleBuy}
              />
            ))}
          </Box>
        </>
      )}

      {available.length === 0 &&
        locked.length === 0 &&
        purchased.length === 0 && (
          <Typography
            variant="body2"
            sx={{
              fontSize: "1rem",
              fontStyle: "italic",
              color: "text.secondary",
            }}
          >
            No upgrades available yet.
          </Typography>
        )}
    </Box>
  );
}
