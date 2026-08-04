import React from 'react';

export default function CandlestickBackground() {
  return (
    <div className="absolute inset-0 opacity-5 overflow-hidden pointer-events-none">
      <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="candlesticks" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            {/* Bullish candle */}
            <rect x="20" y="40" width="8" height="40" fill="#00E676" />
            <rect x="18" y="30" width="12" height="10" fill="#00E676" />
            <line x1="24" y1="30" x2="24" y2="20" stroke="#00E676" strokeWidth="1" />
            <line x1="24" y1="80" x2="24" y2="90" stroke="#00E676" strokeWidth="1" />

            {/* Bearish candle */}
            <rect x="60" y="30" width="8" height="50" fill="#FF4444" />
            <rect x="58" y="20" width="12" height="10" fill="#FF4444" />
            <line x1="64" y1="80" x2="64" y2="90" stroke="#FF4444" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="1000" height="1000" fill="url(#candlesticks)" />
      </svg>
    </div>
  );
}