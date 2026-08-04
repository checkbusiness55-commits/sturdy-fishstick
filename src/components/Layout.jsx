import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function Layout() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <main className="flex-1 overflow-auto pb-20">
        <div className="max-w-2xl mx-auto px-4">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}