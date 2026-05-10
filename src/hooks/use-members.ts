import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { membersApi, type InviteMemberRequest } from '@/api/members';
import type { MemberRole } from '@/api/types';

export function useMembers(orgSlug: string) {
  return useQuery({
    queryKey: ['members', orgSlug],
    queryFn: () => membersApi.listMembers(orgSlug),
    enabled: !!orgSlug,
  });
}

export function usePendingInvitations(orgSlug: string) {
  return useQuery({
    queryKey: ['invitations', orgSlug],
    queryFn: () => membersApi.listInvitations(orgSlug),
    enabled: !!orgSlug,
  });
}

export function useInviteMember(orgSlug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: InviteMemberRequest) => membersApi.invite(orgSlug, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['invitations', orgSlug] });
      toast.success('Invitation sent');
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message ?? 'Failed to send invitation'),
  });
}

export function useChangeMemberRole(orgSlug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: MemberRole }) =>
      membersApi.changeMemberRole(orgSlug, userId, role),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['members', orgSlug] });
      toast.success('Role updated');
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message ?? 'Failed to update role'),
  });
}

export function useRemoveMember(orgSlug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => membersApi.removeMember(orgSlug, userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['members', orgSlug] });
      toast.success('Member removed');
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message ?? 'Failed to remove member'),
  });
}

export function useCancelInvitation(orgSlug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (invitationId: string) =>
      membersApi.cancelInvitation(orgSlug, invitationId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['invitations', orgSlug] });
      toast.success('Invitation cancelled');
    },
  });
}

export function useLeaveOrganization(orgSlug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => membersApi.leaveOrganization(orgSlug),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['organizations'] });
      toast.success('Left organization');
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message ?? 'Cannot leave organization'),
  });
}
