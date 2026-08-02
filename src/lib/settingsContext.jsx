import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

const SettingsContext = createContext(null);

const DEFAULTS = {
  themeMode: "dark", // 'dark' | 'light' | 'auto'
  accent: "#00E676",
  appLockEnabled: false,
  pin: "",
  hapticEnabled: true,
  soundEnabled: false,
};

function loadSettings() {
  try {
    const raw = localStorage.getItem("app_settings");
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {}
  return { ...DEFAULTS };
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(loadSettings);

  useEffect(() => {
    try {
      localStorage.setItem("app_settings", JSON.stringify(settings));
    } catch {}
  }, [settings]);

  const update = useCallback((patch) => setSettings((s) => ({ ...s, ...patch })), []);

  useEffect(() => {
    const apply = () => {
      let dark;
      if (settings.themeMode === "dark") dark = true;
      else if (settings.themeMode === "light") dark = false;
      else dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", dark);
    };
    apply();
    if (settings.themeMode === "auto") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => apply();
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, [settings.themeMode]);

  useEffect(() => {
    document.documentElement.style.setProperty("--app-accent", settings.accent);
  }, [settings.accent]);

  return <SettingsContext.Provider value={{ settings, update }}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}

export function haptic(settings) {
  if (settings?.hapticEnabled && typeof navigator !== "undefined" && navigator.vibrate) {
    try { navigator.vibrate(30); } catch {}
  }
}