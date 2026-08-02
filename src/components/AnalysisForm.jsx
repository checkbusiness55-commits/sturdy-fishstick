import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Save } from "lucide-react";

const DAYS = [1, 2, 3, 4, 5];

function emptyInputs() {
  return {
    highs: ["", "", "", "", ""],
    lows: ["", "", "", "", ""],
    c1: "",
    op1: "",
    currentPrice: "",
    sma20: "",
  };
}

function fromTemplate(t) {
  if (!t) return emptyInputs();
  return {
    highs: (t.highs || []).map(String).concat(Array(5).fill("")).slice(0, 5),
    lows: (t.lows || []).map(String).concat(Array(5).fill("")).slice(0, 5),
    c1: t.c1 != null ? String(t.c1) : "",
    op1: t.op1 != null ? String(t.op1) : "",
    currentPrice: t.currentPrice != null ? String(t.currentPrice) : "",
    sma20: t.sma20 != null ? String(t.sma20) : "",
  };
}

export default function AnalysisForm({ assetId, onCalculate, onError }) {
  const draftKey = `draft_${assetId}`;
  const tmplKey = `tmpl_${assetId}`;
  const [inputs, setInputs] = useState(() => {
    try {
      const d = localStorage.getItem(draftKey);
      if (d) return JSON.parse(d);
    } catch {}
    return emptyInputs();
  });

  useEffect(() => {
    try { localStorage.setItem(draftKey, JSON.stringify(inputs)); } catch {}
  }, [inputs, draftKey]);

  const set = (field, value) => setInputs((p) => ({ ...p, [field]: value }));
  const setArr = (field, i, value) =>
    setInputs((p) => {
      const arr = [...p[field]];
      arr[i] = value;
      return { ...p, [field]: arr };
    });

  const num = (v) => {
    const n = parseFloat(v);
    return isFinite(n) ? n : null;
  };

  const handleCalculate = () => {
    const highs = inputs.highs.map(num);
    const lows = inputs.lows.map(num);
    const c1 = num(inputs.c1);
    const op1 = num(inputs.op1);
    const currentPrice = num(inputs.currentPrice);
    const sma20 = num(inputs.sma20);
    if ([...highs, ...lows, c1, op1, currentPrice, sma20].some((v) => v === null)) {
      onError("Please fill all numeric fields (Highs/Lows D1–D5, C1, Op1, Price, SMA20).");
      return;
    }
    try {
      onCalculate({ highs, lows, c1, op1, currentPrice, sma20 });
    } catch (e) {
      onError(e.message || "Calculation error.");
    }
  };

  const saveTemplate = () => {
    const highs = inputs.highs.map(num);
    const lows = inputs.lows.map(num);
    try { localStorage.setItem(tmplKey, JSON.stringify({ highs, lows })); onError("Template saved."); } catch {}
  };

  const loadTemplate = () => {
    try {
      const t = JSON.parse(localStorage.getItem(tmplKey));
      if (!t) { onError("No template saved yet."); return; }
      setInputs((p) => ({ ...p, highs: fromTemplate(t).highs, lows: fromTemplate(t).lows }));
    } catch {}
  };

  const reset = () => setInputs(emptyInputs());

  return (
    <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-semibold flex items-center gap-2">
          <Calculator className="h-4 w-4 text-app-accent" /> Market Inputs
        </h2>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={loadTemplate} className="h-8 text-xs">Load</Button>
          <Button variant="ghost" size="sm" onClick={saveTemplate} className="h-8 text-xs"><Save className="h-3.5 w-3.5" />Save</Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-[2.5rem_1fr_1fr] gap-2 text-[11px] uppercase text-muted-foreground px-1">
          <span></span><span className="text-center text-bullish font-semibold">High</span><span className="text-center text-bearish font-semibold">Low</span>
        </div>
        {DAYS.map((d, i) => (
          <div key={d} className="grid grid-cols-[2.5rem_1fr_1fr] gap-2 items-center">
            <Label className="text-xs font-semibold text-muted-foreground">D{d}</Label>
            <Input
              type="number"
              inputMode="decimal"
              step="any"
              placeholder={`H${d}`}
              value={inputs.highs[i]}
              onChange={(e) => setArr("highs", i, e.target.value)}
              className="text-right font-mono"
            />
            <Input
              type="number"
              inputMode="decimal"
              step="any"
              placeholder={`L${d}`}
              value={inputs.lows[i]}
              onChange={(e) => setArr("lows", i, e.target.value)}
              className="text-right font-mono"
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 pt-1">
        <div>
          <Label className="text-[11px] uppercase text-muted-foreground">Close Prev (C1)</Label>
          <Input type="number" inputMode="decimal" step="any" value={inputs.c1} onChange={(e) => set("c1", e.target.value)} className="font-mono" />
        </div>
        <div>
          <Label className="text-[11px] uppercase text-muted-foreground">Open Today (Op1)</Label>
          <Input type="number" inputMode="decimal" step="any" value={inputs.op1} onChange={(e) => set("op1", e.target.value)} className="font-mono" />
        </div>
        <div>
          <Label className="text-[11px] uppercase text-muted-foreground">Current Price</Label>
          <Input type="number" inputMode="decimal" step="any" value={inputs.currentPrice} onChange={(e) => set("currentPrice", e.target.value)} className="font-mono" />
        </div>
        <div>
          <Label className="text-[11px] uppercase text-muted-foreground">20-Period SMA</Label>
          <Input type="number" inputMode="decimal" step="any" value={inputs.sma20} onChange={(e) => set("sma20", e.target.value)} className="font-mono" />
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <Button onClick={handleCalculate} className="flex-1 bg-app-accent text-black hover:opacity-90">
          <Calculator className="h-4 w-4" /> Calculate
        </Button>
        <Button variant="outline" onClick={reset} className="px-3"><RotateCcw className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}