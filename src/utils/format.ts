const numberNotation = ["K", "M", "B", "T", "Q", "Qi"];

export function formatUtils(n: number): string {
  if (n < 0) return "-" + formatUtils(-n);
  if (n < 1_000) return n.toFixed(0);
  const exponent = Math.min(
    Math.floor(Math.log10(n) / 3),
    numberNotation.length,
  );
  const scaled = n / Math.pow(1000, exponent);
  const suffix = numberNotation[exponent - 1];
  if (scaled.toFixed(2) === "1000.00") {
    const nextScaled = n / Math.pow(1000, exponent + 1);
    const nextSuffix = numberNotation[exponent];
    return nextScaled.toFixed(2) + nextSuffix;
  }
  return scaled.toFixed(2) + suffix;
}
