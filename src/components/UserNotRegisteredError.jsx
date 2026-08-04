import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function UserNotRegisteredError() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-sm">
        <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
        <h1 className="font-display text-2xl font-bold">Not Registered</h1>
        <p className="text-muted-foreground">You need to create an account to use this app.</p>
        <Button onClick={() => navigate('/register')} className="bg-app-accent text-black hover:opacity-90 w-full">
          Create Account
        </Button>
      </div>
    </div>
  );
}