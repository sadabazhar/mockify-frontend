import { cn } from '@/lib/utils';
import type { ApiPermission, ApiResourceType } from '@/api/types';

// ------- Colour mapping --------
const PERMISSION_STYLES: Record<ApiPermission, string> = {
  READ: 'bg-blue-100   text-blue-800   border-blue-300   dark:bg-blue-950   dark:text-blue-300   dark:border-blue-700',
  WRITE:
    'bg-amber-100  text-amber-800  border-amber-300  dark:bg-amber-950  dark:text-amber-300  dark:border-amber-700',
  DELETE:
    'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-700',
  ADMIN:
    'bg-red-100    text-red-800    border-red-300    dark:bg-red-950    dark:text-red-300    dark:border-red-700',
};

// -------- Components --------

interface PermissionBadgeProps {
  resourceType: ApiResourceType;
  permission: ApiPermission;
  resourceId?: string;
  className?: string;
}

export function PermissionBadge({
  resourceType,
  permission,
  resourceId,
  className,
}: PermissionBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10px] font-medium leading-none',
        PERMISSION_STYLES[permission],
        className,
      )}
      title={
        resourceId
          ? `Scoped to resource: ${resourceId}`
          : 'Wildcard (all resources)'
      }
    >
      <span>{resourceType}</span>
      <span className="opacity-50">·</span>
      <span className="font-semibold">{permission}</span>
      {resourceId && <span className="opacity-60 ml-0.5">↗</span>}
    </span>
  );
}

interface PermissionBadgeListProps {
  permissions: {
    resourceType: ApiResourceType;
    permission: ApiPermission;
    resourceId?: string;
  }[];
  maxVisible?: number;
}

export function PermissionBadgeList({
  permissions,
  maxVisible = 3,
}: PermissionBadgeListProps) {
  if (permissions.length === 0) {
    return (
      <span className="text-xs text-muted-foreground italic">
        No permissions
      </span>
    );
  }

  const visible = permissions.slice(0, maxVisible);
  const overflow = permissions.length - maxVisible;

  return (
    <div className="flex flex-wrap gap-1 items-center">
      {visible.map((p, i) => (
        <PermissionBadge
          key={i}
          resourceType={p.resourceType}
          permission={p.permission}
          resourceId={p.resourceId}
        />
      ))}
      {overflow > 0 && (
        <span className="text-[10px] text-muted-foreground font-medium">
          +{overflow} more
        </span>
      )}
    </div>
  );
}
