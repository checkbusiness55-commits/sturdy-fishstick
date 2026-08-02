import React, { useEffect, useRef } from "react";

// Animated HTML5-Canvas candlestick chart rendered behind the app.
// Candles drift left; colour follows the active theme tokens (bull/bear).
export default function CandlestickBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;
    let w = 0, h = 0;
    const candles = [];
    const candleW = 14;
    const gap = 6;
    const step = candleW + gap;

    function readColors() {
      const cs = getComputedStyle(document.documentElement);
      return {
        bull: cs.getPropertyValue("--bullish").trim(),
        bear: cs.getPropertyValue("--bearish").trim(),
        isDark: document.documentElement.classList.contains("dark"),
      };
    }

    function resize() {
      w = canvas.width = window.innerWidth * devicePixelRatio;
      h = canvas.height = window.innerHeight * devicePixelRatio;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    }

    function makeCandle(x) {
      const base = h / (2 * devicePixelRatio);
      const open = base + (Math.random() - 0.5) * 80;
      const close = open + (Math.random() - 0.5) * 90;
      const high = Math.max(open, close) + Math.random() * 40;
      const low = Math.min(open, close) - Math.random() * 40;
      return { x, open, close, high, low, bull: close >= open };
    }

    function seed() {
      candles.length = 0;
      const count = Math.ceil(window.innerWidth / step) + 2;
      for (let i = 0; i < count; i++) {
        candles.push(makeCandle(i * step));
      }
    }

    function draw() {
      const { bull, bear, isDark } = readColors();
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const drift = isDark ? "rgba(0,0,0,0)" : "rgba(255,255,255,0)";
      ctx.fillStyle = drift;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      for (const c of candles) {
        const color = c.bull ? `hsl(${bull})` : `hsl(${bear})`;
        ctx.globalAlpha = isDark ? 0.5 : 0.28;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(c.x + candleW / 2, c.high);
        ctx.lineTo(c.x + candleW / 2, c.low);
        ctx.stroke();

        ctx.globalAlpha = isDark ? 0.32 : 0.18;
        ctx.fillStyle = color;
        const top = Math.min(c.open, c.close);
        const bh = Math.max(2, Math.abs(c.close - c.open));
        ctx.fillRect(c.x, top, candleW, bh);
      }
      ctx.globalAlpha = 1;
    }

    function tick() {
      for (const c of candles) c.x -= 0.6;
      // recycle
      while (candles.length && candles[0].x + candleW < 0) candles.shift();
      const last = candles[candles.length - 1];
      while (!last || last.x < window.innerWidth) {
        const nx = (last ? last.x : 0) + step;
        candles.push(makeCandle(nx));
        break;
      }
      draw();
      raf = requestAnimationFrame(tick);
    }

    function onResize() { resize(); seed(); }
    resize();
    seed();
    tick();
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  );
}