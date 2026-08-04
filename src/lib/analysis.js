export const calculateAnalysis = (inputs) => {
  const { highs, lows, c1, op1, currentPrice, sma20 } = inputs;
  
  // Calculate pivot levels
  const pivot = (highs + lows + currentPrice) / 3;
  const r1 = 2 * pivot - lows;
  const s1 = 2 * pivot - highs;
  const r2 = pivot + (highs - lows);
  const s2 = pivot - (highs - lows);

  // Trend analysis
  const trend = currentPrice > sma20 ? 'bullish' : currentPrice < sma20 ? 'bearish' : 'neutral';

  // Performance score (0-100)
  const distanceToPivot = Math.abs(currentPrice - pivot);
  const range = highs - lows;
  const score = Math.max(0, Math.min(100, 100 - (distanceToPivot / range * 100)));

  return {
    direct: { support1: s1, resistance1: r1, support2: s2, resistance2: r2, pivot },
    score: Math.round(score),
    trend,
    price: currentPrice
  };
};

export const priceAlert = (currentPrice, levels) => {
  const { resistance1, support1 } = levels;
  
  if (currentPrice >= resistance1) {
    return { level: 'above', message: 'Price at or above R1 Resistance' };
  } else if (currentPrice <= support1) {
    return { level: 'below', message: 'Price at or below S1 Support' };
  }
  return { level: 'neutral', message: 'Price within range' };
};

export const buildShareText = (assetName, inputs, result) => {
  return `Range Pilot Analysis - ${assetName}

Price: ${inputs.currentPrice}
Trend: ${result.trend}
Score: ${result.score}/100

Pivot Levels:
R1: ${result.direct.resistance1.toFixed(4)}
Pivot: ${result.direct.pivot.toFixed(4)}
S1: ${result.direct.support1.toFixed(4)}

R2: ${result.direct.resistance2.toFixed(4)}
S2: ${result.direct.support2.toFixed(4)}

📈 Analyzed with Range Pilot (Offline)`;
}