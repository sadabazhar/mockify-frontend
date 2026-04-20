import { createFileRoute } from '@tanstack/react-router';
import { useApiKeys } from '@/hooks/use-api-key';
import type { ApiKeyResponse } from '@/api/types';
import { ApiKeyTable } from '@/components/api-key/ApiKeyTable';
import { useProjects } from '@/hooks/use-projects';
import { CreateApiKeyDialog } from '@/components/api-key/CreateApiKeyDialog';

export const Route = createFileRoute(
  '/_protected/organizations/$orgSlug/api-keys/',
)({
  component: ApiKeysPage,
});

function StatsRow({ keys }: { keys: ApiKeyResponse[] }) {
  const now = new Date();
  const expired = keys.filter(
    (k) => k.expiresAt && new Date(k.expiresAt) < now,
  ).length;
  const revoked = keys.filter((k) => !k.active).length;
  const active = keys.length - revoked - expired;
  const orgWide = keys.filter((k) => !k.projectId).length;
  const projScoped = keys.filter((k) => !!k.projectId).length;

  const stats = [
    { label: 'Total', value: keys.length, color: '' },
    {
      label: 'Active',
      value: active,
      color: 'text-green-700 dark:text-green-400',
    },
    {
      label: 'Revoked',
      value: revoked,
      color: 'text-red-700 dark:text-red-400',
    },
    {
      label: 'Expired',
      value: expired,
      color: 'text-orange-700 dark:text-orange-400',
    },
    { label: 'Org-wide', value: orgWide, color: 'text-muted-foreground' },
    {
      label: 'Project-scoped',
      value: projScoped,
      color: 'text-blue-700 dark:text-blue-400',
    },
  ];

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
      {stats.map(({ label, value, color }) => (
        <div
          key={label}
          className="rounded-lg border bg-muted/40 px-3 py-3 space-y-1"
        >
          <p className="text-[11px] text-muted-foreground">{label}</p>
          <p className={`text-xl font-semibold ${color}`}>{value}</p>
        </div>
      ))}
    </div>
  );
}

function ApiKeysPage() {
  const { orgSlug } = Route.useParams();
  const { data: keys = [], isLoading, isError } = useApiKeys(orgSlug);

  const { data: projects = [] } = useProjects(orgSlug);
  const projectNames: Record<string, string> = Object.fromEntries(
    projects.map((p) => [p.id, p.name]),
  );
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
      </div>

      {!isLoading && !isError && <CreateApiKeyDialog orgSlug={orgSlug} />}

      {!isLoading && !isError && keys.length > 0 && <StatsRow keys={keys} />}

      {!isLoading && !isError && keys.length > 0 && (
        <ApiKeyTable
          orgSlug={orgSlug}
          keys={keys}
          projectNames={projectNames}
        />
      )}
    </div>
  );
}
