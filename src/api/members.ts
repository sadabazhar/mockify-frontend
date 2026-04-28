import { apiClient } from './client';
import type { MemberResponse, InvitationResponse, MemberRole } from './types';

export interface InviteMemberRequest {
  email: string;
  role: MemberRole;
}

export const membersApi = {
  listMembers: (orgSlug: string) =>
    apiClient
      .get<MemberResponse[]>(`/organizations/${orgSlug}/members`)
      .then((r) => r.data),

  listInvitations: (orgSlug: string) =>
    apiClient
      .get<
        InvitationResponse[]
      >(`/organizations/${orgSlug}/members/invitations`)
      .then((r) => r.data),

  invite: (orgSlug: string, data: InviteMemberRequest) =>
    apiClient
      .post(`/organizations/${orgSlug}/members/invite`, data)
      .then(() => undefined),

  cancelInvitation: (orgSlug: string, invitationId: string) =>
    apiClient
      .delete(`/organizations/${orgSlug}/members/invitations/${invitationId}`)
      .then(() => undefined),

  changeMemberRole: (orgSlug: string, targetUserId: string, role: MemberRole) =>
    apiClient
      .put<MemberResponse>(
        `/organizations/${orgSlug}/members/${targetUserId}/role`,
        { role },
      )
      .then((r) => r.data),

  removeMember: (orgSlug: string, targetUserId: string) =>
    apiClient
      .delete(`/organizations/${orgSlug}/members/${targetUserId}`)
      .then(() => undefined),

  leaveOrganization: (orgSlug: string) =>
    apiClient
      .post(`/organizations/${orgSlug}/members/leave`)
      .then(() => undefined),

  transferOwnership: (orgSlug: string, newOwnerId: string) =>
    apiClient
      .post(`/organizations/${orgSlug}/members/transfer-ownership`, {
        newOwnerId,
      })
      .then(() => undefined),

  // Calls the root-level endpoint — no org slug in URL
  acceptInvitation: (token: string) =>
    apiClient
      .post(`/invitations/accept?token=${encodeURIComponent(token)}`)
      .then(() => undefined),
};
