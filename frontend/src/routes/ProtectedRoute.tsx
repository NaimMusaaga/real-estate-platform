import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Spinner } from '../components/common/Spinner';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" className="text-brand-600" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return children;
}
