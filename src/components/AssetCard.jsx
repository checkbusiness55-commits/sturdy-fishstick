import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';

export default function AssetCard({ asset, logCount, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="rounded-lg border border-border bg-card/70 backdrop-blur-sm p-4 flex items-center justify-between hover:bg-muted/30 transition">
      <button
        onClick={() => navigate(`/analyzer/${asset.id}`)}
        className="flex-1 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-app-accent/15">
            <TrendingUp className="h-5 w-5 text-app-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{asset.name}</h3>
            {asset.symbol && <p className="text-xs text-muted-foreground">{asset.symbol}</p>}
          </div>
        </div>
      </button>
      <div className="text-right ml-4">
        <p className="text-sm font-semibold text-app-accent">{logCount || 0}</p>
        <p className="text-xs text-muted-foreground">analyses</p>
      </div>
      <button
        onClick={() => onDelete()}
        className="ml-4 text-xs text-muted-foreground hover:text-destructive transition"
      >
        ✕
      </button>
    </div>
  );
}