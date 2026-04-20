import { useState } from 'react';
import {
  RefreshCw,
  Ban,
  Trash2,
  MoreHorizontal,
  Clock,
  CheckCircle2,
  XCircle,
  Zap,
  Globe,
  FolderKanban,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PermissionBadgeList } from './PermissionBadge';
import { RotateKeyDialog } from './RotateKeyDialog';
import { RevokeKeyDialog } from './RevokeKeyDialog';
import { DeleteKeyDialog } from './DeleteKeyDialog';
import { formatRelativeTime } from '@/lib/utils';
import type { ApiKeyResponse } from '@/api/types';

// -------- Status badge --------

function StatusBadge({
  active,
  expired,
}: {
  active: boolean;
  expired: boolean;
}) {
  if (expired) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-orange-300 bg-orange-100 px-2 py-0.5 text-[11px] font-medium text-orange-800 dark:border-orange-700 dark:bg-orange-950 dark:text-orange-300">
        <Clock className="h-2.5 w-2.5" />
        Expired
      </span>
    );
  }
  if (!active) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-red-300 bg-red-100 px-2 py-0.5 text-[11px] font-medium text-red-800 dark:border-red-700 dark:bg-red-950 dark:text-red-300">
        <XCircle className="h-2.5 w-2.5" />
        Revoked
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-green-300 bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-800 dark:border-green-700 dark:bg-green-950 dark:text-green-300">
      <CheckCircle2 className="h-2.5 w-2.5" />
      Active
    </span>
  );
}

// -------- Scope badge --------

interface ScopeBadgeProps {
  projectId?: string;
  /**
   * Pass the projects list from the parent (already fetched) to resolve
   * the project name from its ID without an extra network call.
   */
  projectName?: string;
}

function ScopeBadge({ projectId, projectName }: ScopeBadgeProps) {
  if (!projectId) {
    return (
      <span className="inline-flex items-center gap-1 rounded border border-border bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
        <Globe className="h-2.5 w-2.5" />
        Org-wide
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1 rounded border border-blue-300 bg-blue-100 px-1.5 py-0.5 text-[11px] font-medium text-blue-800 max-w-[120px] dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300"
      title={`Project ID: ${projectId}`}
    >
      <FolderKanban className="h-2.5 w-2.5 shrink-0" />
      <span className="truncate">{projectName ?? 'Project-scoped'}</span>
    </span>
  );
}

// -------- Row actions --------

type ModalType = 'rotate' | 'revoke' | 'delete' | null;

interface RowActionsProps {
  orgSlug: string;
  apiKey: ApiKeyResponse;
  isExpired: boolean;
}

function RowActions({ orgSlug, apiKey, isExpired }: RowActionsProps) {
  const [modal, setModal] = useState<ModalType>(null);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Key actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {apiKey.active && !isExpired && (
            <DropdownMenuItem onClick={() => setModal('rotate')}>
              <RefreshCw className="mr-2 h-3.5 w-3.5" />
              Rotate key
            </DropdownMenuItem>
          )}
          {apiKey.active && (
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setModal('revoke')}
            >
              <Ban className="mr-2 h-3.5 w-3.5" />
              Revoke key
            </DropdownMenuItem>
          )}
          {apiKey.active && <DropdownMenuSeparator />}
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => setModal('delete')}
          >
            <Trash2 className="mr-2 h-3.5 w-3.5" />
            Delete permanently
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {modal === 'rotate' && (
        <RotateKeyDialog
          orgSlug={orgSlug}
          apiKey={apiKey}
          open
          onClose={() => setModal(null)}
        />
      )}
      {modal === 'revoke' && (
        <RevokeKeyDialog
          orgSlug={orgSlug}
          apiKey={apiKey}
          open
          onClose={() => setModal(null)}
        />
      )}
      {modal === 'delete' && (
        <DeleteKeyDialog
          orgSlug={orgSlug}
          apiKey={apiKey}
          open
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}

// -------- Skeleton --------

export function ApiKeyTableSkeleton() {
  return (
    <div className="rounded-lg border divide-y overflow-hidden">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-4 p-4">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-56" />
          </div>
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-8" />
        </div>
      ))}
    </div>
  );
}

// -------- Main table --------

interface ApiKeyTableProps {
  orgSlug: string;
  keys: ApiKeyResponse[];
  /**
   * Map of projectId → projectName, built from the org's project list.
   * Used to resolve human-readable names for project-scoped keys.
   */
  projectNames?: Record<string, string>;
}

export function ApiKeyTable({
  orgSlug,
  keys,
  projectNames = {},
}: ApiKeyTableProps) {
  if (keys.length === 0) return null;

  return (
    <div className="rounded-lg border overflow-hidden divide-y">
      {/* Header row */}
      <div className="hidden md:grid md:grid-cols-[2fr_1.2fr_1.8fr_1.2fr_1fr_1fr_auto] items-center gap-3 bg-muted/40 px-4 py-2.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        <span>Name / Key</span>
        <span>Scope</span>
        <span>Permissions</span>
        <span>Usage</span>
        <span>Rate limit</span>
        <span>Status</span>
        <span />
      </div>

      {keys.map((key) => {
        const isExpired =
          !!key.expiresAt && new Date(key.expiresAt) < new Date();
        const projectName = key.projectId
          ? projectNames[key.projectId]
          : undefined;
        // Normalise stats — backend may omit the field entirely on newly-created
        // keys, or return it with null inner fields. Guard both cases.
        const stats = {
          lastUsedAt: key?.lastUsedAt ?? undefined,
        };

        return (
          <div
            key={key.id}
            className="grid grid-cols-1 md:grid-cols-[2fr_1.2fr_1.8fr_1.2fr_1fr_1fr_auto] items-center gap-3 px-4 py-3.5 hover:bg-muted/20 transition-colors"
          >
            {/* Name + masked key */}
            <div className="min-w-0 space-y-0.5">
              <p className="text-sm font-medium leading-none truncate">
                {key.name}
              </p>
              <code className="font-mono text-[11px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                {key.keyPrefix}
              </code>
              {key.description && (
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {key.description}
                </p>
              )}
            </div>

            {/* Scope */}
            <div>
              <ScopeBadge projectId={key.projectId} projectName={projectName} />
            </div>

            {/* Permissions */}
            <div>
              <PermissionBadgeList
                permissions={key.permissions ?? []}
                maxVisible={2}
              />
            </div>

            {/* Usage */}
            <div className="space-y-0.5">
              {stats.lastUsedAt ? (
                <p className="text-xs text-muted-foreground">
                  Last {formatRelativeTime(stats.lastUsedAt)}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  Never used
                </p>
              )}
              {key.expiresAt && (
                <p
                  className={`text-xs ${isExpired ? 'text-orange-600 dark:text-orange-400' : 'text-muted-foreground'}`}
                >
                  {isExpired ? 'Expired ' : 'Expires '}
                  {formatRelativeTime(key.expiresAt)}
                </p>
              )}
            </div>

            {/* Rate limit */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Zap className="h-3 w-3 shrink-0" />
              <span>{key.rateLimitPerMinute.toLocaleString()}/min</span>
            </div>

            {/* Status */}
            <div>
              <StatusBadge active={key.active} expired={isExpired} />
            </div>

            {/* Actions */}
            <div className="flex justify-end">
              <RowActions
                orgSlug={orgSlug}
                apiKey={key}
                isExpired={isExpired}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
