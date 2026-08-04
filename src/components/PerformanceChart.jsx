import React from 'react';

export default function PerformanceChart({ score }) {
  return (
    <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-4">
      <p className="text-xs text-muted-foreground mb-3">Performance Trend</p>
      <div className="flex items-end gap-1 h-16">
        {[30, 45, 60, 50, 75, score].map((value, i) => (
          <div key={i} className="flex-1">
            <div
              className="bg-app-accent rounded-t transition-all"
              style={{ height: `${(value / 100) * 100}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}