import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { DocsBreadcrumbs } from "~/components/docs-breadcrumbs";
import { DocsNav } from "~/components/docs-nav";
import { DocsOutline } from "~/components/docs-outline";
import { buildDocsNavTree, getDoc, getDocs } from "~/docs";
import "~/styles.css";

export const Route = createFileRoute("/docs")({
  component: DocsLayout,
});

function DocsLayout() {
  const location = useLocation();
  const tree = useMemo(() => buildDocsNavTree(getDocs()), []);

  const slug = location.pathname === "/docs" ? "" : location.pathname.slice("/docs/".length);
  const doc = getDoc(slug);

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const toggleMobileNav = useCallback(() => setMobileNavOpen((v) => !v), []);
  const closeMobileNav = useCallback(() => setMobileNavOpen(false), []);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header */}
      <header className="lg:hidden sticky top-0 z-50 bg-background border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Link to="/" className="flex items-center gap-3">
            <img src="/padu.svg" alt="Padu" className="w-6 h-6" />
            <span className="text-lg font-medium">Padu</span>
          </Link>
          <button
            type="button"
            onClick={toggleMobileNav}
            aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileNavOpen}
            className="-mr-2 p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {mobileNavOpen && (
          <nav className="border-t border-border px-4 py-4 max-h-[calc(100dvh-4rem)] overflow-y-auto">
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pb-4 mb-4 border-b border-border">
              <Link to="/docs" onClick={closeMobileNav} className="text-white font-medium">Docs</Link>
              <Link to="/agents" onClick={closeMobileNav} className="hover:text-foreground transition-colors">Agents</Link>
              <Link to="/changelog" onClick={closeMobileNav} className="hover:text-foreground transition-colors">Changelog</Link>
              <Link to="/download" onClick={closeMobileNav} className="hover:text-foreground transition-colors">Download</Link>
              <a href="https://github.com/wisnuwiry/padu" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
            </div>
            <DocsNav nodes={tree} mobile onNavigate={closeMobileNav} />
          </nav>
        )}
      </header>

      <div className="max-w-[90rem] mx-auto flex items-start">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block sticky top-0 h-screen w-60 shrink-0 border-r border-border p-6 overflow-y-auto">
          <Link to="/" className="flex items-center gap-3 mb-6 group">
            <img src="/padu.svg" alt="Padu" className="w-6 h-6 transition-transform group-hover:scale-105" />
            <span className="text-lg font-medium tracking-tight text-white">Padu</span>
          </Link>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-6 pb-4 border-b border-border">
            <Link to="/agents" className="hover:text-foreground transition-colors">Agents</Link>
            <Link to="/changelog" className="hover:text-foreground transition-colors">Changelog</Link>
            <Link to="/download" className="hover:text-foreground transition-colors">Download</Link>
          </div>
          <DocsNav nodes={tree} />
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 px-6 md:px-12 py-8 md:py-12">
          <div className="max-w-prose mx-auto">
            {doc && <DocsBreadcrumbs doc={doc} tree={tree} />}
            <Outlet />
          </div>
        </main>

        {/* Right outline */}
        <aside className="hidden xl:block sticky top-0 h-screen w-60 shrink-0 px-2 overflow-y-auto">
          {doc && <DocsOutline headings={doc.headings} />}
        </aside>
      </div>
    </div>
  );
}
