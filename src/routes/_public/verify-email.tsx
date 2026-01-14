import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { CURRENT_USER_KEY } from '@/hooks/use-auth';
import { tokenStore } from '@/api/token';
import { authApi } from '@/api/auth';

export const Route = createFileRoute('/_public/verify-email')({
  validateSearch: (search: Record<string, unknown>) => ({
    token: search.token as string | undefined,
  }),
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { token } = Route.useSearch();

  type Status = 'loading' | 'success' | 'error';
  const [status, setStatus] = useState<Status>('loading');
  const hasVerifiedRef = useRef(false);

  useEffect(() => {
    if (hasVerifiedRef.current) return;
    hasVerifiedRef.current = true;

    const verifyEmail = async () => {
      if (!token) {
        toast.error('Invalid verification link');
        setStatus('error');
        return;
      }

      try {
        const data = await authApi.verifyEmail(token);

        tokenStore.set(data.access_token);
        queryClient.setQueryData(CURRENT_USER_KEY, data.user);

        setStatus('success');

        setTimeout(() => {
          navigate({ to: '/dashboard' });
        }, 800);
      } catch (err) {
        console.error('Verification failed:', err);
        setStatus('error');
      }
    };

    verifyEmail();
  }, [token, navigate, queryClient]);


  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border bg-background p-6 text-center space-y-4">
        {status === 'loading' && (
          <p className="text-sm text-muted-foreground">Verifying your email…</p>
        )}

        {status === 'success' && (
          <>
            <h1 className="text-xl font-semibold">Email Verified 🎉</h1>
            <p className="text-sm text-muted-foreground">
              Redirecting to dashboard…
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <h1 className="text-xl font-semibold">Verification Failed</h1>
            <p className="text-sm text-muted-foreground">
              The verification link is invalid or expired.
            </p>
            <Button onClick={() => navigate({ to: '/login' })}>
              Go to Login
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
