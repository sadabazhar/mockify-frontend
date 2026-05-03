import { useState } from 'react';
import { LayoutTemplate, Sparkles, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useApplyTemplate, useSystemTemplates } from '@/hooks/use-schema-templates';
import type { SchemaTemplate } from '@/api/types';

interface Props {
    orgSlug: string;
    projectSlug: string;
}

const CATEGORY_STYLES: Record<string, string> = {
    user: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    product: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    ecommerce: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    finance: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    blog: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    default: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

function CategoryBadge({ category }: { category?: string }) {
    const style = CATEGORY_STYLES[category?.toLowerCase() || 'default'] || CATEGORY_STYLES.default;
    return (
        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${style}`}>
            {category || 'General'}
        </span>
    );
}

function TemplateCard({ template, onApply, isApplying }: {
    template: SchemaTemplate;
    onApply: (slug: string) => void;
    isApplying: boolean;
}) {
    const schemaKeys = Object.keys(template.schema || {});
    const previewKeys = schemaKeys.slice(0, 6);
    const hiddenCount = schemaKeys.length - previewKeys.length;

    return (
        <div className="group relative flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-4 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
            <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-1">
                    <span className="font-semibold text-sm text-foreground leading-tight">{template.name}</span>
                    <CategoryBadge category={template.category} />
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Code2 className="h-4 w-4" />
                </div>
            </div>

            {template.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">{template.description}</p>
            )}

            <div className="flex flex-wrap gap-1 mt-1">
                {previewKeys.map((key) => (
                    <span key={key} className="rounded-md bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                        {key}
                    </span>
                ))}
                {hiddenCount > 0 && (
                    <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                        +{hiddenCount} more
                    </span>
                )}
            </div>

            <div className="mt-auto pt-2">
                <Button 
                    size="sm" 
                    className="w-full gap-2" 
                    onClick={() => onApply(template.slug)} 
                    disabled={isApplying}
                >
                    {isApplying ? (
                        <span className="h-3 w-3 animate-spin rounded-full border-2 border-t-transparent" />
                    ) : (
                        <Sparkles className="h-3.5 w-3.5" />
                    )}
                    Apply Template
                </Button>
            </div>
        </div>
    );
}

export function SchemaTemplatesBrowser({ orgSlug, projectSlug }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [applyingSlug, setApplyingSlug] = useState<string | null>(null);

    const { data: templates, isLoading, isError } = useSystemTemplates();
    const applyMutation = useApplyTemplate(orgSlug, projectSlug);

    const handleApply = async (slug: string) => {
        setApplyingSlug(slug);
        try {
            await applyMutation.mutateAsync(slug);
            setIsOpen(false);
        } catch (err) {
            console.error("Template application failed:", err);
        } finally {
            setApplyingSlug(null);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <LayoutTemplate className="h-4 w-4" />
                    Use Template
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <LayoutTemplate className="h-5 w-5 text-primary" />
                        Schema Templates
                    </DialogTitle>
                    <DialogDescription>
                        Select a pre-defined template to quickly bootstrap your project schema.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto mt-4 pr-1">
                    {isLoading ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {[...Array(6)].map((_, i) => (
                                <Skeleton key={i} className="h-44 w-full rounded-xl" />
                            ))}
                        </div>
                    ) : isError ? (
                        <div className="text-center py-12">
                            <p className="text-sm text-muted-foreground">Failed to load templates. Please try again.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {templates?.map(tpl => (
                                <TemplateCard
                                    key={tpl.id}
                                    template={tpl}
                                    onApply={handleApply}
                                    isApplying={applyingSlug === tpl.slug && applyMutation.isPending}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}