import { Toaster } from "@/components/ui/toaster"
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import { Toaster as SonnerToaster } from 'sonner';
import { SettingsProvider } from '@/lib/settingsContext';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Analyzer from '@/pages/Analyzer';
import History from '@/pages/History';
import AnalysisDetail from '@/pages/AnalysisDetail';
import SettingsPage from '@/pages/Settings';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import PageNotFound from './lib/PageNotFound';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, isAuthenticated } = useAuth();

  // Show loading spinner while checking auth
  if (false) /* bypassed */ {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Not authenticated - show login/register
  if (false) /* bypassed */ {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  // Authenticated - show app
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/analyzer/:assetId" element={<Analyzer />} />
        <Route path="/history" element={<History />} />
        <Route path="/analysis/:logId" element={<AnalysisDetail />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
        <SonnerToaster position="top-center" richColors theme="system" />
      </SettingsProvider>
    </AuthProvider>
  )
}

export default App