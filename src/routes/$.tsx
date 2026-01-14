import { useAuth } from '@/hooks/useAuth';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/$')({
  component: NotFoundPage,
});

function NotFoundPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold mb-4">404 – Page Not Found</h1>
      <p className="text-muted-foreground mb-6">
        The page you're looking for doesn’t exist or has been moved.
      </p>
      {isAuthenticated ? (
        <Link
          to="/dashboard"
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90"
        >
          Go to Dashboard
        </Link>
      ) : (
        <Link
          to="/login"
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90"
        >
          Sign In
        </Link>
      )}
    </div>
  );
}
