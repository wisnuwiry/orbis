import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, PaduLegalIdentity } from "~/components/legal-page";
import { pageMeta } from "~/meta";

export const Route = createFileRoute("/privacy")({
  head: () =>
    pageMeta(
      "Privacy Policy - Padu",
      "Padu is 100% local-first and open source. Your code, prompts, credentials, and transcripts never leave your hardware.",
      "/privacy",
    ),
  component: Privacy,
});

function Privacy() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="September 1, 2026">
      <p>
        Padu is designed from the ground up as a <strong>100% local-first</strong> developer workspace.
        Installing and running the Padu desktop application, background daemon, web client, or mobile companion
        does not transmit your source code, prompts, file contents, terminal output, or agent transcripts
        to our servers. We do not operate data harvesting pipelines, analytics trackers, or telemetry beacons.
      </p>

      <section>
        <h2>1. Who We Are</h2>
        <PaduLegalIdentity />
        <p>
          Padu is an open-source software project licensed under the GNU General Public License v3.0 (GPL-3.0).
          This privacy policy describes how data is handled across the Padu native software, the marketing website
          (padu.dev), and self-hosted instances.
        </p>
      </section>

      <section>
        <h2>2. Local Application and Daemon Architecture</h2>
        <p>
          Padu runs directly on your computer hardware. All session management, Git worktree isolation,
          checkpoint tracking, and process supervision are handled locally by the background daemon (<code>padu daemon</code>)
          communicating over loopback sockets (<code>127.0.0.1:4789</code>).
        </p>
        <ul>
          <li><strong>Zero Telemetry:</strong> Padu contains no analytics SDKs, telemetry beacons, user tracking, or advertising identifiers.</li>
          <li><strong>Zero Remote File Storage:</strong> Your projects, files, and Git branches reside exclusively on your local filesystem.</li>
          <li><strong>Zero Conversation Logging:</strong> Transcripts and checkpoints are saved in your local workspace directory (<code>.padu/</code>) and local application data folders.</li>
          <li><strong>No Crash Telemetry:</strong> Crash logs remain on your device. Crash reports are only shared if you manually choose to submit a diagnostic log via a public GitHub issue.</li>
        </ul>
      </section>

      <section>
        <h2>3. Agent Credentials and API Keys</h2>
        <p>
          Padu connects to AI coding agents (including Claude Code, OpenAI Codex, OpenCode, Pi Agent, Amp, DeepSeek,
          Cursor CLI, and ACP-compatible drivers) installed on your system.
        </p>
        <p>
          API tokens and provider credentials remain in your operating system&apos;s native keychain (macOS Keychain,
          Linux Secret Service, Windows Credential Manager) or your local environment files. Padu never proxies, intercepts,
          collects, or transmits your API keys to any external servers.
        </p>
      </section>

      <section>
        <h2>4. Direct Communication with AI Model Providers</h2>
        <p>
          When you prompt an agent, the subprocess executing on your computer communicates directly with the respective
          AI provider&apos;s endpoints (for example, <code>api.anthropic.com</code> or <code>api.openai.com</code>) using
          your own API keys or CLI authentication tokens.
        </p>
        <p>
          Your interactions with AI providers are governed strictly by your agreement and privacy terms with each
          individual provider. Padu does not act as an API middleman, does not proxy tokens, and cannot inspect or store
          the data exchanged between your local agent process and the provider.
        </p>
      </section>

      <section>
        <h2>5. Remote Daemon Connectivity (Web &amp; Mobile)</h2>
        <p>
          Padu supports connecting remote clients (the Progressive Web App at <code>app.padu.dev</code> or companion mobile apps)
          to your devbox daemon.
        </p>
        <p>
          These connections are established <strong>peer-to-peer or directly</strong> across your own private network infrastructure
          (such as Tailscale, WireGuard, local Wi-Fi, or an SSH tunnel). Padu does not route your unencrypted workspace traffic
          through proprietary centralized relay clouds.
        </p>
      </section>

      <section>
        <h2>6. Marketing Website and Update Checks</h2>
        <p>
          <strong>padu.dev Website:</strong> The static marketing website is hosted via global CDN networks. Standard transient
          HTTP server logs (such as IP address and user-agent) may be processed temporarily for DDoS mitigation and infrastructure security.
          We do not use tracking, advertising, or third-party profiling cookies.
        </p>
        <p>
          <strong>Software Update Checks:</strong> Packaged desktop releases check the public GitHub Releases API for new version
          availability. GitHub receives standard network requests according to its own privacy policy.
        </p>
      </section>

      <section>
        <h2>7. Security &amp; Vulnerability Disclosure</h2>
        <p>
          We take software security seriously. If you discover a potential security vulnerability in Padu, please review our{" "}
          <a
            href="https://github.com/wisnuwiry/padu/blob/main/SECURITY.md"
            target="_blank"
            rel="noopener noreferrer"
          >
            Security Policy
          </a>{" "}
          or report it confidentially to{" "}
          <a href="mailto:support@padu.dev">support@padu.dev</a>.
        </p>
      </section>

      <section>
        <h2>8. Contact &amp; Inquiries</h2>
        <p>
          If you have questions about this Privacy Policy or Padu&apos;s data practices, please contact us at{" "}
          <a href="mailto:support@padu.dev">support@padu.dev</a> or open a discussion on our{" "}
          <a
            href="https://github.com/wisnuwiry/padu/discussions"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub repository
          </a>.
        </p>
      </section>
    </LegalPage>
  );
}
