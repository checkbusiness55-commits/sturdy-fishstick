# Range Pilot - Offline Trading Analysis App

## 🚀 100% Offline | No Server Required | All Data Local

Range Pilot is a fully offline trading analysis application for Android. Analyze trading ranges, calculate pivot levels, and manage your trading logs — all stored securely on your device.

### Features

✅ **100% Offline** - Works without internet connection  
✅ **Local Authentication** - Your account stays on your device  
✅ **Trading Analysis** - Pivot, support, and resistance calculations  
✅ **Position Sizing** - Risk management tools  
✅ **Analysis History** - All trades saved locally  
✅ **Dark Mode** - Easy on the eyes  
✅ **Android Native** - Built with Capacitor  

### Quick Start

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build
npm run build

# Build for Android
npx cap build android
```

### Setup for Android

1. **Install Capacitor**
   ```bash
   npm install -D @capacitor/core @capacitor/cli @capacitor/android
   npx cap init
   ```

2. **Add Android Platform**
   ```bash
   npx cap add android
   ```

3. **Build and Deploy**
   ```bash
   npm run build
   npx cap sync
   npx cap open android
   ```

### Database

All data is stored in **IndexedDB** (Dexie.js):
- **Users** - Local authentication with hashed passwords
- **Assets** - Trading instruments
- **Analysis Logs** - All analysis records
- **Settings** - App preferences

### Security

- Passwords are hashed with SHA256 + salt
- No data leaves your device
- Sessions stored in localStorage only
- Clear all data option in Settings

### Tech Stack

- **React 18** - UI framework
- **Dexie.js** - IndexedDB wrapper
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Lucide Icons** - Icons
- **Sonner** - Notifications
- **CryptoJS** - Password hashing
- **Capacitor** - Android bridge

### File Structure

```
src/
  lib/
    db.js               - Database schema
    offlineDB.js        - Database operations
    authService.js      - Authentication
    cryptoUtils.js      - Password hashing
    AuthContext.jsx     - Auth state management
    analysis.js         - Trading calculations
  pages/
    Home.jsx            - Assets list
    Analyzer.jsx        - Analysis tool
    History.jsx         - Analysis history
    AnalysisDetail.jsx   - Detailed view
    Settings.jsx        - App settings
    Login.jsx           - Login page
    Register.jsx        - Registration page
  components/
    AnalysisForm.jsx    - Input form
    PositionSizer.jsx   - Position calculator
    ResultCards.jsx     - Results display
    Layout.jsx          - Main layout
    BottomNav.jsx       - Navigation
```

### Usage

1. **Create Account** - Sign up with username, email, password
2. **Add Assets** - Add trading pairs (EURUSD, etc.)
3. **Analyze** - Enter highs, lows, current price, SMA20
4. **View Results** - See pivot levels, support, resistance
5. **Save Logs** - Store analysis with notes and tags
6. **Review History** - Access all past analyses

### Keyboard Shortcuts

- Swipe down from top to refresh
- Long press asset to delete
- Tap analysis to view details

### Privacy

All data is yours. Nothing is sent to our servers because there are no servers. Your trading data never leaves your phone.

### License

MIT

### Support

For issues, create an issue on GitHub or check the docs.

---

**Range Pilot v1.0.0** | Built for traders, by traders 📈
