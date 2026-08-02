import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Trash2, TrendingUp } from "lucide-react";

export default function AssetCard({ asset, onDelete, logCount }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/analyzer/${asset.id}`)}
      className="group relative cursor-pointer select-none rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-4 transition-all active:scale-[0.98] hover:border-app-accent/50"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-app-accent/15">
          <TrendingUp className="h-5 w-5 text-app-accent" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display font-semibold truncate">{asset.name}</p>
          {asset.symbol && <p className="text-xs text-muted-foreground truncate">{asset.symbol}</p>}
          {typeof logCount === "number" && (
            <p className="text-[11px] text-muted-foreground mt-0.5">{logCount} analyses</p>
          )}
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
      </div>
      {onDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition text-muted-foreground hover:text-bearish"
          aria-label="Delete asset"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}