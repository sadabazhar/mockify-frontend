import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Trash2, Key, Globe, FolderKanban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useCreateApiKey } from '@/hooks/use-api-key';
import { useProjects } from '@/hooks/use-projects';
import { KeyReveal } from './KeyReveal';
import type {
  ApiPermission,
  ApiResourceType,
  CreateApiKeyResult,
} from '@/api/types';

// ─── Validation ───────────────────────────────────────────────────────────────

const createKeySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(255).optional(),
  rateLimitPerMinute: z
    .number()
    .int()
    .min(1, 'Min 1')
    .max(100_000, 'Max 100 000'),
  expiresAt: z.string().optional(),
});

type CreateKeyForm = z.infer<typeof createKeySchema>;

// ─── Constants ────────────────────────────────────────────────────────────────

const RESOURCE_TYPES: ApiResourceType[] = [
  'ORGANIZATION',
  'PROJECT',
  'SCHEMA',
  'RECORD',
];
const PERMISSIONS: ApiPermission[] = ['READ', 'WRITE', 'DELETE', 'ADMIN'];

const PERMISSION_HINT: Record<ApiPermission, string> = {
  READ: 'View only',
  WRITE: 'Create & update',
  DELETE: 'Remove resources',
  ADMIN: 'Full control',
};

// ─── Permission row state ─────────────────────────────────────────────────────

interface PermRow {
  id: number;
  resourceType: ApiResourceType;
  permission: ApiPermission;
  resourceId: string;
}

let _nextId = 1;
const freshRow = (): PermRow => ({
  id: _nextId++,
  resourceType: 'ORGANIZATION',
  permission: 'READ',
  resourceId: '',
});

// ─── Scope selector sub-component ────────────────────────────────────────────

interface ScopeSelectorProps {
  orgSlug: string;
  scope: 'org' | 'project';
  selectedProjectId: string;
  onScopeChange: (s: 'org' | 'project') => void;
  onProjectChange: (id: string) => void;
}

