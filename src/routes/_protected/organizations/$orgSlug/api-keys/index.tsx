import { createFileRoute, Link } from '@tanstack/react-router';
import {
  Key,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Globe,
  FolderKanban,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useApiKeys } from '@/hooks/use-api-key';
import { useProjects } from '@/hooks/use-projects';
import {
  ApiKeyTable,
  ApiKeyTableSkeleton,
} from '@/components/api-key/ApiKeyTable';
import { CreateApiKeyDialog } from '@/components/api-key/CreateApiKeyDialog';

export const Route = createFileRoute(
  '/_protected/organizations/$orgSlug/api-keys/',
)({
  component: ApiKeysPage,
});

// ---- Stats Row -------

function StatsRow({
  total,
  active,
  revoked,
  expired,
  orgWide,
  projectScoped,
}: {
  total: number;
  active: number;
  revoked: number;
  expired: number;
  orgWide: number;
  projectScoped: number;
}) {
  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
      {[
        { label: 'Total', value: total, icon: Key, color: '' },
        {
          label: 'Active',
          value: active,
          icon: CheckCircle2,
          color: 'text-green-600 dark:text-green-400',
        },
        {
          label: 'Revoked',
          value: revoked,
          icon: XCircle,
          color: 'text-red-600 dark:text-red-400',
        },
        {
          label: 'Expired',
          value: expired,
          icon: Clock,
          color: 'text-orange-600 dark:text-orange-400',
        },
        {
          label: 'Org-wide',
          value: orgWide,
          icon: Globe,
          color: 'text-muted-foreground',
        },
        {
          label: 'Project-scoped',
          value: projectScoped,
          icon: FolderKanban,
          color: 'text-primary',
        },
      ].map(({ label, value, icon: Icon, color }) => (
        <div
          key={label}
          className="rounded-lg bg-muted/40 border px-3 py-3 space-y-1"
        >
          <p className="text-[11px] text-muted-foreground">{label}</p>
          <div className={`flex items-center gap-1.5 ${color}`}>
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span className="text-xl font-semibold">{value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---- Empty State ----

function EmptyState({ orgSlug }: { orgSlug: string }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16 text-center gap-4">
        <div className="rounded-full bg-muted p-4">
          <Key className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-1 max-w-sm">
          <h3 className="text-lg font-semibold">No API keys yet</h3>
          <p className="text-sm text-muted-foreground">
            Create an org-wide key for broad access, or a project-scoped key to
            limit access to a single project.
          </p>
        </div>

        <div className="rounded-lg border bg-muted/50 px-4 py-3 text-left w-full max-w-sm font-mono text-xs text-muted-foreground">
          <p className="mb-1 font-sans text-[11px] font-medium">Usage</p>
          X-API-Key: mk_live_...
        </div>

        <CreateApiKeyDialog orgSlug={orgSlug} />
      </CardContent>
    </Card>
  );
}

// ---- Error State ----

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <div className="text-center">
          <p className="font-medium">Failed to load API keys</p>
          <p className="text-sm text-muted-foreground">
            Check your connection and try again.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      </CardContent>
    </Card>
  );
}

function ApiKeysPage() {
  const { orgSlug } = Route.useParams();
  const { data: keys = [], isLoading, isError, refetch } = useApiKeys(orgSlug);

  // Fetch projects so we can resolve projectId → projectName in the table.
  // useProjects is already used in the org detail page — data is cached.
  const { data: projects = [] } = useProjects(orgSlug);

  // Build a lookup map once
  const projectNames: Record<string, string> = Object.fromEntries(
    projects.map((p) => [p.id, p.name]),
  );

  // Derived stats
  const now = new Date();
  const expired = keys.filter(
    (k) => k.active && k.expiresAt && new Date(k.expiresAt) < now,
  ).length;
  const revoked = keys.filter((k) => !k.active).length;
  const active = keys.filter(
    (k) => k.active && !(k.expiresAt && new Date(k.expiresAt) < now),
  ).length;

  const orgWide = keys.filter((k) => !k.projectId).length;
  const projectScoped = keys.filter((k) => !!k.projectId).length;

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb + header ── */}
      <div>
        <Link to="/organizations/$orgSlug" params={{ orgSlug }}>
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {orgSlug}
          </Button>
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2.5">
              <Key className="h-6 w-6 text-primary" />
              API Keys
            </h1>
            <p className="text-muted-foreground">
              Programmatic access for{' '}
              <span className="font-medium text-foreground">{orgSlug}</span>.
              Create org-wide keys or lock a key to a single project.
            </p>
          </div>

          {!isLoading && !isError && keys.length > 0 && (
            <CreateApiKeyDialog orgSlug={orgSlug} />
          )}
        </div>
      </div>

      {/* ── Info notice ── */}
      <div className="flex items-start gap-2.5 rounded-lg border border-blue-300 bg-blue-100 px-4 py-3 dark:border-blue-700 dark:bg-blue-950/50">
        <Key className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-700 dark:text-blue-400" />
        <p className="text-xs text-blue-900 dark:text-blue-200">
          Key management requires a user session (JWT). API keys cannot manage
          other API keys.{' '}
          <span className="text-blue-800/70 dark:text-blue-300/70">
            Rate limit headers on every response:{' '}
            <code className="font-mono">X-RateLimit-Limit</code>,{' '}
            <code className="font-mono">X-RateLimit-Remaining</code>,{' '}
            <code className="font-mono">Retry-After</code> on 429.
          </span>
        </p>
      </div>

      {/* ── Stats ── */}
      {!isLoading && !isError && keys.length > 0 && (
        <StatsRow
          total={keys.length}
          active={active}
          revoked={revoked}
          expired={expired}
          orgWide={orgWide}
          projectScoped={projectScoped}
        />
      )}

      {/* ── Content ── */}
      <div className="space-y-3">
        {!isLoading && !isError && keys.length > 0 && (
          <p className="text-sm font-medium text-muted-foreground">
            {keys.length} key{keys.length !== 1 ? 's' : ''}
          </p>
        )}

        {isLoading && <ApiKeyTableSkeleton />}

        {isError && <ErrorState onRetry={refetch} />}

        {!isLoading && !isError && keys.length === 0 && (
          <EmptyState orgSlug={orgSlug} />
        )}

        {!isLoading && !isError && keys.length > 0 && (
          <ApiKeyTable
            orgSlug={orgSlug}
            keys={keys}
            projectNames={projectNames}
          />
        )}
      </div>

      {/* ── Usage reference ── */}
      <Card className="bg-muted/30 border-dashed">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            How to authenticate with a key
          </CardTitle>
          <CardDescription className="text-xs">
            Both methods work. Use whichever fits your HTTP client.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-3">
          <div>
            <p className="text-[11px] font-medium text-muted-foreground mb-1">
              Header
            </p>
            <code className="font-mono text-xs bg-background border rounded-md px-2.5 py-1.5 block">
              X-API-Key: mk_live_…
            </code>
          </div>
          <div>
            <p className="text-[11px] font-medium text-muted-foreground mb-1">
              Authorization header
            </p>
            <code className="font-mono text-xs bg-background border rounded-md px-2.5 py-1.5 block">
              Authorization: ApiKey mk_live_…
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
