import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Shield,
  EyeOff,
  FileText,
  Monitor,
  Snowflake,
  Database,
  Check,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

/* ✅ Layout wrapper (Option 1) */
import { LayoutContainer } from '@/components/layout/LayoutContainer';

export const Route = createFileRoute('/_public/')({
  component: IndexPage,
});

function IndexPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col">
      {/* ================= HERO ================= */}
      <section className="py-32 text-center">
        <LayoutContainer>
          <div className="flex flex-col items-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
                Mock Data Generation <br />
                <span className="text-primary">Made Simple</span>
              </h1>

              <p className="mx-auto max-w-[720px] text-lg text-muted-foreground">
                Create schemas, generate mock data, and access it via RESTful APIs.
                Perfect for development and testing.
              </p>
            </div>

            {!isAuthenticated && (
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button size="lg" asChild>
                  <Link to="/register">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <Button size="lg" variant="outline" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
            )}
          </div>
        </LayoutContainer>
      </section>

      {/* ================= CODE PREVIEW ================= */}
      <section className="py-32">
        <LayoutContainer>
          <div className="flex justify-center">
            <div className="w-full max-w-3xl rounded-xl border border-border bg-card shadow-xl overflow-hidden font-mono text-sm">
              <div className="relative flex items-center justify-center px-4 py-3 border-b border-border bg-muted">
                <div className="absolute left-4 flex gap-2">
                  <span className="h-3 w-3 rounded-full bg-destructive" />
                  <span className="h-3 w-3 rounded-full bg-secondary" />
                  <span className="h-3 w-3 rounded-full bg-primary" />
                </div>

                <div className="rounded-md bg-background px-4 py-1 text-xs text-muted-foreground">
                  github.com/acme/mockify.yml
                </div>
              </div>

              <pre className="p-6 text-foreground overflow-x-auto">
                <code className="block space-y-1">
                  <span className="text-muted-foreground"># Mockify config</span>
                  {'\n'}
                  <span className="text-primary">organization:</span>
                  {'\n'}
                  <span className="pl-4 text-primary">project:</span>
                  {'\n'}
                  <span className="pl-8 text-primary">schema:</span>
                  {'\n'}
                  <span className="pl-12 text-primary">record:</span>{' '}
                  <span className="text-foreground">50</span>
                </code>
              </pre>
            </div>
          </div>
        </LayoutContainer>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-32">
        <LayoutContainer>
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex flex-col items-center text-center space-y-4"
              >
                <div className="rounded-2xl bg-muted p-4 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </LayoutContainer>
      </section>

      {/* ================= PRICING ================= */}
      <section className="py-32">
        <LayoutContainer>
          <div className="grid gap-8 md:grid-cols-3">
            <PricingCard
              title="Pro"
              price="$29"
              description="For freelancers & indie hackers"
            />
            <PricingCard
              featured
              title="Business"
              price="$99"
              description="Perfect for teams & companies"
            />
            <PricingCard
              title="Enterprise"
              price="Custom"
              description="Need your own instance?"
            />
          </div>
        </LayoutContainer>
      </section>
    </div>
  );
}

/* ================= PRICING CARD ================= */

function PricingCard({
  title,
  price,
  description,
  featured = false,
}: {
  title: string;
  price: string;
  description: string;
  featured?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-border p-8 space-y-6 ${
        featured
          ? 'bg-primary text-primary-foreground scale-105'
          : 'bg-card text-card-foreground'
      }`}
    >
      <div>
        <h3 className="text-4xl font-bold">{price}</h3>
        <p className="text-xl font-medium">{title}</p>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <Button variant={featured ? 'secondary' : 'outline'} className="w-full">
        Get started
      </Button>

      <ul className="space-y-3 text-sm">
        {['Unlimited servers', 'Complete features', 'Email support'].map(
          (item) => (
            <li key={item} className="flex items-center gap-2">
              <Check className="h-4 w-4 opacity-70" />
              {item}
            </li>
          )
        )}
      </ul>
    </div>
  );
}

/* ================= FEATURES DATA ================= */

const FEATURES = [
  {
    icon: Shield,
    title: 'Protect your data',
    desc: 'Keep your APIs private and secure.',
  },
  {
    icon: EyeOff,
    title: 'No supply-chain risks',
    desc: 'We never access your source code.',
  },
  {
    icon: FileText,
    title: 'Interactive docs',
    desc: 'Auto-generated API documentation.',
  },
  {
    icon: Monitor,
    title: 'Clean environment',
    desc: 'No local installs or clutter.',
  },
  {
    icon: Snowflake,
    title: 'Immutable data',
    desc: 'Your base data stays safe.',
  },
  {
    icon: Database,
    title: 'Persistent storage',
    desc: 'Optional data persistence.',
  },
];
