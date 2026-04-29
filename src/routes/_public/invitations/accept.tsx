import {
  createFileRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import { membersApi } from '@/api/members';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { toast } from 'sonner';

export const Route = createFileRoute('/_public/invitations/accept')({
  validateSearch: (s: Record<string, unknown>) => ({
    token: typeof s.token === 'string' ? s.token : undefined,
  }),
  component: AcceptInvitationPage,
});

function AcceptInvitationPage() {
  const { token } = useSearch({ from: '/invitations/accept' });
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const ran = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({
        to: '/login',
        search: { redirect: `/invitations/accept?token=${token}` },
      });
      return;
    }
    if (!token || ran.current) return;
    ran.current = true;

    membersApi
      .acceptInvitation(token)
      .then(() => {
        toast.success('You have joined the organization');
        navigate({ to: '/organizations' });
      })
      .catch(() => {
        toast.error('Invitation link is invalid or has expired');
        navigate({ to: '/dashboard' });
      });
  }, [isAuthenticated, token, navigate]);

  return <LoadingSpinner fullScreen />;
}
