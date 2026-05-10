import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  useMembers,
  usePendingInvitations,
  useInviteMember,
  useChangeMemberRole,
  useRemoveMember,
  useCancelInvitation,
} from '@/hooks/use-members';
import type {
  MemberRole,
  MemberResponse,
  InvitationResponse,
} from '@/api/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { getInitials, formatRelativeTime } from '@/lib/utils';
import { MoreHorizontal, Plus, Mail, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const ROLE_META: Record<MemberRole, { label: string; className: string }> = {
  OWNER: {
    label: 'Owner',
    className:
      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  },
  ADMIN: {
    label: 'Admin',
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  },
  DEVELOPER: {
    label: 'Developer',
    className:
      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  },
  VIEWER: {
    label: 'Viewer',
    className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  },
};

const ASSIGNABLE_ROLES: MemberRole[] = ['ADMIN', 'DEVELOPER', 'VIEWER'];

function RoleBadge({ role }: { role: MemberRole }) {
  const { label, className } = ROLE_META[role];
  return (
    <span
      className={cn('text-xs font-medium px-2 py-0.5 rounded-full', className)}
    >
      {label}
    </span>
  );
}

interface Props {
  orgSlug: string;
  /** The current user's role in this org. Controls what actions are shown. */
  userRole: MemberRole;
}

export function MembersTab({ orgSlug, userRole }: Props) {
  const { user } = useAuth();
  const { data: members, isLoading: membersLoading } = useMembers(orgSlug);
  const { data: invitations, isLoading: invLoading } =
    usePendingInvitations(orgSlug);

  const canManage = userRole === 'OWNER' || userRole === 'ADMIN';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Members</h2>
          <p className="text-sm text-muted-foreground">
            Manage who has access to this organization.
          </p>
        </div>
        {canManage && <InviteModal orgSlug={orgSlug} userRole={userRole} />}
      </div>

      {/* Member list */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          {members?.length ?? 0} {members?.length === 1 ? 'member' : 'members'}
        </h3>

        {membersLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-border/30">
            {members?.map((member) => (
              <MemberRow
                key={member.id}
                member={member}
                orgSlug={orgSlug}
                currentUserId={user?.id ?? ''}
                actorRole={userRole}
                canManage={canManage}
              />
            ))}
          </div>
        )}
      </section>

      {/* Pending invitations — only visible to ADMIN+ */}
      {canManage && (
        <section>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Clock className="h-3.5 w-3.5" />
            Pending invitations
          </h3>

          {invLoading ? (
            <Skeleton className="h-20 w-full" />
          ) : invitations && invitations.length > 0 ? (
            <div className="divide-y divide-border/30">
              {invitations.map((inv) => (
                <InvitationRow
                  key={inv.id}
                  invitation={inv}
                  orgSlug={orgSlug}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No pending invitations.
            </p>
          )}
        </section>
      )}
    </div>
  );
}

// ─── Member row ──────────────────────────────────────────────────────────────

function MemberRow({
  member,
  orgSlug,
  currentUserId,
  actorRole,
  canManage,
}: {
  member: MemberResponse;
  orgSlug: string;
  currentUserId: string;
  actorRole: MemberRole;
  canManage: boolean;
}) {
  const changeRole = useChangeMemberRole(orgSlug);
  const removeMember = useRemoveMember(orgSlug);

  const isSelf = member.userId === currentUserId;
  const isOwner = member.role === 'OWNER';

  // Actor can manage this member only if they outrank them
  const RANK: Record<MemberRole, number> = {
    VIEWER: 0,
    DEVELOPER: 1,
    ADMIN: 2,
    OWNER: 3,
  };
  const canEdit =
    canManage && !isOwner && RANK[actorRole] > RANK[member.role] && !isSelf;

  return (
    <div className="flex items-center gap-3 py-3">
      <Avatar className="h-9 w-9">
        <AvatarFallback className="bg-muted text-sm">
          {getInitials(member.name)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-none">
          {member.name}
          {isSelf && (
            <span className="ml-1.5 text-xs text-muted-foreground">(you)</span>
          )}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">
          {member.email}
        </p>
      </div>

      <RoleBadge role={member.role} />

      {canEdit && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <p className="px-2 py-1.5 text-xs text-muted-foreground font-medium">
              Change role
            </p>
            {ASSIGNABLE_ROLES.filter((r) => r !== member.role).map((role) => (
              <DropdownMenuItem
                key={role}
                onClick={() =>
                  changeRole.mutate({ userId: member.userId, role })
                }
                disabled={changeRole.isPending}
              >
                Make {ROLE_META[role].label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => {
                if (confirm(`Remove ${member.name} from this organization?`)) {
                  removeMember.mutate(member.userId);
                }
              }}
              disabled={removeMember.isPending}
            >
              Remove member
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

// ─── Invitation row ───────────────────────────────────────────────────────────

function InvitationRow({
  invitation,
  orgSlug,
}: {
  invitation: InvitationResponse;
  orgSlug: string;
}) {
  const cancel = useCancelInvitation(orgSlug);

  return (
    <div className="flex items-center gap-3 py-3">
      <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center shrink-0">
        <Mail className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-none truncate">
          {invitation.email}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Invited by {invitation.invitedByName} · expires{' '}
          {formatRelativeTime(invitation.expiresAt)}
        </p>
      </div>
      <RoleBadge role={invitation.role} />
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground hover:text-destructive shrink-0"
        onClick={() => cancel.mutate(invitation.id)}
        disabled={cancel.isPending}
      >
        Cancel
      </Button>
    </div>
  );
}

// ─── Invite modal ─────────────────────────────────────────────────────────────

function InviteModal({
  orgSlug,
  userRole,
}: {
  orgSlug: string;
  userRole: MemberRole;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<MemberRole>('DEVELOPER');
  const invite = useInviteMember(orgSlug);

  const RANK: Record<MemberRole, number> = {
    VIEWER: 0,
    DEVELOPER: 1,
    ADMIN: 2,
    OWNER: 3,
  };
  const invitableRoles = ASSIGNABLE_ROLES.filter(
    (r) => (RANK[userRole] ?? -1) > RANK[r],
  );

  const handleSubmit = async () => {
    if (!email.trim()) return;
    await invite.mutateAsync({ email: email.trim(), role });
    setEmail('');
    setRole('DEVELOPER');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-3.5 w-3.5" />
          Invite member
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a team member</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="invite-email">Email address</Label>
            <Input
              id="invite-email"
              type="email"
              placeholder="colleague@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="invite-role">Role</Label>
            <select
              id="invite-role"
              value={role}
              onChange={(e) => setRole(e.target.value as MemberRole)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {invitableRoles.map((r) => (
                <option key={r} value={r}>
                  {ROLE_META[r].label}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">
              {role === 'VIEWER' &&
                'Can view schemas and records but cannot make changes.'}
              {role === 'DEVELOPER' &&
                'Can create and edit schemas and records.'}
              {role === 'ADMIN' &&
                'Full access except deleting the organization or transferring ownership.'}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={invite.isPending || !email.trim()}
          >
            {invite.isPending ? 'Sending…' : 'Send invitation'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
