import React, { useEffect, useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, CandlestickChart } from "lucide-react";
import AssetCard from "@/components/AssetCard";
import PullToRefresh from "@/components/PullToRefresh";
import { useSettings, haptic } from "@/lib/settingsContext";
import { toast } from "sonner";

export default function Home() {
  const { settings } = useSettings();
  const [assets, setAssets] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [query, setQuery] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [a, l] = await Promise.all([
        base44.entities.Asset.list("-created_date", 200),
        base44.entities.AnalysisLog.list("-created_date", 500),
      ]);
      setAssets(a);
      setLogs(l);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const refresh = async () => {
    try {
      const [a, l] = await Promise.all([
        base44.entities.Asset.list("-created_date", 200),
        base44.entities.AnalysisLog.list("-created_date", 500),
      ]);
      setAssets(a);
      setLogs(l);
    } catch {}
  };

  const addAsset = async () => {
    if (!name.trim()) return;
    const savedName = name.trim();
    const savedSymbol = symbol.trim();
    const tempId = `temp-${Date.now()}`;
    const optimistic = { id: tempId, name: savedName, symbol: savedSymbol, created_date: new Date().toISOString() };
    setAssets((p) => [optimistic, ...p]);
    setName("");
    setSymbol("");
    haptic(settings);
    try {
      const created = await base44.entities.Asset.create({ name: savedName, symbol: savedSymbol });
      setAssets((p) => p.map((a) => (a.id === tempId ? created : a)));
    } catch {
      setAssets((p) => p.filter((a) => a.id !== tempId));
      toast.error("Failed to add asset");
    }
  };

  const deleteAsset = async (id) => {
    const prev = assets;
    setAssets((p) => p.filter((a) => a.id !== id));
    haptic(settings);
    try {
      await base44.entities.Asset.delete(id);
    } catch {
      setAssets(prev);
      toast.error("Failed to delete asset");
    }
  };

  const logCount = useMemo(() => {
    const map = {};
    logs.forEach((l) => { map[l.asset_id] = (map[l.asset_id] || 0) + 1; });
    return map;
  }, [logs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return assets;
    return assets.filter((a) => `${a.name} ${a.symbol || ""}`.toLowerCase().includes(q));
  }, [assets, query]);

  return (
    <PullToRefresh onRefresh={refresh}>
    <div className="space-y-4 pt-2">
      <header className="flex items-center gap-3 py-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-app-accent/15">
          <CandlestickChart className="h-5 w-5 text-app-accent" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold leading-none">Range Pilot</h1>
          <p className="text-xs text-muted-foreground">Pivot &amp; range analysis</p>
        </div>
      </header>

      <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-4 space-y-3">
        <h2 className="font-display font-semibold text-sm">Add Trading Asset</h2>
        <div className="flex gap-2">
          <Input placeholder="Asset name (e.g. EURUSD)" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Symbol" value={symbol} onChange={(e) => setSymbol(e.target.value)} className="max-w-[7rem]" />
        </div>
        <Button onClick={addAsset} className="w-full bg-app-accent text-black hover:opacity-90">
          <Plus className="h-4 w-4" /> Add Asset
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search assets…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="space-y-2">
        {loading ? (
          <p className="text-center text-sm text-muted-foreground py-8">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            {query ? "No assets match your search." : "No assets yet — add one above to begin."}
          </p>
        ) : (
          filtered.map((a) => (
            <AssetCard key={a.id} asset={a} logCount={logCount[a.id]} onDelete={() => deleteAsset(a.id)} />
          ))
        )}
      </div>
    </div>
    </PullToRefresh>
  );
}