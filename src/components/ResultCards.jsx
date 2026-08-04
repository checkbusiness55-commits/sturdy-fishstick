import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function ResultCards({ result }) {
  const { direct, trend } = result;
  const isUptrend = trend === 'bullish';

  return (
    <div className="space-y-3">
      {/* Resistance Levels */}
      <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-4">
        <h3 className="text-xs text-muted-foreground mb-3 font-medium">RESISTANCE</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs">R2</span>
            <span className="font-mono font-bold text-app-accent">{direct.resistance2.toFixed(4)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs">R1</span>
            <span className="font-mono font-bold text-app-accent">{direct.resistance1.toFixed(4)}</span>
          </div>
        </div>
      </div>

      {/* Pivot */}
      <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">PIVOT</p>
            <p className="font-mono font-bold text-lg">{direct.pivot.toFixed(4)}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end">
              {isUptrend ? (
                <TrendingUp className="h-6 w-6 text-bullish" />
              ) : (
                <TrendingDown className="h-6 w-6 text-bearish" />
              )}
            </div>
            <p className="text-xs text-muted-foreground capitalize">{trend}</p>
          </div>
        </div>
      </div>

      {/* Support Levels */}
      <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-4">
        <h3 className="text-xs text-muted-foreground mb-3 font-medium">SUPPORT</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs">S1</span>
            <span className="font-mono font-bold text-app-accent">{direct.support1.toFixed(4)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs">S2</span>
            <span className="font-mono font-bold text-app-accent">{direct.support2.toFixed(4)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}