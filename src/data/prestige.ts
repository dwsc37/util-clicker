export const PRESTIGE_HERALD_THRESHOLD = 100_000_000;
export const PRESTIGE_UNLOCK_THRESHOLD = 500_000_000;

/**
 *   500M  → 1 + 0.7 = ×1.7
 *   1B    → 1 + 1.0 = ×2.0
 *   10B   → 1 + 2.0 = ×3.0
 *   100B  → 1 + 3.0 = ×4.0
 */
export function computePrestigeMultiplier(lifetimeUtilsEarned: number): number {
  if (lifetimeUtilsEarned < PRESTIGE_UNLOCK_THRESHOLD) return 1;
  const raw = Math.log10(lifetimeUtilsEarned / 1e8);
  return 1 + Math.round(raw * 10) / 10;
}

export function prestigeProgress(lifetimeUtilsEarned: number): number {
  if (lifetimeUtilsEarned >= PRESTIGE_UNLOCK_THRESHOLD) return 1;
  return lifetimeUtilsEarned / PRESTIGE_UNLOCK_THRESHOLD;
}
