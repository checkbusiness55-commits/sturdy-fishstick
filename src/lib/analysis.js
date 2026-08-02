// Faithful port of integratedandpivotrange.py
// Inputs: highs/lows are arrays of 5 (D1 most recent .. D5)

function calcZone(high, low, closeOrOp, atr) {
  const range = high - low;
  if (range === 0) throw new Error("High and Low values are identical (Range is zero).");
  const pivot = (high + low + closeOrOp) / 3;
  const midpoint = (high + low) / 2;
  const n = (closeOrOp - midpoint) / range;
  const p = Math.abs(n) * atr;
  const pivotOffset = Math.abs(n) * p;
  return {
    pivot,
    n,
    p,
    pivotTop: pivot + pivotOffset,
    pivotBottom: pivot - pivotOffset,
    highZoneStart: high + n * atr,
    highZoneEnd: high + n * atr + p,
    lowZoneStart: low + n * atr,
    lowZoneEnd: low + n * atr - p,
  };
}

export function calculateAnalysis({ highs, lows, c1, op1, currentPrice, sma20 }) {
  const datr = highs[0] - lows[0];
  const aatr = highs.reduce((s, h, i) => s + (h - lows[i]), 0) / 5;
  const ah = (highs.reduce((s, h) => s + h, 0) + op1) / 6;
  const al = (lows.reduce((s, l) => s + l, 0) + op1) / 6;
  const trend = currentPrice > sma20 ? "Bullish" : "Bearish";

  const direct = calcZone(highs[0], lows[0], c1, datr);
  const average = calcZone(ah, al, op1, aatr);

  const drift = (Math.abs(direct.n) + Math.abs(average.n)) / 2;
  const agree = Math.sign(direct.n) === Math.sign(average.n);
  const score = Math.round(Math.min(100, Math.max(0, 40 + drift * 60 + (agree ? 5 : 0))));

  return { datr, aatr, ah, al, trend, direct, average, score };
}

export function priceAlert(currentPrice, direct) {
  if (currentPrice >= direct.highZoneEnd) return { level: "above", message: "Price ABOVE High Zone" };
  if (currentPrice <= direct.lowZoneEnd) return { level: "below", message: "Price BELOW Low Zone" };
  if (currentPrice >= direct.pivot) return { level: "upper", message: "Price in upper half (watch high zone)" };
  return { level: "lower", message: "Price in lower half (watch low zone)" };
}

export function positionSize({ balance, riskPercent, entry, stopLoss, takeProfit }) {
  const riskAmount = (balance * riskPercent) / 100;
  const riskPerUnit = Math.abs(entry - stopLoss);
  const rewardPerUnit = Math.abs(takeProfit - entry);
  const lotSize = riskPerUnit > 0 ? riskAmount / riskPerUnit : 0;
  const rr = riskPerUnit > 0 ? rewardPerUnit / riskPerUnit : 0;
  return { riskAmount, riskPerUnit, rewardPerUnit, lotSize, rr };
}

export function buildShareText(assetName, inputs, r) {
  const fmt = (v) => (typeof v === "number" && isFinite(v) ? v.toFixed(2) : String(v));
  const line = (label, val) => `${label}: ${val}`;
  const z = (zr) =>
    `Pivot ${fmt(zr.pivot)} | Range ${fmt(zr.pivotBottom)}–${fmt(zr.pivotTop)}\n` +
    `  n=${zr.n.toFixed(4)} p=${fmt(zr.p)}\n` +
    `  High Zone ${fmt(zr.highZoneStart)}–${fmt(zr.highZoneEnd)}\n` +
    `  Low Zone ${fmt(zr.lowZoneStart)}–${fmt(zr.lowZoneEnd)}`;
  return [
    `=== ${assetName} — Analysis (${r.trend}) ===`,
    `DATR ${fmt(r.datr)} | AATR ${fmt(r.aatr)} | AH ${fmt(r.ah)} | AL ${fmt(r.al)}`,
    `Performance Score: ${r.score}/100`,
    ``,
    `-- Direct --`,
    z(r.direct),
    ``,
    `-- Average --`,
    z(r.average),
  ].join("\n");
}