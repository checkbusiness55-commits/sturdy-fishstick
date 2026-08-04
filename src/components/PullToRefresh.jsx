import React, { useState, useRef } from 'react';

export default function PullToRefresh({ onRefresh, children }) {
  const [pulling, setPulling] = useState(false);
  const [pullProgress, setPullProgress] = useState(0);
  const startY = useRef(0);
  const containerRef = useRef(null);

  const handleTouchStart = (e) => {
    if (containerRef.current?.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e) => {
    if (startY.current && containerRef.current?.scrollTop === 0) {
      const y = e.touches[0].clientY - startY.current;
      if (y > 0) {
        setPulling(true);
        setPullProgress(Math.min(y / 80, 1));
      }
    }
  };

  const handleTouchEnd = async () => {
    if (pullProgress >= 0.8) {
      await onRefresh();
    }
    setPulling(false);
    setPullProgress(0);
    startY.current = 0;
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative"
    >
      {pulling && (
        <div className="absolute top-0 left-0 right-0 flex justify-center py-2">
          <div className="text-xs text-muted-foreground">
            {pullProgress < 0.8 ? 'Pull to refresh...' : 'Release to refresh'}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}