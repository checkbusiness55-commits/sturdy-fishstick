import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import CandlestickBackground from "@/components/CandlestickBackground";
import BottomNav from "@/components/BottomNav";
import LockScreen from "@/components/LockScreen";
import { useSettings } from "@/lib/settingsContext";

function AnimatedOutlet() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -12 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}

export default function Layout() {
  const { settings } = useSettings();
  const unlocked = sessionStorage.getItem("app_unlocked") === "1";

  if (settings.appLockEnabled && !unlocked) {
    return (
      <div className="relative min-h-screen">
        <CandlestickBackground />
        <LockScreen />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-20">
      <CandlestickBackground />
      <main className="mx-auto max-w-md min-h-screen px-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <AnimatedOutlet />
      </main>
      <BottomNav />
    </div>
  );
}