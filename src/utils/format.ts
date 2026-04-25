const numberNotation = ["K", "M", "B", "T", "Q"];

function floorTo2dp(n: number): string {
  return (Math.floor(n * 100) / 100).toFixed(2);
}

export function formatUtils(n: number): string {
  if (n < 0) return "-" + formatUtils(-n);
  if (n < 1_000) return floorTo2dp(n);
  const exponent = Math.min(
    Math.floor(Math.log10(n) / 3),
    numberNotation.length,
  );
  const scaled = n / Math.pow(1000, exponent);
  const suffix = numberNotation[exponent - 1];
  if (floorTo2dp(scaled) === "1000.00") {
    const nextScaled = n / Math.pow(1000, exponent + 1);
    const nextSuffix = numberNotation[exponent];
    return floorTo2dp(nextScaled) + nextSuffix;
  }
  return floorTo2dp(scaled) + suffix;
}
