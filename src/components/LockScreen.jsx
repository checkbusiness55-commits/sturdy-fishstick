import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';

export default function LockScreen({ children }) {
  const [isLocked, setIsLocked] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [pin, setPin] = useState('');

  useEffect(() => {
    const lockEnabled = localStorage.getItem('lock_screen_enabled') === 'true';
    setIsLocked(lockEnabled);
  }, []);

  const handlePinEntry = (digit) => {
    if (pin.length < 4) {
      setPin(pin + digit);
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const handleUnlock = () => {
    const savedPin = localStorage.getItem('lock_screen_pin');
    if (pin === savedPin) {
      setIsLocked(false);
      setPin('');
    } else {
      setAttempts(attempts + 1);
      setPin('');
      if (attempts >= 2) {
        alert('Too many attempts');
      }
    }
  };

  if (!isLocked) {
    return children;
  }

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center p-4 z-50">
      <div className="space-y-8 w-full max-w-sm">
        <div className="text-center">
          <Lock className="h-12 w-12 text-app-accent mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold">App Locked</h1>
          <p className="text-sm text-muted-foreground mt-2">Enter your PIN to continue</p>
        </div>

        <div className="flex justify-center gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-4 w-4 rounded-full bg-muted border-2 border-app-accent" style={{
              opacity: i < pin.length ? 1 : 0.3
            }} />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handlePinEntry(num.toString())}
              className="h-12 rounded-lg bg-card/70 border border-border hover:bg-muted text-lg font-semibold transition"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handlePinEntry('0')}
            className="h-12 rounded-lg bg-card/70 border border-border hover:bg-muted text-lg font-semibold transition col-start-2"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="h-12 rounded-lg bg-card/70 border border-border hover:bg-muted text-lg font-semibold transition"
          >
            ⌫
          </button>
        </div>

        {pin.length === 4 && (
          <button
            onClick={handleUnlock}
            className="w-full h-12 bg-app-accent text-black font-semibold rounded-lg hover:opacity-90 transition"
          >
            Unlock
          </button>
        )}
      </div>
    </div>
  );
}