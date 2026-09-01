import "~/styles.css";
import { GitHubIcon } from "~/components/brand-icons";
import { useStars } from "~/routes/__root";

export function SiteHeader() {
  const { stars } = useStars();
  return (
    <header className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
      <a href="/" className="flex items-center gap-3 group">
        <img src="/padu.svg" alt="Padu" className="w-6 h-6 transition-transform group-hover:scale-105" />
        <span className="text-lg font-medium tracking-tight">Padu</span>
      </a>
      <div className="flex flex-wrap items-center justify-center gap-5">
        <a
          href="/docs"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Docs
        </a>
        <a
          href="/agents"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Agents
        </a>
        <a
          href="/changelog"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Changelog
        </a>
        <a
          href="https://github.com/wisnuwiry/padu"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={stars ? `GitHub, ${stars} stars` : "GitHub"}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
        >
          <GitHubIcon width="16" height="16" />
          {stars && <span className="tabular-nums text-xs">{stars}</span>}
        </a>
        <a
          href="/download"
          className="inline-flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 px-3.5 py-1.5 text-xs font-medium text-white transition-colors"
        >
          Download
        </a>
      </div>
    </header>
  );
}

