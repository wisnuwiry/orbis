import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, PaduLegalIdentity } from "~/components/legal-page";
import { pageMeta } from "~/meta";

export const Route = createFileRoute("/privacy")({
  head: () =>
    pageMeta(
      "Privacy Policy - Padu",
      "What stays on your machines and what the optional encrypted relay processes.",
      "/privacy",
    ),
  component: Privacy,
});

function Privacy() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="August 29, 2026">
      <p>
        Padu is local-first. Installing or using the open-source software does not send us your
        code, prompts, files, terminal output, or agent conversations. This policy explains the
        separate data boundaries for local Padu, the optional official relay, and padu.dev.
      </p>

      <section>
        <h2>Who is responsible</h2>
        <PaduLegalIdentity />
        <p>
          The Padu Project maintainers are the data controllers for personal data processed through
          the official website. Independently self-hosted daemons and clients are controlled by
          their operators and are not covered by this policy.
        </p>
      </section>

      <section>
        <h2>Local Padu apps and daemons</h2>
        <p>
          Padu runs directly on your computer. It does not send us analytics, telemetry,
          advertising identifiers, or crash reports.
        </p>
        <p>
          Packaged desktop apps check GitHub Releases for update availability. GitHub receives the
          standard network information needed to serve that request under its own privacy policy.
        </p>
        <p>
          Agents such as Claude Code, Codex, and OpenCode communicate with their providers using
          credentials stored locally on your machine. Padu does not intercept or transmit those
          provider API keys.
        </p>
      </section>

      <section>
        <h2>The optional official relay</h2>
        <p>
          The relay is optional. To route connections between your client and daemon across the
          internet without opening ports, it processes:
        </p>
        <ul>
          <li>IP addresses and connection timing</li>
          <li>Session identifiers and public handshake keys</li>
          <li>Message sizes and aggregate bandwidth</li>
          <li>Temporary connection and routing state</li>
        </ul>
        <p>
          Your client and daemon encrypt application traffic end-to-end with NaCl box encryption.
          The relay carries ciphertext only and cannot read your code, prompts, terminal output, or
          agent conversations. Payloads exist in relay memory only while being forwarded; we do not
          store message contents.
        </p>
      </section>

      <section>
        <h2>Cookies and tracking</h2>
        <p>
          The marketing website does not use tracking, analytics, or advertising cookies.
        </p>
      </section>

      <section>
        <h2>Your rights</h2>
        <p>
          Depending on applicable law, you may request access, correction, or deletion of any
          personal data held by the official services. Email{" "}
          <a href="mailto:support@padu.dev">support@padu.dev</a>.
        </p>
      </section>

      <section>
        <h2>Security</h2>
        <p>
          We employ access controls, encrypted transport, and least-privilege service configurations.
          Read Padu&apos;s{" "}
          <a
            href="https://github.com/wisnuwiry/padu/blob/main/SECURITY.md"
            target="_blank"
            rel="noopener noreferrer"
          >
            security model
          </a>{" "}
          or report a security concern to{" "}
          <a href="mailto:support@padu.dev">support@padu.dev</a>.
        </p>
      </section>

      <section>
        <h2>Changes</h2>
        <p>
          We will update this page and its date when our open-source services or data practices
          materially change.
        </p>
      </section>
    </LegalPage>
  );
}
