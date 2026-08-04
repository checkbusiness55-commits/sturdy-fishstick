import { useLocation, useNavigate } from 'react-router-dom';
import { Home, History, Settings } from 'lucide-react';

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const isActive = (route) => path === route || path.startsWith(route + '/');

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/80 backdrop-blur-sm">
      <div className="max-w-2xl mx-auto px-4 flex justify-around">
        <button
          onClick={() => navigate('/')}
          className={`flex-1 flex items-center justify-center py-3 text-xs font-medium transition ${
            isActive('/') ? 'text-app-accent border-t-2 border-app-accent' : 'text-muted-foreground'
          }`}
        >
          <Home className="h-5 w-5" />
        </button>
        <button
          onClick={() => navigate('/history')}
          className={`flex-1 flex items-center justify-center py-3 text-xs font-medium transition ${
            isActive('/history') ? 'text-app-accent border-t-2 border-app-accent' : 'text-muted-foreground'
          }`}
        >
          <History className="h-5 w-5" />
        </button>
        <button
          onClick={() => navigate('/settings')}
          className={`flex-1 flex items-center justify-center py-3 text-xs font-medium transition ${
            isActive('/settings') ? 'text-app-accent border-t-2 border-app-accent' : 'text-muted-foreground'
          }`}
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>
    </nav>
  );
}