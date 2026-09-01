import { Link, useRouterState } from "@tanstack/react-router";
import "~/styles.css";
import { GitHubIcon } from "~/components/brand-icons";
import { useStars } from "~/routes/__root";

export function SiteHeader() {
  const { stars } = useStars();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
      <Link to="/" className="flex items-center gap-3 group">
        <img
          src="/padu.svg"
          alt="Padu"
          className="w-6 h-6 transition-transform group-hover:scale-105"
        />
        <span className="text-lg font-medium tracking-tight text-white">Padu</span>
      </Link>
      <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6">
        <Link
          to="/docs"
          className={`text-sm transition-colors ${
            pathname.startsWith("/docs")
              ? "text-white font-medium"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Docs
        </Link>
        <Link
          to="/agents"
          className={`text-sm transition-colors ${
            pathname === "/agents"
              ? "text-white font-medium"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Agents
        </Link>
        <Link
          to="/changelog"
          className={`text-sm transition-colors ${
            pathname === "/changelog"
              ? "text-white font-medium"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Changelog
        </Link>
        <a
          href="https://github.com/wisnuwiry/padu"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={stars ? `GitHub, ${stars} stars` : "GitHub"}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
        >
          <GitHubIcon width="16" height="16" />
          {stars && <span className="tabular-nums text-xs font-mono">{stars}</span>}
        </a>
        <Link
          to="/download"
          className={`inline-flex items-center justify-center rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
            pathname === "/download"
              ? "bg-white text-black font-medium"
              : "bg-white/10 hover:bg-white/15 border border-white/15 text-white"
          }`}
        >
          Download
        </Link>
      </div>
    </header>
  );
}


