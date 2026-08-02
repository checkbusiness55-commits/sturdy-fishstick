import React, { useState, useRef } from "react";
import { Loader2, ChevronDown } from "lucide-react";

const THRESHOLD = 70;
const MAX = 110;

export default function PullToRefresh({ onRefresh, children }) {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(null);
  const dragging = useRef(false);

  const scrollTop = () => (document.scrollingElement || document.documentElement).scrollTop;

  const onTouchStart = (e) => {
    if (refreshing) return;
    if (scrollTop() <= 0) {
      startY.current = e.touches[0].clientY;
      dragging.current = true;
    }
  };

  const onTouchMove = (e) => {
    if (!dragging.current || refreshing) return;
    if (scrollTop() > 0) {
      startY.current = null;
      setPull(0);
      return;
    }
    const diff = e.touches[0].clientY - startY.current;
    if (diff > 0) setPull(Math.min(diff * 0.5, MAX));
    else setPull(0);
  };

  const onTouchEnd = async () => {
    if (!dragging.current) return;
    dragging.current = false;
    if (pull >= THRESHOLD && !refreshing) {
      setRefreshing(true);
      setPull(THRESHOLD);
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
        setPull(0);
      }
    } else {
      setPull(0);
    }
    startY.current = null;
  };

  const ready = pull >= THRESHOLD;

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
    >
      <div
        className="flex items-center justify-center overflow-hidden"
        style={{
          height: pull,
          transition: refreshing || !dragging.current ? "height 0.2s ease" : "none",
        }}
      >
        {refreshing ? (
          <Loader2 className="h-5 w-5 animate-spin text-app-accent" />
        ) : pull > 8 ? (
          <ChevronDown
            className={`h-5 w-5 text-muted-foreground transition-transform duration-150 ${
              ready ? "rotate-180" : ""
            }`}
          />
        ) : null}
      </div>
      {children}
    </div>
  );
}