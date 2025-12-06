import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ArrowRight, Database, Zap, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const Route = createFileRoute('/_public/')({
  component: IndexPage,
});

function IndexPage() {

  const { isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="container flex flex-col items-center justify-center space-y-8 py-24 text-center md:py-32">
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Mock Data Generation
            <br />
            <span className="text-primary">Made Simple</span>
          </h1>
          <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
            Create schemas, generate mock data, and access it via RESTful API.
            Perfect for development and testing.
          </p>
        </div>
        {/* Only show when user is NOT logged in */}
        {!isAuthenticated && (
        <div className="flex flex-col gap-4 sm:flex-row">
            <Link to="/register">
              <Button size="lg" className="gap-2 cursor-pointer">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" className="cursor-pointer" variant="outline">
                Sign In
              </Button>
            </Link>
        </div>
        )}
      </section>

      {/* Features */}
      <section className="border-t py-24 px-12">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-2">
              <Database className="h-10 w-10 text-primary" />
              <h3 className="text-xl font-bold">Flexible Schemas</h3>
              <p className="text-muted-foreground">
                Define your data structure with validation rules and
                constraints.
              </p>
            </div>
            <div className="space-y-2">
              <Zap className="h-10 w-10 text-primary" />
              <h3 className="text-xl font-bold">Instant API</h3>
              <p className="text-muted-foreground">
                Get a RESTful API endpoint immediately after creating your
                schema.
              </p>
            </div>
            <div className="space-y-2">
              <Shield className="h-10 w-10 text-primary" />
              <h3 className="text-xl font-bold">Secure & Reliable</h3>
              <p className="text-muted-foreground"></p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
