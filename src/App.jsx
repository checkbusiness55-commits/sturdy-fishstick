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
  return (
    <Routes>
      <Route element={<Layout />} />
      <Route path="/" element={<Home />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
};


// Fallback render safety
  return <App />;
}


export default function App() {
  return <AuthenticatedApp />;
}
