import React from 'react';

export default function ProtectedRoute({ children, isAuthenticated }) {
  if (!isAuthenticated) {
    return null;
  }
  return children;
}