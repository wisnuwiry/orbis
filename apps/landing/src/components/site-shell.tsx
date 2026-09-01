import type { ReactNode } from "react";
import { SiteFooter } from "~/components/site-footer";
import { SiteHeader } from "~/components/site-header";

interface SiteShellProps {
  children: ReactNode;
  width?: "default" | "prose";
}

export function SiteShell({ children, width = "default" }: SiteShellProps) {
  const contentWidthClasses =
    width === "prose" ? "max-w-prose mx-auto" : "max-w-5xl mx-auto";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Header - exactly identical to Home page container */}
      <div className="w-full max-w-5xl p-6 md:p-20 pb-0 md:pb-0 mx-auto">
        <div className="mb-16 md:mb-20">
          <SiteHeader />
        </div>
      </div>

      {/* Main Page Content */}
      <main className={`flex-1 w-full px-6 md:px-20 pb-16 md:pb-24 ${contentWidthClasses}`}>
        {children}
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}

