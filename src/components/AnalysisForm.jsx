import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function AnalysisForm({ onCalculate, onError }) {
  const [highs, setHighs] = useState('');
  const [lows, setLows] = useState('');
  const [c1, setC1] = useState('');
  const [op1, setOp1] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [sma20, setSma20] = useState('');
  const [expanded, setExpanded] = useState(true);

  const handleCalculate = () => {
    const h = parseFloat(highs);
    const l = parseFloat(lows);
    const c = parseFloat(c1);
    const o = parseFloat(op1);
    const p = parseFloat(currentPrice);
    const s = parseFloat(sma20);

    if (!h || !l || !c || !o || !p || !s) {
      onError('Please fill in all fields');
      return;
    }

    onCalculate({ highs: h, lows: l, c1: c, op1: o, currentPrice: p, sma20: s });
  };

  return (
    <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition"
      >
        <h2 className="font-display font-semibold text-sm">Analysis Inputs</h2>
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {expanded && (
        <div className="p-4 space-y-3 border-t border-border">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Daily High</label>
              <input
                type="number"
                step="0.0001"
                value={highs}
                onChange={(e) => setHighs(e.target.value)}
                placeholder="0.0000"
                className="w-full mt-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 ring-app-accent"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Daily Low</label>
              <input
                type="number"
                step="0.0001"
                value={lows}
                onChange={(e) => setLows(e.target.value)}
                placeholder="0.0000"
                className="w-full mt-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 ring-app-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Close (C1)</label>
              <input
                type="number"
                step="0.0001"
                value={c1}
                onChange={(e) => setC1(e.target.value)}
                placeholder="0.0000"
                className="w-full mt-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 ring-app-accent"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Open (OP1)</label>
              <input
                type="number"
                step="0.0001"
                value={op1}
                onChange={(e) => setOp1(e.target.value)}
                placeholder="0.0000"
                className="w-full mt-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 ring-app-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Current Price</label>
              <input
                type="number"
                step="0.0001"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
                placeholder="0.0000"
                className="w-full mt-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 ring-app-accent"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">SMA 20</label>
              <input
                type="number"
                step="0.0001"
                value={sma20}
                onChange={(e) => setSma20(e.target.value)}
                placeholder="0.0000"
                className="w-full mt-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 ring-app-accent"
              />
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full mt-4 bg-app-accent text-black font-medium py-2 rounded-lg hover:opacity-90 transition text-sm"
          >
            Calculate
          </button>
        </div>
      )}
    </div>
  );
}