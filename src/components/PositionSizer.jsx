import React, { useState } from 'react';

export default function PositionSizer({ result }) {
  const [accountSize, setAccountSize] = useState('1000');
  const [riskPercent, setRiskPercent] = useState('2');

  const acct = parseFloat(accountSize) || 0;
  const risk = parseFloat(riskPercent) || 0;
  const riskAmount = (acct * risk) / 100;
  const pipRange = Math.abs(result.direct.resistance1 - result.direct.support1);
  const positionSize = pipRange > 0 ? riskAmount / pipRange : 0;

  return (
    <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-4 space-y-4">
      <h3 className="font-display font-semibold text-sm">Position Sizer</h3>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground">Account Size ($)</label>
          <input
            type="number"
            value={accountSize}
            onChange={(e) => setAccountSize(e.target.value)}
            className="w-full mt-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 ring-app-accent"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Risk %</label>
          <input
            type="number"
            step="0.1"
            value={riskPercent}
            onChange={(e) => setRiskPercent(e.target.value)}
            className="w-full mt-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 ring-app-accent"
          />
        </div>
      </div>

      <div className="rounded-lg bg-app-accent/10 border border-app-accent/20 p-3">
        <p className="text-xs text-muted-foreground mb-1">Risk Amount</p>
        <p className="text-lg font-bold text-app-accent">${riskAmount.toFixed(2)}</p>
      </div>

      <div className="rounded-lg bg-app-accent/10 border border-app-accent/20 p-3">
        <p className="text-xs text-muted-foreground mb-1">Position Size</p>
        <p className="text-lg font-bold text-app-accent">{positionSize.toFixed(4)}</p>
      </div>
    </div>
  );
}