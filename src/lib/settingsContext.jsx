import React, { createContext, useContext, useState, useEffect } from 'react';
import { offlineDB } from './offlineDB';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    hapticFeedback: true,
    darkMode: true,
    theme: 'dark'
  });

  useEffect(() => {
    // Load settings from DB on mount
    (async () => {
      try {
        const saved = await offlineDB.getAllSettings();
        if (saved && Object.keys(saved).length > 0) {
          setSettings(prev => ({ ...prev, ...saved }));
        }
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    })();
  }, []);

  const updateSettings = async (newSettings) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    
    // Save to DB
    try {
      for (const [key, value] of Object.entries(newSettings)) {
        await offlineDB.setSetting(key, value);
      }
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};

export const haptic = (settings) => {
  if (settings?.hapticFeedback && navigator.vibrate) {
    navigator.vibrate(10);
  }
};