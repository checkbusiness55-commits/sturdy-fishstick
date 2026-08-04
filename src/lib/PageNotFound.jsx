import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home as HomeIcon } from 'lucide-react';

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-4">
        <div className="text-6xl font-bold text-app-accent">404</div>
        <h1 className="font-display text-2xl font-bold">Page Not Found</h1>
        <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/')} className="bg-app-accent text-black hover:opacity-90">
          <HomeIcon className="h-4 w-4" /> Back to Home
        </Button>
      </div>
    </div>
  );
}