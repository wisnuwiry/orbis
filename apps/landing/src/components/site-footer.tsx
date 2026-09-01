import { webAppUrl } from "~/downloads";

export function SiteFooter() {
  return (
    <footer className="w-full max-w-7xl px-6 md:px-32 pb-16 mx-auto">
      <div className="border-t border-white/10 pt-10 pb-4 grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm">
        <div className="space-y-3">
          <p className="text-white/70 font-medium text-xs uppercase tracking-wider">Docs</p>
          <div className="space-y-2">
            <a
              href="/docs"
              className="block text-muted-foreground hover:text-foreground transition-colors"
            >
              Overview
            </a>
            <a
              href="/docs/cli"
              className="block text-muted-foreground hover:text-foreground transition-colors"
            >
              CLI Reference
            </a>
            <a
              href="/docs/worktrees"
              className="block text-muted-foreground hover:text-foreground transition-colors"
            >
              Worktrees
            </a>
            <a
              href="/docs/configuration"
              className="block text-muted-foreground hover:text-foreground transition-colors"
            >
              Configuration
            </a>
            <a
              href="/docs/connectivity"
              className="block text-muted-foreground hover:text-foreground transition-colors"
            >
              Connectivity
            </a>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-white/70 font-medium text-xs uppercase tracking-wider">Agents</p>
          <div className="space-y-2">
            <a
              href="/claude-code"
              className="block text-muted-foreground hover:text-foreground transition-colors"
            >
              Claude Code
            </a>
            <a
              href="/codex"
              className="block text-muted-foreground hover:text-foreground transition-colors"
            >
              Codex
            </a>
            <a
              href="/opencode"
              className="block text-muted-foreground hover:text-foreground transition-colors"
            >
              OpenCode
            </a>
            <a
              href="/pi"
              className="block text-muted-foreground hover:text-foreground transition-colors"
            >
              Pi
            </a>
            <a
              href="/agents"
              className="block text-muted-foreground hover:text-foreground transition-colors"
            >
              All Providers
            </a>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-white/70 font-medium text-xs uppercase tracking-wider">Community</p>
          <div className="space-y-2">
            <a
              href="https://github.com/wisnusaputra/padu"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://github.com/wisnusaputra/padu/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-muted-foreground hover:text-foreground transition-colors"
            >
              Releases
            </a>
            <a
              href="https://github.com/wisnusaputra/padu/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-muted-foreground hover:text-foreground transition-colors"
            >
              Discussions
            </a>
            <a
              href="https://github.com/wisnusaputra/padu/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-muted-foreground hover:text-foreground transition-colors"
            >
              Issues
            </a>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-white/70 font-medium text-xs uppercase tracking-wider">Product</p>
          <div className="space-y-2">
            <a
              href="/download"
              className="block text-muted-foreground hover:text-foreground transition-colors"
            >
              Desktop App
            </a>
            <a
              href={webAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-muted-foreground hover:text-foreground transition-colors"
            >
              Web App
            </a>
            <a
              href="/changelog"
              className="block text-muted-foreground hover:text-foreground transition-colors"
            >
              Changelog
            </a>
            <a
              href="/privacy"
              className="block text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </a>
            <a
              href="/terms"
              className="block text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <img src="/padu.svg" alt="Padu" className="w-4 h-4 opacity-75" />
          <span>Padu · Native control plane for AI coding agents</span>
        </div>
        <p>© 2026 Padu. Free & open source under GPL-3.0.</p>
      </div>
    </footer>
  );
}
