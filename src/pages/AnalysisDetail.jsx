import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Save, Share2 } from "lucide-react";
import ResultCards from "@/components/ResultCards";
import PositionSizer from "@/components/PositionSizer";
import { calculateAnalysis, buildShareText } from "@/lib/analysis";
import { useSettings, haptic } from "@/lib/settingsContext";
import { toast } from "sonner";

export default function AnalysisDetail() {
  const { logId } = useParams();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [log, setLog] = useState(null);
  const [result, setResult] = useState(null);
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const l = await base44.entities.AnalysisLog.get(logId);
        setLog(l);
        setNotes(l.notes || "");
        setTags(l.tags || []);
        setResult(
          calculateAnalysis({
            highs: l.highs,
            lows: l.lows,
            c1: l.c1,
            op1: l.op1,
            currentPrice: l.current_price,
            sma20: l.sma_20,
          })
        );
      } catch {
        toast.error("Analysis not found");
        navigate("/history");
      }
    })();
  }, [logId]);

  const save = async () => {
    try {
      await base44.entities.AnalysisLog.update(logId, { notes: notes.trim(), tags });
      haptic(settings);
      toast.success("Updated");
    } catch { toast.error("Update failed"); }
  };

  const share = async () => {
    if (!result || !log) return;
    const text = buildShareText(log.asset_name, { highs: log.highs, lows: log.lows, c1: log.c1, op1: log.op1, currentPrice: log.current_price, sma20: log.sma_20 }, result);
    try { await navigator.clipboard.writeText(text); toast.success("Copied to clipboard"); } catch { toast.error("Share failed"); }
  };

  if (!log || !result) return <p className="text-center text-sm text-muted-foreground py-10">Loading…</p>;

  return (
    <div className="space-y-4 pt-2 pb-4">
      <header className="flex items-center gap-2">
        <button onClick={() => navigate("/history")} className="p-2 -ml-2 rounded-lg hover:bg-muted">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="font-display text-lg font-bold leading-none">{log.asset_name}</h1>
          <p className="text-xs text-muted-foreground">{new Date(log.created_date).toLocaleString()}</p>
        </div>
      </header>

      <div className="flex items-center justify-between rounded-2xl border border-border bg-card/70 backdrop-blur-sm px-4 py-3">
        <span className="text-sm text-muted-foreground">Performance Score</span>
        <div className="flex items-center gap-2">
          <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-app-accent" style={{ width: `${log.performance_score ?? 0}%` }} />
          </div>
          <span className="font-mono font-bold">{log.performance_score ?? "—"}/100</span>
        </div>
      </div>

      <ResultCards result={result} />
      <PositionSizer result={result} />

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
                {t}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={save} className="flex-1 bg-app-accent text-black hover:opacity-90">
          <Save className="h-4 w-4" /> Update
        </Button>
        <Button variant="outline" onClick={share} className="px-3"><Share2 className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}