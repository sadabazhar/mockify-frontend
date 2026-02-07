import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Header } from '@/components/layout/Header';
import { LayoutContainer } from '@/components/layout/LayoutContainer';

export const Route = createFileRoute('/_protected')({
  component: ProtectedLayout,
});

function ProtectedLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: '/login' });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen w-full bg-background">
      <Header />
      <main className="py-8">
        <LayoutContainer>
          <Outlet />
        </LayoutContainer>
      </main>
    </div>
  );
}
