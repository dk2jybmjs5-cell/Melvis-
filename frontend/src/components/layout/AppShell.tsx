import { Link, Outlet } from "react-router-dom";

export function AppShell() {
  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:m-3 focus:bg-surface focus:px-3 focus:py-2">
        Skip to content
      </a>
      <header className="border-b border-line">
        <nav aria-label="Main" className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link to="/" className="font-display text-xl font-semibold tracking-tight">MELVIS</Link>
          <Link to="/help" className="text-sm text-muted hover:text-ink underline-offset-4 hover:underline">
            Need urgent help?
          </Link>
        </nav>
      </header>
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-line">
        <p className="mx-auto max-w-5xl px-5 py-6 text-sm text-muted">
          MELVIS offers wellness information and support. It is not a therapist, cannot diagnose, and is not an emergency service.
        </p>
      </footer>
    </div>
  );
}
