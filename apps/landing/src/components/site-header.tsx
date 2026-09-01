import { Link, useRouterState } from "@tanstack/react-router";
import "~/styles.css";
import { GitHubIcon } from "~/components/brand-icons";
import { useStars } from "~/routes/__root";

export function SiteHeader() {
  const { stars } = useStars();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between py-1">
      <Link to="/" className="flex items-center gap-2.5 group">
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white/[0.06] border border-white/10 group-hover:border-white/20 transition-all shadow-sm">
          <img
            src="/padu.svg"
            alt="Padu"
            className="w-4.5 h-4.5 transition-transform duration-200 group-hover:scale-110"
          />
        </div>
        <span className="text-base font-semibold tracking-tight text-white">Padu</span>
      </Link>
      <nav
        aria-label="Main Navigation"
        className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 bg-white/[0.03] p-1.5 rounded-full border border-white/[0.08] backdrop-blur-xl shadow-lg shadow-black/20"
      >
        <Link
          to="/docs"
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
            pathname.startsWith("/docs")
              ? "bg-white/10 text-white shadow-sm"
              : "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
          }`}
        >
          Docs
        </Link>
        <Link
          to="/agents"
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
            pathname === "/agents"
              ? "bg-white/10 text-white shadow-sm"
              : "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
          }`}
        >
          Agents
        </Link>
        <Link
          to="/changelog"
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
            pathname === "/changelog"
              ? "bg-white/10 text-white shadow-sm"
              : "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
          }`}
        >
          Changelog
        </Link>
        <a
          href="https://github.com/wisnuwiry/padu"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={stars ? `GitHub, ${stars} stars` : "GitHub"}
          className="px-3 py-1.5 rounded-full text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-all inline-flex items-center gap-1.5"
        >
          <GitHubIcon width="14" height="14" />
          {stars && <span className="tabular-nums text-[11px] font-mono opacity-80">{stars}</span>}
        </a>
        <Link
          to="/download"
          className={`ml-1 inline-flex items-center justify-center rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
            pathname === "/download"
              ? "bg-white text-black font-semibold shadow-[0_0_12px_rgba(255,255,255,0.25)]"
              : "bg-white text-black font-semibold hover:bg-white/90 active:scale-95 shadow-[0_0_12px_rgba(255,255,255,0.15)]"
          }`}
        >
          Download
        </Link>
      </nav>
    </header>
  );
}
