import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ChevronLeft, Bell, Share2, Save, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnalysisForm from "@/components/AnalysisForm";
import ResultCards from "@/components/ResultCards";
import PositionSizer from "@/components/PositionSizer";
import { calculateAnalysis, priceAlert, buildShareText } from "@/lib/analysis";
import { useSettings, haptic } from "@/lib/settingsContext";
import { toast } from "sonner";

export default function Analyzer() {
  const { assetId } = useParams();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [asset, setAsset] = useState(null);
  const [result, setResult] = useState(null);
  const [inputs, setInputs] = useState(null);
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState([]);
  const resultsRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const a = await base44.entities.Asset.get(assetId);
        setAsset(a);
      } catch {
        toast.error("Asset not found");
        navigate("/");
      }
    })();
  }, [assetId]);

  const handleCalculate = (vals) => {
    const r = calculateAnalysis(vals);
    setInputs(vals);
    setResult(r);
    haptic(settings);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const alert = result ? priceAlert(inputs.currentPrice, result.direct) : null;

  const saveLog = async () => {
    if (!result || !inputs) return;
    try {
      await base44.entities.AnalysisLog.create({
        asset_id: assetId,
        asset_name: asset.name,
        highs: inputs.highs,
        lows: inputs.lows,
        c1: inputs.c1,
        op1: inputs.op1,
        current_price: inputs.currentPrice,
        sma_20: inputs.sma20,
        trend: result.trend,
        performance_score: result.score,
        notes: notes.trim(),
        tags,
      });
      haptic(settings);
      toast.success("Analysis saved to history");
    } catch (e) {
      toast.error("Could not save analysis");
    }
  };

  const share = async () => {
    if (!result || !inputs) return;
    const text = buildShareText(asset.name, inputs, result);
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Analysis copied to clipboard");
    } catch {
      toast.error("Share failed");
    }
  };

  if (!asset) return <p className="text-center text-sm text-muted-foreground py-10">Loading…</p>;

  return (
    <div className="space-y-4 pt-2 pb-4">
      <header className="flex items-center gap-2">
        <button onClick={() => navigate("/")} className="p-2 -ml-2 rounded-lg hover:bg-muted">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="font-display text-lg font-bold leading-none">{asset.name}</h1>
          {asset.symbol && <p className="text-xs text-muted-foreground">{asset.symbol}</p>}
        </div>
      </header>

      <AnalysisForm assetId={assetId} onCalculate={handleCalculate} onError={(m) => toast.error(m)} />

      {result && inputs && (
        <div ref={resultsRef} className="space-y-4">
          {/* Price alert flag */}
          <div
            className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
              alert.level === "above"
                ? "border-bullish/40 bg-bullish/10"
                : alert.level === "below"
                ? "border-bearish/40 bg-bearish/10"
                : "border-border bg-card/70"
            }`}
          >
            <Bell className={`h-5 w-5 ${alert.level === "above" ? "text-bullish" : alert.level === "below" ? "text-bearish" : "text-app-accent"}`} />
            <div className="flex-1">
              <p className="text-sm font-semibold">{alert.message}</p>
              <p className="text-xs text-muted-foreground font-mono">Price {inputs.currentPrice}</p>
            </div>
          </div>

          {/* Score badge */}
          <div className="flex items-center justify-between rounded-2xl border border-border bg-card/70 backdrop-blur-sm px-4 py-3">
            <span className="text-sm text-muted-foreground">Performance Score</span>
            <div className="flex items-center gap-2">
              <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-app-accent" style={{ width: `${result.score}%` }} />
              </div>
              <span className="font-mono font-bold">{result.score}/100</span>
            </div>
          </div>

          <ResultCards result={result} />

          <PositionSizer result={result} />

          {/* Notes & tags */}
          <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-4 space-y-3">
            <h3 className="font-display font-semibold text-sm">Notes &amp; Tags</h3>
            <textarea
              placeholder="Add strategy notes…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm min-h-[72px] resize-none focus:outline-none focus:ring-2 ring-app-accent"
            />
            <div className="flex flex-wrap gap-2">
              {["#Win", "#Loss", "#Breakout", "#Reversal", "#Scalp"].map((t) => {
                const active = tags.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => setTags((p) => (active ? p.filter((x) => x !== t) : [...p, t]))}
                    className={`rounded-full px-3 py-1 text-xs font-medium border transition ${
                      active ? "bg-app-accent text-black border-app-accent" : "border-border text-muted-foreground"
                    }`}
                  >
                    {active && <Check className="inline h-3 w-3 mr-1" />}{t}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={saveLog} className="flex-1 bg-app-accent text-black hover:opacity-90">
              <Save className="h-4 w-4" /> Save to History
            </Button>
            <Button variant="outline" onClick={share} className="px-3">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}