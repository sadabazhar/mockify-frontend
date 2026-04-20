import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_protected/organizations/$orgSlug/api-keys/',
)({
  component: ApiKeysPage,
});

function ApiKeysPage() {
  const { orgSlug } = Route.useParams();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
        <p className="text-muted-foreground">
          Managing keys for <strong>{orgSlug}</strong>
        </p>
      </div>
      <p className="text-muted-foreground">Workin on it…</p>
    </div>
  );
}