function ScopeSelector({
  orgSlug,
  scope,
  selectedProjectId,
  onScopeChange,
  onProjectChange,
}: ScopeSelectorProps) {
  const { data: projects = [], isLoading } = useProjects(orgSlug);

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Scope</p>
      <p className="text-xs text-muted-foreground -mt-1">
        Org-wide keys can access all projects. Project-scoped keys are locked to
        one project.
      </p>

      <div className="grid grid-cols-2 gap-2 mt-2">
        {/* Org-wide tile */}
        <button
          type="button"
          onClick={() => onScopeChange('org')}
          className={cn(
            'flex flex-col items-start gap-1.5 rounded-lg border p-3 text-left transition-colors',
            scope === 'org'
              ? 'border-blue-400 bg-blue-100 ring-1 ring-blue-300 dark:border-blue-600 dark:bg-blue-950/60 dark:ring-blue-700'
              : 'border-border hover:bg-muted/40',
          )}
        >
          <div className="flex items-center gap-2">
            <Globe
              className={cn(
                'h-3.5 w-3.5 shrink-0',
                scope === 'org'
                  ? 'text-blue-700 dark:text-blue-400'
                  : 'text-muted-foreground',
              )}
            />
            <span className="text-sm font-medium">Organization-wide</span>
          </div>
          <span className="text-xs text-muted-foreground leading-snug">
            Accesses all projects in{' '}
            <span className="font-medium text-foreground">{orgSlug}</span>
          </span>
        </button>

        {/* Project-scoped tile */}
        <button
          type="button"
          onClick={() => onScopeChange('project')}
          className={cn(
            'flex flex-col items-start gap-1.5 rounded-lg border p-3 text-left transition-colors',
            scope === 'project'
              ? 'border-blue-400 bg-blue-100 ring-1 ring-blue-300 dark:border-blue-600 dark:bg-blue-950/60 dark:ring-blue-700'
              : 'border-border hover:bg-muted/40',
          )}
        >
          <div className="flex items-center gap-2">
            <FolderKanban
              className={cn(
                'h-3.5 w-3.5 shrink-0',
                scope === 'project'
                  ? 'text-blue-700 dark:text-blue-400'
                  : 'text-muted-foreground',
              )}
            />
            <span className="text-sm font-medium">Project-scoped</span>
          </div>
          <span className="text-xs text-muted-foreground leading-snug">
            Locked to a single project only
          </span>
        </button>
      </div>

      {/* Project picker — shown when project-scoped is selected */}
      {scope === 'project' && (
        <div className="pt-1">
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Select project
          </label>
          {isLoading ? (
            <div className="h-9 rounded-md border border-input bg-muted/30 animate-pulse" />
          ) : projects.length === 0 ? (
            <p className="text-xs text-destructive">
              No projects found in this organisation. Create one first.
            </p>
          ) : (
            <select
              value={selectedProjectId}
              onChange={(e) => onProjectChange(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">— choose a project —</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface CreateApiKeyDialogProps {
  orgSlug: string;
  /** Optional trigger override — renders the default "New API Key" button otherwise */
  trigger?: React.ReactNode;
}

export function CreateApiKeyDialog({
  orgSlug,
  trigger,
}: CreateApiKeyDialogProps) {
  const [open, setOpen] = useState(false);
  const [revealResult, setRevealResult] = useState<CreateApiKeyResult | null>(
    null,
  );

  // Scope state
  const [scope, setScope] = useState<'org' | 'project'>('org');
  const [selectedProjectId, setSelectedProjectId] = useState('');

  // Permission rows state
  const [permRows, setPermRows] = useState<PermRow[]>([freshRow()]);

  const createMutation = useCreateApiKey(orgSlug);

  const form = useForm<CreateKeyForm>({
    resolver: zodResolver(createKeySchema),
    defaultValues: {
      name: '',
      description: '',
      rateLimitPerMinute: 1000,
      expiresAt: '',
    },
  });

  // ── Permission row helpers ──
  const addPermRow = () =>
    setPermRows((prev) => [
      ...prev,
      { ...freshRow(), resourceType: 'PROJECT', permission: 'READ' },
    ]);

  const removePermRow = (id: number) =>
    setPermRows((prev) => prev.filter((r) => r.id !== id));

  const updatePermRow = (id: number, patch: Partial<PermRow>) =>
    setPermRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    );

  // ── Submit ──
  const onSubmit = async (values: CreateKeyForm) => {
    if (scope === 'project' && !selectedProjectId) {
      // Focus the project select
      return;
    }

    const permissions = permRows.map((r) => ({
      resourceType: r.resourceType,
      permission: r.permission,
      ...(r.resourceId.trim() ? { resourceId: r.resourceId.trim() } : {}),
    }));

    const result = await createMutation.mutateAsync({
      name: values.name,
      description: values.description || undefined,
      rateLimitPerMinute: values.rateLimitPerMinute,
      expiresAt: values.expiresAt || undefined,
      projectId: scope === 'project' ? selectedProjectId : undefined,
      permissions,
    });

    console.log('Created API key', result);

    setRevealResult(result);
  };

  const handleClose = () => {
    setOpen(false);
    setRevealResult(null);
    form.reset();
    setScope('org');
    setSelectedProjectId('');
    setPermRows([freshRow()]);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => (v ? setOpen(true) : handleClose())}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <Key className="mr-2 h-4 w-4" />
            New API Key
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {revealResult ? (
          /* ── Step 2: show the key once ── */
          <>
            <DialogHeader>
              <DialogTitle>API Key Created</DialogTitle>
              <DialogDescription>
                <strong>{revealResult.keyInfo.name}</strong> has been created.
                {revealResult.keyInfo.projectId ? (
                  <span className="ml-1 inline-flex items-center gap-1 rounded border border-blue-300 bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-800 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    <FolderKanban className="h-3 w-3" />
                    project-scoped
                  </span>
                ) : (
                  <span className="ml-1 inline-flex items-center gap-1 rounded border border-border bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                    <Globe className="h-3 w-3" />
                    org-wide
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>
            <KeyReveal plainTextKey={revealResult.apiKey} />
            <DialogFooter>
              <Button onClick={handleClose}>Done</Button>
            </DialogFooter>
          </>
        ) : (
          /* ── Step 1: form ── */
          <>
            <DialogHeader>
              <DialogTitle>Create API Key</DialogTitle>
              <DialogDescription>
                Keys allow programmatic access without a user session.
                Permissions define exactly what the key can read, write, or
                manage.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5 py-1"
              >
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="CI/CD pipeline, Mobile app…"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Description{' '}
                        <span className="font-normal text-muted-foreground">
                          (optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What is this key used for?"
                          className="resize-none"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ── Scope selector ── */}
                <div className="rounded-lg border bg-muted/20 p-4 space-y-3">
                  <ScopeSelector
                    orgSlug={orgSlug}
                    scope={scope}
                    selectedProjectId={selectedProjectId}
                    onScopeChange={setScope}
                    onProjectChange={setSelectedProjectId}
                  />
                </div>

                {/* Rate limit + expiry */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="rateLimitPerMinute"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rate limit</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            max={100000}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Requests per minute · default 1 000
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="expiresAt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Expiry{' '}
                          <span className="font-normal text-muted-foreground">
                            (optional)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Blank = never expires
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* ── Permissions builder ── */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Permissions</p>
                      <p className="text-xs text-muted-foreground">
                        Leave Resource ID blank for wildcard access to all
                        resources of that type.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addPermRow}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {/* Column headers */}
                    <div className="grid grid-cols-[1fr_1fr_1fr_32px] gap-2 px-1">
                      {[
                        'Resource type',
                        'Permission',
                        'Resource ID (optional)',
                        '',
                      ].map((h) => (
                        <p
                          key={h}
                          className="text-[11px] font-medium text-muted-foreground"
                        >
                          {h}
                        </p>
                      ))}
                    </div>

                    {permRows.map((row) => (
                      <div
                        key={row.id}
                        className="grid grid-cols-[1fr_1fr_1fr_32px] gap-2 items-center rounded-lg border bg-muted/30 p-2"
                      >
                        <select
                          value={row.resourceType}
                          onChange={(e) =>
                            updatePermRow(row.id, {
                              resourceType: e.target.value as ApiResourceType,
                            })
                          }
                          className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                          {RESOURCE_TYPES.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>

                        <select
                          value={row.permission}
                          onChange={(e) =>
                            updatePermRow(row.id, {
                              permission: e.target.value as ApiPermission,
                            })
                          }
                          className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          title={PERMISSION_HINT[row.permission]}
                        >
                          {PERMISSIONS.map((p) => (
                            <option
                              key={p}
                              value={p}
                              title={PERMISSION_HINT[p]}
                            >
                              {p} — {PERMISSION_HINT[p]}
                            </option>
                          ))}
                        </select>

                        <Input
                          value={row.resourceId}
                          onChange={(e) =>
                            updatePermRow(row.id, {
                              resourceId: e.target.value,
                            })
                          }
                          placeholder="any"
                          className="h-8 text-xs font-mono"
                        />

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                          onClick={() => removePermRow(row.id)}
                          disabled={permRows.length === 1}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] text-muted-foreground">
                    Hierarchy:{' '}
                    <code className="font-mono text-red-600 dark:text-red-400">
                      ADMIN
                    </code>{' '}
                    ≥{' '}
                    <code className="font-mono text-orange-600 dark:text-orange-400">
                      DELETE
                    </code>{' '}
                    ≥{' '}
                    <code className="font-mono text-amber-600 dark:text-amber-400">
                      WRITE
                    </code>{' '}
                    ≥{' '}
                    <code className="font-mono text-blue-600 dark:text-blue-400">
                      READ
                    </code>
                  </p>
                </div>

                <DialogFooter className="pt-2">
                  <Button type="button" variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      createMutation.isPending ||
                      (scope === 'project' && !selectedProjectId)
                    }
                  >
                    {createMutation.isPending ? 'Creating…' : 'Create API Key'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
