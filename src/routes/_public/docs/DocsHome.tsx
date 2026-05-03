import {
  Rocket, Lock, Building2, Users, FolderOpen, Key, FileJson,
  Globe, LifeBuoy, ArrowRight, Zap,
} from 'lucide-react';
import { DOC_SECTIONS } from './docs-data';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Rocket, Lock, Building2, Users, FolderOpen, Key, FileJson, Globe, LifeBuoy,
};

const SECTION_DESCRIPTIONS: Record<string, string> = {
  'getting-started': 'New to Mockify? Start here. Set up your account and get your first endpoint live.',
  'authentication': 'Account creation, login flows, session management, and password recovery.',
  'organizations': 'Create and configure organizations as your top-level workspace.',
  'team-collaboration': 'Invite developers, assign roles, and manage permissions across your team.',
  'projects': 'Organize schemas and mock data into logical project workspaces.',
  'api-keys': 'Generate, scope, and secure API keys for endpoint access.',
  'schemas': 'Define the shape of your mock data with Mockify\'s schema builder.',
  'mock-endpoints': 'Access, paginate, and test your mock REST endpoints.',
  'troubleshooting': 'Diagnose and fix the most common Mockify issues.',
};

export function DocsHome({ onNavigate }: {
  onNavigate: (sectionId: string, pageId: string) => void;
}) {
  return (
    <div className="max-w-4xl">
      {/* Hero */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6">
          <Zap className="h-3 w-3" />
          Phase 1 Documentation
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Mockify Documentation
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
          Everything you need to build frontend applications with Mockify — from your first
          mock endpoint to managing teams and securing API access.
        </p>
      </div>

      {/* Quickstart CTA */}
      <div className="mb-10 p-6 rounded-2xl bg-primary/6 border border-primary/20">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-1">New to Mockify?</h2>
            <p className="text-sm text-muted-foreground">
              Follow our 5-minute quickstart guide to get your first mock endpoint running.
            </p>
          </div>
          <button
            onClick={() => onNavigate('getting-started', 'quickstart')}
            className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Quickstart <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Section cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {DOC_SECTIONS.map(section => {
          const Icon = ICON_MAP[section.icon];
          const firstPage = section.pages[0];
          return (
            <button
              key={section.id}
              onClick={() => onNavigate(section.id, firstPage.id)}
              className="group flex flex-col items-start gap-3 p-5 rounded-xl border border-border bg-card hover:bg-muted hover:border-primary/30 transition-all text-left"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {Icon && <Icon className="h-4 w-4" />}
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1 text-sm">{section.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {SECTION_DESCRIPTIONS[section.id]}
                </p>
              </div>
              <div className="mt-auto">
                <p className="text-xs text-muted-foreground">
                  {section.pages.length} {section.pages.length === 1 ? 'article' : 'articles'}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Support footer */}
      <div className="mt-12 pt-8 border-t border-border flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Can't find what you're looking for?
        </p>
        <a
          href="mailto:support@mockify.dev"
          className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
        >
          Contact support →
        </a>
      </div>
    </div>
  );
}