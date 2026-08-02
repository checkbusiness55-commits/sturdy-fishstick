import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

function fmt(v) {
  return typeof v === "number" && isFinite(v) ? v.toFixed(2) : "—";
}

function ZoneBar({ start, end, min, max, color }) {
  const span = max - min || 1;
  const left = ((start - min) / span) * 100;
  const width = Math.max(2, ((end - start) / span) * 100);
  return (
    <div className="relative h-2 rounded-full bg-muted">
      <div
        className={`absolute top-0 h-2 rounded-full ${color}`}
        style={{ left: `${Math.max(0, left)}%`, width: `${Math.min(100, width)}%` }}
      />
    </div>
  );
}

function ZoneCard({ title, z, accent }) {
  const allVals = [z.pivot, z.pivotTop, z.pivotBottom, z.highZoneStart, z.highZoneEnd, z.lowZoneStart, z.lowZoneEnd];
  const min = Math.min(...allVals);
  const max = Math.max(...allVals);
  const bull = z.n >= 0;
  return (
    <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold">{title}</h3>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
            bull ? "bg-bullish/15 text-bullish" : "bg-bearish/15 text-bearish"
          }`}
        >
          {bull ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
          {bull ? "Drift Up" : "Drift Down"}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-[11px] uppercase text-muted-foreground">Pivot</p>
          <p className="font-mono font-semibold">{fmt(z.pivot)}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase text-muted-foreground">Pivot Range</p>
          <p className="font-mono">{fmt(z.pivotBottom)} – {fmt(z.pivotTop)}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase text-muted-foreground">Drift (n)</p>
          <p className="font-mono">{z.n.toFixed(4)}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase text-muted-foreground">Buffer (p)</p>
          <p className="font-mono">{fmt(z.p)}</p>
        </div>
      </div>
      <div className="space-y-1.5 pt-1">
        <div className="flex justify-between text-[11px]">
          <span className="text-bearish font-medium">Low Zone</span>
          <span className="font-mono text-bearish">{fmt(z.lowZoneEnd)} – {fmt(z.lowZoneStart)}</span>
        </div>
        <ZoneBar start={z.lowZoneEnd} end={z.lowZoneStart} min={min} max={max} color="bg-bearish/70" />
        <div className="flex justify-between text-[11px]">
          <span className="text-bullish font-medium">High Zone</span>
          <span className="font-mono text-bullish">{fmt(z.highZoneStart)} – {fmt(z.highZoneEnd)}</span>
        </div>
        <ZoneBar start={z.highZoneStart} end={z.highZoneEnd} min={min} max={max} color="bg-bullish/70" />
      </div>
    </div>
  );
}

export default function ResultCards({ result }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-2xl bg-app-accent/10 border border-app-accent/30 px-4 py-3">
        <span className="text-sm text-muted-foreground">Trend / Averages</span>
        <div className="text-right text-sm font-mono">
          <span className={result.trend === "Bullish" ? "text-bullish font-semibold" : "text-bearish font-semibold"}>
            {result.trend}
          </span>
          <span className="text-muted-foreground"> · DATR {fmt(result.datr)} · AATR {fmt(result.aatr)}</span>
        </div>
      </div>
      <ZoneCard title="Direct Model" z={result.direct} />
      <ZoneCard title="Average Model" z={result.average} />
    </div>
  );
}