import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_public')({
  component: PublicLayout,
});

function PublicLayout() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
