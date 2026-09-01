import type { ReactNode } from "react";
import { SiteFooter } from "~/components/site-footer";
import { SiteHeader } from "~/components/site-header";

interface SiteShellProps {
  children: ReactNode;
  width?: "default" | "prose";
}

export function SiteShell({ children, width = "default" }: SiteShellProps) {
  const contentWidthClasses =
    width === "prose" ? "max-w-prose mx-auto" : "w-full";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Header - exactly identical to Home page in padding and width */}
      <div className="w-full max-w-7xl px-6 pt-4 md:px-32 md:pt-6 mx-auto">
        <nav className="mb-16 md:mb-20">
          <SiteHeader />
        </nav>
      </div>

      {/* Main Page Content */}
      <main className="flex-1 w-full max-w-7xl px-6 md:px-32 pb-16 md:pb-24 mx-auto">
        <div className={contentWidthClasses}>{children}</div>
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}

