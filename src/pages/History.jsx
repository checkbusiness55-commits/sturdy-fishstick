import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Download, FileJson, FileSpreadsheet, ChevronRight, Trash2 } from "lucide-react";
import PerformanceChart from "@/components/PerformanceChart";
import PullToRefresh from "@/components/PullToRefresh";
import { useSettings, haptic } from "@/lib/settingsContext";
import { toast } from "sonner";

function download(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function History() {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { setLogs(await base44.entities.AnalysisLog.list("-created_date", 500)); } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const refresh = async () => {
    try { setLogs(await base44.entities.AnalysisLog.list("-created_date", 500)); } catch {}
  };

  const grouped = useMemo(() => {
    const map = {};
    logs.forEach((l) => {
      const key = new Date(l.created_date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
      (map[key] = map[key] || []).push(l);
    });
    return Object.entries(map);
  }, [logs]);

  const exportJSON = () => {
    download(`analyses_${Date.now()}.json`, JSON.stringify(logs, null, 2), "application/json");
    haptic(settings);
    toast.success("Exported JSON backup");
  };

  const exportCSV = () => {
    const headers = ["date", "asset", "trend", "score", "c1", "op1", "price", "sma20", "tags", "notes"];
    const rows = logs.map((l) => [
      l.created_date, l.asset_name, l.trend, l.performance_score, l.c1, l.op1, l.current_price, l.sma_20,
      (l.tags || []).join("|"), (l.notes || "").replace(/[\n,]/g, " "),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c ?? "")}"`).join(",")).join("\n");
    download(`analyses_${Date.now()}.csv`, csv, "text/csv");
    haptic(settings);
    toast.success("Exported CSV backup");
  };

  const deleteLog = async (id) => {
    const prev = logs;
    setLogs((p) => p.filter((l) => l.id !== id));
    haptic(settings);
    try {
      await base44.entities.AnalysisLog.delete(id);
    } catch {
      setLogs(prev);
      toast.error("Failed to delete log");
    }
  };

  return (
    <PullToRefresh onRefresh={refresh}>
    <div className="space-y-4 pt-2 pb-4">
      <header className="flex items-center justify-between py-2">
        <h1 className="font-display text-xl font-bold">History &amp; Analytics</h1>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" onClick={exportJSON} className="h-8 px-2"><FileJson className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm" onClick={exportCSV} className="h-8 px-2"><FileSpreadsheet className="h-4 w-4" /></Button>
        </div>
      </header>

      {logs.length > 0 && <PerformanceChart logs={logs} />}

      <div className="flex items-center justify-between rounded-2xl bg-card/70 border border-border px-4 py-3 text-sm">
        <span className="text-muted-foreground">Total analyses</span>
        <span className="font-mono font-semibold">{logs.length}</span>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-sm text-muted-foreground py-8">Loading…</p>
        ) : logs.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">No saved analyses yet.</p>
        ) : (
          grouped.map(([date, items]) => (
            <div key={date} className="space-y-2">
              <p className="text-xs font-semibold uppercase text-muted-foreground px-1">{date}</p>
              {items.map((l) => (
                <div
                  key={l.id}
                  onClick={() => navigate(`/analysis/${l.id}`)}
                  className="group relative flex items-center gap-3 rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-3 cursor-pointer hover:border-app-accent/50 transition active:scale-[0.98] select-none"
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-mono font-bold text-sm ${l.trend === "Bullish" ? "bg-bullish/15 text-bullish" : "bg-bearish/15 text-bearish"}`}>
                    {l.performance_score ?? "—"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold truncate">{l.asset_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {l.trend} · {(l.tags || []).join(" ")}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteLog(l.id); }}
                    className="absolute top-1.5 right-1.5 p-1 rounded-md opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-bearish transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
    </PullToRefresh>
  );
}