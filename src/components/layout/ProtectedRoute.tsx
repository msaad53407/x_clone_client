import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  // Wait for auth check to complete before redirecting
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
