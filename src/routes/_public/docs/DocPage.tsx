import { useEffect, useRef, useState } from 'react';
import { Check, Copy, Info, AlertTriangle, AlertCircle, Lightbulb, ArrowLeft, ArrowRight } from 'lucide-react';
import { type PageContent, type ContentBlock } from './docs-data';

// ── Copy Button ───────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-2 py-1 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

// ── Code Block ────────────────────────────────────────────────────────────────
function CodeBlock({ lang, code, label }: { lang: string; code: string; label?: string }) {
  // Simple syntax highlighting via CSS classes
  const lines = code.split('\n');

  return (
    <div className="rounded-xl overflow-hidden border border-border bg-[hsl(220_10%_8%)] text-sm font-mono shadow-sm my-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/8 bg-white/4">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
          </div>
          {label && <span className="text-xs text-white/40">{label}</span>}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/30 uppercase tracking-wider">{lang}</span>
          <CopyButton text={code} />
        </div>
      </div>

      {/* Code */}
      <div className="overflow-x-auto">
        <pre className="p-4 leading-relaxed text-[0.82rem]">
          <code>
            {lines.map((line, i) => (
              <div key={i} className="flex">
                <span className="select-none w-8 shrink-0 text-right mr-4 text-white/20 text-xs leading-relaxed">
                  {i + 1}
                </span>
                <span className="flex-1 text-white/85">{highlightLine(line, lang)}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

// Very lightweight syntax highlighting
function highlightLine(line: string, lang: string): React.ReactNode {
  if (lang === 'bash') {
    if (line.startsWith('#')) return <span className="text-white/40">{line}</span>;
    if (line.startsWith('curl ')) {
      return <><span className="text-blue-400">curl</span>{line.slice(4)}</>;
    }
  }
  if (lang === 'json') {
    return line.replace(/"([^"]+)":/g, (_, k) => `"${k}":`).split(/(\"[^\"]*\"|true|false|null|\d+\.?\d*)/).map((part, i) => {
      if (part.match(/^".*":?$/)) {
        if (part.endsWith(':')) return <span key={i} className="text-blue-300">{part}</span>;
        return <span key={i} className="text-green-300">{part}</span>;
      }
      if (part.match(/^(true|false|null)$/)) return <span key={i} className="text-purple-300">{part}</span>;
      if (part.match(/^\d/)) return <span key={i} className="text-orange-300">{part}</span>;
      return <span key={i}>{part}</span>;
    });
  }
  return line;
}

// ── Callout ───────────────────────────────────────────────────────────────────
const CALLOUT_STYLES = {
  info: {
    bg: 'bg-blue-500/8 border-blue-500/20',
    icon: Info,
    iconColor: 'text-blue-400',
    titleColor: 'text-blue-300',
  },
  warning: {
    bg: 'bg-yellow-500/8 border-yellow-500/20',
    icon: AlertTriangle,
    iconColor: 'text-yellow-400',
    titleColor: 'text-yellow-300',
  },
  danger: {
    bg: 'bg-destructive/8 border-destructive/20',
    icon: AlertCircle,
    iconColor: 'text-destructive',
    titleColor: 'text-red-300',
  },
  tip: {
    bg: 'bg-green-500/8 border-green-500/20',
    icon: Lightbulb,
    iconColor: 'text-green-400',
    titleColor: 'text-green-300',
  },
};

function Callout({ variant, title, text }: { variant: 'info' | 'warning' | 'danger' | 'tip'; title: string; text: string }) {
  const s = CALLOUT_STYLES[variant];
  const Icon = s.icon;
  return (
    <div className={`flex gap-3 p-4 rounded-xl border my-4 ${s.bg}`}>
      <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${s.iconColor}`} />
      <div className="min-w-0">
        <p className={`text-sm font-semibold mb-0.5 ${s.titleColor}`}>{title}</p>
        <p className="text-sm text-foreground/80 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

// ── Table ─────────────────────────────────────────────────────────────────────
function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="my-4 overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted border-b border-border">
            {headers.map(h => (
              <th key={h} className="px-4 py-2.5 text-left font-semibold text-foreground text-xs uppercase tracking-wide">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={`border-b border-border last:border-0 ${i % 2 === 0 ? '' : 'bg-muted/30'}`}>
              {row.map((cell, j) => (
                <td key={j} className={`px-4 py-2.5 text-foreground/80 ${j === 0 ? 'font-medium text-foreground' : ''}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Steps ─────────────────────────────────────────────────────────────────────
function Steps({ items }: { items: { title: string; text: string }[] }) {
  return (
    <div className="my-6 space-y-0">
      {items.map((item, i) => (
        <div key={i} className="flex gap-4 pb-6 last:pb-0 relative">
          {/* Line */}
          {i < items.length - 1 && (
            <div className="absolute left-4 top-9 bottom-0 w-px bg-border" />
          )}
          {/* Number */}
          <div className="shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-xs font-bold z-10">
            {i + 1}
          </div>
          {/* Content */}
          <div className="pt-1 min-w-0">
            <h4 className="text-sm font-semibold text-foreground mb-0.5">{item.title}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── On-Page TOC ───────────────────────────────────────────────────────────────
function OnPageTOC({ content }: { content: ContentBlock[] }) {
  const headings = content.filter(b => b.type === 'h2') as { type: 'h2'; text: string }[];
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActiveId(e.target.id); });
      },
      { rootMargin: '-20% 0% -60% 0%' }
    );
    headings.forEach(h => {
      const el = document.getElementById(slugify(h.text));
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [content]);

  if (headings.length < 2) return null;

  return (
    <aside className="hidden xl:block w-56 shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto py-8 pr-4">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">On this page</p>
      <nav className="space-y-1">
        {headings.map(h => {
          const id = slugify(h.text);
          const isActive = activeId === id;
          return (
            <a
              key={id}
              href={`#${id}`}
              className={`block text-xs py-1 px-2 rounded transition-colors ${
                isActive
                  ? 'text-primary font-medium bg-primary/8'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {h.text}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ── Main DocPage ──────────────────────────────────────────────────────────────
export function DocPage({ page, onNavigate }: {
  page: PageContent;
  onNavigate: (sectionId: string, pageId: string) => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [page.id]);

  return (
    <div className="flex gap-8">
      {/* Main content */}
      <article className="flex-1 min-w-0" ref={contentRef}>
        {/* Page header */}
        <div className="mb-8 pb-8 border-b border-border">
          <h1 className="text-3xl font-bold text-foreground mb-2">{page.title}</h1>
          {page.description && (
            <p className="text-lg text-muted-foreground leading-relaxed">{page.description}</p>
          )}
        </div>

        {/* Content blocks */}
        <div className="prose-docs space-y-0">
          {page.content.map((block, i) => {
            switch (block.type) {
              case 'h2':
                return (
                  <h2
                    key={i}
                    id={slugify(block.text)}
                    className="text-xl font-bold text-foreground mt-10 mb-4 scroll-mt-20"
                  >
                    {block.text}
                  </h2>
                );
              case 'h3':
                return (
                  <h3 key={i} className="text-lg font-semibold text-foreground mt-6 mb-3">
                    {block.text}
                  </h3>
                );
              case 'p':
                return (
                  <p key={i} className="text-foreground/85 leading-relaxed mb-4 text-[0.95rem]">
                    {block.text}
                  </p>
                );
              case 'callout':
                return <Callout key={i} {...block} />;
              case 'code':
                return <CodeBlock key={i} lang={block.lang} code={block.code} label={block.label} />;
              case 'steps':
                return <Steps key={i} items={block.items} />;
              case 'table':
                return <Table key={i} headers={block.headers} rows={block.rows} />;
              case 'divider':
                return <hr key={i} className="my-8 border-border" />;
              default:
                return null;
            }
          })}
        </div>

        {/* Prev / Next navigation */}
        <div className="mt-12 pt-8 border-t border-border flex gap-4">
          {page.prev ? (
            <button
              onClick={() => onNavigate(page.prev!.sectionId, page.prev!.id)}
              className="flex-1 flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-muted transition-colors group text-left"
            >
              <ArrowLeft className="h-4 w-4 text-muted-foreground group-hover:text-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Previous</p>
                <p className="text-sm font-medium text-foreground">{page.prev.title}</p>
              </div>
            </button>
          ) : <div className="flex-1" />}

          {page.next ? (
            <button
              onClick={() => onNavigate(page.next!.sectionId, page.next!.id)}
              className="flex-1 flex items-center justify-end gap-3 p-4 rounded-xl border border-border hover:bg-muted transition-colors group text-right"
            >
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Next</p>
                <p className="text-sm font-medium text-foreground">{page.next.title}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground shrink-0" />
            </button>
          ) : <div className="flex-1" />}
        </div>
      </article>

      {/* On-page TOC */}
      <OnPageTOC content={page.content} />
    </div>
  );
}