import React, { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from "recharts";

export default function PerformanceChart({ logs }) {
  const data = useMemo(() => {
    return [...logs]
      .sort((a, b) => new Date(a.created_date) - new Date(b.created_date))
      .map((l) => ({
        name: new Date(l.created_date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        score: l.performance_score ?? 0,
      }));
  }, [logs]);

  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-6 text-center text-sm text-muted-foreground">
        No analyses yet — your performance trend will appear here.
      </div>
    );
  }

  const avg = data.reduce((s, d) => s + d.score, 0) / data.length;

  return (
    <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold text-sm">Performance Trend</h3>
        <span className="text-xs text-muted-foreground">Avg <span className="font-mono font-semibold text-app-accent">{avg.toFixed(1)}%</span></span>
      </div>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} interval="preserveStartEnd" />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip
              contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }}
              labelStyle={{ color: "hsl(var(--muted-foreground))" }}
            />
            <ReferenceLine y={avg} stroke="hsl(var(--app-accent))" strokeDasharray="4 4" strokeOpacity={0.5} />
            <Line type="monotone" dataKey="score" stroke="hsl(var(--app-accent))" strokeWidth={2.5} dot={{ r: 3, fill: "hsl(var(--app-accent))" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}