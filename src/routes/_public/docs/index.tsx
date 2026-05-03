import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import {
  Rocket, Lock, Building2, Users, FolderOpen, Key, FileJson,
  Globe, LifeBuoy, ChevronRight, Search, X, Menu,
} from 'lucide-react';
import { DOC_SECTIONS, PAGE_CONTENT } from './docs-data';
import { DocPage } from './DocPage';
import { DocsHome } from './DocsHome';

export const Route = createFileRoute("/_public/docs/")({
  component: DocsRoute,
});

// ── Icon Map ──────────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Rocket, Lock, Building2, Users, FolderOpen, Key, FileJson, Globe, LifeBuoy,
};

// ── Search Modal ──────────────────────────────────────────────────────────────
function SearchModal({ onClose, onNavigate }: {
  onClose: () => void;
  onNavigate: (s: string, p: string) => void;
}) {
  const [query, setQuery] = useState('');

  const results = query.trim()
    ? DOC_SECTIONS.flatMap(section =>
        section.pages
          .filter(p =>
            p.title.toLowerCase().includes(query.toLowerCase()) ||
            PAGE_CONTENT[p.id]?.description?.toLowerCase().includes(query.toLowerCase())
          )
          .map(p => ({ page: p, section }))
      ).slice(0, 8)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search documentation..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        {results.length > 0 ? (
          <div className="max-h-80 overflow-y-auto py-2">
            {results.map(({ page, section }) => {
              const Icon = ICON_MAP[section.icon];
              return (
                <button
                  key={page.id}
                  onClick={() => { onNavigate(section.id, page.id); onClose(); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-muted transition-colors group"
                >
                  <div className="shrink-0 flex items-center justify-center h-8 w-8 rounded-md bg-muted group-hover:bg-accent">
                    {Icon && <Icon className="h-4 w-4 text-primary" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{page.title}</p>
                    <p className="text-xs text-muted-foreground">{section.title}</p>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                </button>
              );
            })}
          </div>
        ) : query ? (
          <div className="py-8 text-center text-sm text-muted-foreground">No results for "{query}"</div>
        ) : (
          <div className="py-6 text-center text-sm text-muted-foreground">Type to search all documentation</div>
        )}

        <div className="px-4 py-2 border-t border-border flex gap-4 text-xs text-muted-foreground">
          <span><kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">↵</kbd> select</span>
          <span><kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ activeSectionId, activePageId, onNavigate, onSearchOpen, onHome }: {
  activeSectionId: string | null;
  activePageId: string | null;
  onNavigate: (s: string, p: string) => void;
  onSearchOpen: () => void;
  onHome: () => void;
}) {
  const [expanded, setExpanded] = useState<Set<string>>(
    new Set(activeSectionId ? [activeSectionId] : ['getting-started'])
  );

  const toggle = (id: string) =>
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <aside className="flex flex-col h-full overflow-hidden">
      {/* Search */}
      <div className="px-3 py-4 border-b border-border shrink-0">
        <button
          onClick={onSearchOpen}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-accent text-sm text-muted-foreground transition-colors"
        >
          <Search className="h-3.5 w-3.5 shrink-0" />
          <span className="flex-1 text-left">Search docs...</span>
          <kbd className="hidden md:inline-flex px-1.5 py-0.5 bg-background border border-border rounded text-[10px]">⌘K</kbd>
        </button>
      </div>

      {/* Overview link */}
      <div className="px-3 pt-3 shrink-0">
        <button
          onClick={onHome}
          className={`w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors ${
            !activeSectionId
              ? 'text-primary font-medium bg-primary/8'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          Overview
        </button>
      </div>

      {/* Nav tree */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {DOC_SECTIONS.map(section => {
          const Icon = ICON_MAP[section.icon];
          const isExpanded = expanded.has(section.id);
          const isSectionActive = section.id === activeSectionId;

          return (
            <div key={section.id}>
              <button
                onClick={() => toggle(section.id)}
                className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm font-medium transition-colors group ${
                  isSectionActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {Icon && (
                  <Icon className={`h-4 w-4 shrink-0 ${isSectionActive ? `text-primary` : `text-muted-foreground group-hover:text-foreground`}`} />
                )}
                <span className="flex-1 text-left">{section.title}</span>
                <ChevronRight className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-150 ${isExpanded ? `rotate-90` : ``}`} />
              </button>

              {isExpanded && (
                <div className="ml-6 mt-0.5 mb-1 space-y-0.5 border-l border-border pl-3">
                  {section.pages.map(page => {
                    const isActive = page.id === activePageId;
                    return (
                      <button
                        key={page.id}
                        onClick={() => onNavigate(section.id, page.id)}
                        className={`w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors ${
                          isActive
                            ? 'text-primary font-medium bg-primary/8'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                      >
                        {page.title}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border shrink-0">
        <p className="text-xs text-muted-foreground">Mockify Docs · Phase 1</p>
      </div>
    </aside>
  );
}

// ── Route ─────────────────────────────────────────────────────────────────────
function DocsRoute() {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // CMD+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const navigate = (sectionId: string, pageId: string) => {
    setActiveSectionId(sectionId);
    setActivePageId(pageId);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const goHome = () => {
    setActiveSectionId(null);
    setActivePageId(null);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const activeSection = activeSectionId ? DOC_SECTIONS.find(s => s.id === activeSectionId) : null;
  const activePage = activePageId ? PAGE_CONTENT[activePageId] : null;

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className={`
          fixed top-16 left-0 bottom-0 z-40 w-64 bg-background border-r border-border
          transition-transform duration-200
          lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:flex-none lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <Sidebar
            activeSectionId={activeSectionId}
            activePageId={activePageId}
            onNavigate={navigate}
            onSearchOpen={() => { setSearchOpen(true); setSidebarOpen(false); }}
            onHome={goHome}
          />
        </div>

        {/* Content area */}
        <main className="flex-1 min-w-0 px-6 lg:px-10 py-8 max-w-full">
          {/* Mobile top bar */}
          <div className="flex items-center gap-3 mb-6 lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md hover:bg-muted text-muted-foreground transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-muted text-sm text-muted-foreground"
            >
              <Search className="h-3.5 w-3.5" />
              Search docs...
            </button>
          </div>

          {/* Breadcrumb (only on a page, not home) */}
          {activeSection && activePage && (
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
              <button onClick={goHome} className="hover:text-foreground transition-colors">Docs</button>
              <ChevronRight className="h-3 w-3" />
              <span>{activeSection.title}</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground font-medium">{activePage.title}</span>
            </nav>
          )}

          {/* Page body */}
          {activePage ? (
            <DocPage page={activePage} onNavigate={navigate} />
          ) : (
            <DocsHome onNavigate={navigate} />
          )}
        </main>
      </div>

      {/* Search modal */}
      {searchOpen && (
        <SearchModal
          onClose={() => setSearchOpen(false)}
          onNavigate={navigate}
        />
      )}
    </>
  );
}