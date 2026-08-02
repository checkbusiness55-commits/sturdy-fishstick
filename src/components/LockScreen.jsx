import React, { useState } from "react";
import { Lock, Delete } from "lucide-react";
import { useSettings, haptic } from "@/lib/settingsContext";
import CandlestickBackground from "@/components/CandlestickBackground";

export default function LockScreen() {
  const { settings } = useSettings();
  const [entry, setEntry] = useState("");
  const [error, setError] = useState(false);

  const press = (d) => {
    setError(false);
    const next = (entry + d).slice(0, 6);
    setEntry(next);
    haptic(settings);
    if (next.length === String(settings.pin || "").length && next.length > 0) {
      if (next === settings.pin) {
        sessionStorage.setItem("app_unlocked", "1");
        window.location.reload();
      } else {
        setError(true);
        setEntry("");
      }
    }
  };

  const del = () => { setEntry((e) => e.slice(0, -1)); haptic(settings); };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6">
      <CandlestickBackground />
      <div className="w-full max-w-xs flex flex-col items-center gap-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-app-accent/15">
          <Lock className="h-7 w-7 text-app-accent" />
        </div>
        <div className="text-center">
          <h1 className="font-display text-2xl font-semibold">App Locked</h1>
          <p className="text-sm text-muted-foreground mt-1">Enter your PIN to continue</p>
        </div>
        <div className={`flex gap-3 ${error ? "animate-pulse" : ""}`}>
          {Array.from({ length: Math.max(4, String(settings.pin || "").length || 4) }).map((_, i) => (
            <span
              key={i}
              className={`h-3.5 w-3.5 rounded-full border ${
                entry[i] ? "bg-app-accent border-app-accent" : "border-muted-foreground/40"
              } ${error ? "bg-bearish border-bearish" : ""}`}
            />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3 w-full">
          {["1","2","3","4","5","6","7","8","9","","0"].map((d, i) =>
            d === "" ? <div key={i} /> : (
              <button
                key={i}
                onClick={() => press(d)}
                className="h-16 rounded-2xl bg-card/70 backdrop-blur border border-border text-xl font-semibold active:scale-95 transition"
              >
                {d}
              </button>
            )
          )}
          <button onClick={del} className="h-16 rounded-2xl flex items-center justify-center bg-card/70 backdrop-blur border border-border active:scale-95 transition">
            <Delete className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}