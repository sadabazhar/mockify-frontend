import { createFileRoute } from '@tanstack/react-router';
import { useApiKeys } from '@/hooks/use-api-key';

export const Route = createFileRoute(
  '/_protected/organizations/$orgSlug/api-keys/',
)({
  component: ApiKeysPage,
});

function ApiKeysPage() {
  const { orgSlug } = Route.useParams();
  const { data: keys = [], isLoading, isError } = useApiKeys(orgSlug);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
        <p className="text-muted-foreground">
          Managing keys for <strong>{orgSlug}</strong>
        </p>
      </div>

      {isLoading && <p className="text-muted-foreground">Loading…</p>}
      {isError && <p className="text-destructive">Failed to load keys.</p>}
      {!isLoading && !isError && (
        <p className="text-muted-foreground">{keys.length} key(s) found</p>
      )}
    </div>
  );
}
