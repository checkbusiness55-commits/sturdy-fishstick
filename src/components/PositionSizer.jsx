import React, { useState, useMemo } from "react";
import { positionSize } from "@/lib/analysis";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Scale } from "lucide-react";

function fmt(v) {
  return typeof v === "number" && isFinite(v) ? v.toFixed(2) : "—";
}

export default function PositionSizer({ result }) {
  const [balance, setBalance] = useState("10000");
  const [riskPercent, setRiskPercent] = useState("1");
  const [entry, setEntry] = useState(String(result ? result.direct.pivot : ""));
  const [stopLoss, setStopLoss] = useState(String(result ? result.direct.lowZoneEnd : ""));
  const [takeProfit, setTakeProfit] = useState(String(result ? result.direct.highZoneEnd : ""));

  const calc = useMemo(() => {
    const e = parseFloat(entry), s = parseFloat(stopLoss), t = parseFloat(takeProfit), b = parseFloat(balance), r = parseFloat(riskPercent);
    if (![e, s, t, b, r].every((v) => isFinite(v))) return null;
    return positionSize({ balance: b, riskPercent: r, entry: e, stopLoss: s, takeProfit: t });
  }, [entry, stopLoss, takeProfit, balance, riskPercent]);

  return (
    <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Scale className="h-4 w-4 text-app-accent" />
        <h3 className="font-display font-semibold">Risk-Reward & Position Sizing</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-[11px] uppercase text-muted-foreground">Account Balance</Label>
          <Input type="number" inputMode="decimal" value={balance} onChange={(e) => setBalance(e.target.value)} />
        </div>
        <div>
          <Label className="text-[11px] uppercase text-muted-foreground">Risk %</Label>
          <Input type="number" inputMode="decimal" value={riskPercent} onChange={(e) => setRiskPercent(e.target.value)} />
        </div>
        <div>
          <Label className="text-[11px] uppercase text-muted-foreground">Entry</Label>
          <Input type="number" inputMode="decimal" value={entry} onChange={(e) => setEntry(e.target.value)} />
        </div>
        <div>
          <Label className="text-[11px] uppercase text-muted-foreground">Stop Loss</Label>
          <Input type="number" inputMode="decimal" value={stopLoss} onChange={(e) => setStopLoss(e.target.value)} className="text-bearish" />
        </div>
        <div className="col-span-2">
          <Label className="text-[11px] uppercase text-muted-foreground">Take Profit</Label>
          <Input type="number" inputMode="decimal" value={takeProfit} onChange={(e) => setTakeProfit(e.target.value)} className="text-bullish" />
        </div>
      </div>
      {calc && (
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-muted/50 p-3">
            <p className="text-[11px] uppercase text-muted-foreground flex items-center gap-1"><Shield className="h-3 w-3" /> Risk Amount</p>
            <p className="font-mono font-semibold">{fmt(calc.riskAmount)}</p>
          </div>
          <div className="rounded-xl bg-muted/50 p-3">
            <p className="text-[11px] uppercase text-muted-foreground">Recommended Lot</p>
            <p className="font-mono font-semibold">{fmt(calc.lotSize)}</p>
          </div>
          <div className="col-span-2 rounded-xl bg-app-accent/10 p-3 flex items-center justify-between">
            <span className="text-[11px] uppercase text-muted-foreground">Risk : Reward</span>
            <span className={`font-mono font-bold ${calc.rr >= 1.5 ? "text-bullish" : calc.rr >= 1 ? "text-app-accent" : "text-bearish"}`}>
              1 : {fmt(calc.rr)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}