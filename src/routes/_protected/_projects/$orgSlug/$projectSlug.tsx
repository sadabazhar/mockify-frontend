import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useProject } from '@/hooks/use-projects';
import { useCreateSchema, useDeleteSchema } from '@/hooks/use-schemas';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Plus,
  FileCode,
  Database,
  Trash2,
  ArrowLeft,
  Copy,
} from 'lucide-react';
import { toast } from 'sonner';
import { formatRelativeTime } from '@/lib/utils';
import { useProjectStats } from '@/hooks/use-DashboardStats';

export const Route = createFileRoute('/_protected/_projects/$orgSlug/$projectSlug')({
  component: ProjectDetail,
});

function ProjectDetail() {
  const { orgSlug, projectSlug } = Route.useParams();
  const { data: project, isLoading } = useProject(orgSlug, projectSlug);
  const { data: projectStats, isLoading: isProjectStatsLoading } = useProjectStats(project?.id);
  console.log("Project Stats: ", projectStats);

  const createSchemaMutation = useCreateSchema(orgSlug, projectSlug);
  const deleteSchemaMutation = useDeleteSchema(orgSlug, projectSlug);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [schemaName, setSchemaName] = useState('');
  const [schemaDefinition, setSchemaDefinition] = useState(
    JSON.stringify(
      {
        id: 'number',
        name: 'string',
        email: 'string',
      },
      null,
      2,
    ),
  );

  const handleCreateSchema = async () => {
    if (!schemaName.trim()) {
      toast.error('Schema name is required');
      return;
    }

    try {
      const schemaJson = JSON.parse(schemaDefinition);
      
      await createSchemaMutation.mutateAsync({
        name: schemaName,
        schemaJson,
      });
      setSchemaName('');
      setSchemaDefinition('{}');
      setIsCreateOpen(false);
    } catch (error) {
      toast.error('Invalid JSON schema definition');
    }
  };

  const handleDeleteSchema = async (schemaSlug: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      await deleteSchemaMutation.mutateAsync(schemaSlug);
    }
  };

  const copyEndpoint = (url: string) => {
    navigator.clipboard.writeText(`${window.location.origin}${url}`);
    toast.success('Endpoint URL copied to clipboard');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Project not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/organizations/$orgSlug"
          params={{ orgSlug }}
        >
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {project.organization.name}
          </Button>
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {project.name}
            </h1>
            <p className="text-muted-foreground">
              {project.organization.name} • Created{' '}
              {formatRelativeTime(project.createdAt)}
            </p>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Schema
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Schema</DialogTitle>
                <DialogDescription>
                  Define a new mock data schema
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="schemaName">Schema Name</Label>
                  <Input
                    id="schemaName"
                    placeholder="User Schema"
                    value={schemaName}
                    onChange={(e) => setSchemaName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schemaDefinition">
                    Schema Definition (JSON)
                  </Label>
                  <Textarea
                    id="schemaDefinition"
                    placeholder="Schema JSON..."
                    value={schemaDefinition}
                    onChange={(e) => setSchemaDefinition(e.target.value)}
                    className="font-mono text-sm min-h-[300px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateSchema}
                  disabled={createSchemaMutation.isPending}
                >
                  {createSchemaMutation.isPending ? 'Creating...' : 'Create'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Schemas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isProjectStatsLoading ? '...' : projectStats?.schemaCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isProjectStatsLoading ? '...' : projectStats?.recordCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Active Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {isProjectStatsLoading ? '...' : projectStats?.activeRecords}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Expired Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {project.stats.expiredRecords}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schemas */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Schemas</h2>
        {project.schemas && project.schemas.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {project.schemas.map((schema) => (
              <Card
                key={schema.id}
                className="relative group hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Link
                      to="/$orgSlug/$projectSlug/$schemaSlug"
                      params={{ 
                        orgSlug: orgSlug,
                        projectSlug: projectSlug,
                        schemaSlug: schema.slug,
                      }}
                      className="flex-1"
                    >
                      <CardTitle className="hover:text-primary transition-colors">
                        {schema.name}
                      </CardTitle>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteSchema(schema.slug, schema.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription>
                    <div className="flex items-center gap-2">
                      <Database className="h-3 w-3" />
                      {schema.recordCount}{' '}
                      {schema.recordCount === 1 ? 'record' : 'records'}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-2">
                    Created {formatRelativeTime(schema.createdAt)}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                    onClick={() =>
                    copyEndpoint(`/${orgSlug}/${projectSlug}/${schema.slug}`)
                    }
                  >
                    <Copy className="h-3 w-3" />
                    Copy API Endpoint
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileCode className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No schemas yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create your first schema to start generating mock data
              </p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Schema
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
