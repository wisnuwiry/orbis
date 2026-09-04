import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, PaduLegalIdentity } from "~/components/legal-page";
import { pageMeta } from "~/meta";

export const Route = createFileRoute("/terms")({
  head: () =>
    pageMeta(
      "Terms of Service - Padu",
      "Terms governing the use of Padu open-source software, documentation, and official websites.",
      "/terms",
    ),
  component: Terms,
});

function Terms() {
  return (
    <LegalPage title="Terms of Service" lastUpdated="September 1, 2026">
      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) apply to your use of the Padu open-source project,
        the official website at <strong>padu.dev</strong>, downloadable binaries, and associated documentation.
        For details on how data is handled, please review our <a href="/privacy">Privacy Policy</a>.
      </p>

      <section>
        <h2>1. Who We Are</h2>
        <PaduLegalIdentity />
      </section>

      <section>
        <h2>2. Open Source License (GPL-3.0)</h2>
        <p>
          Padu is free and open-source software licensed under the <strong>GNU General Public License v3.0 (GPL-3.0)</strong>.
          The complete source code is publicly accessible on{" "}
          <a
            href="https://github.com/wisnuwiry/padu"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>.
        </p>
        <p>
          You are free to download, run, inspect, modify, distribute, and self-host Padu in accordance with the terms and
          conditions of the GPL-3.0 license. Nothing in these Terms limits or restricts your rights under that license.
        </p>
      </section>

      <section>
        <h2>3. Complete Ownership of Your Code and Data</h2>
        <p>
          Padu is local-first. You retain <strong>100% exclusive ownership and copyright</strong> of all code, git commits,
          prompts, conversations, diffs, configuration files, and software artifacts you create, view, or process using Padu.
        </p>
        <p>
          Padu claims zero ownership, licensing rights, or access to your intellectual property. We do not use your code,
          prompts, or data for training AI models, marketing, or commercial exploitation.
        </p>
      </section>

      <section>
        <h2>4. Third-Party AI Providers &amp; API Usage</h2>
        <p>
          Padu acts as a native GUI workspace and orchestration layer for locally installed AI coding agent CLIs
          (such as Claude Code by Anthropic, OpenAI Codex, OpenCode, Pi Agent, Cursor CLI, and others).
        </p>
        <p>
          To use these agents, you provide your own API credentials or subscription tokens. You are solely responsible for
          complying with the terms of service, usage limits, billing agreements, and acceptable use policies of any third-party
          AI providers you integrate with Padu.
        </p>
      </section>

      <section>
        <h2>5. Local Execution, Permissions, and Safety</h2>
        <p>
          AI coding agents orchestrated by Padu are capable of modifying files, executing terminal shell commands, creating Git branches,
          and running automated test suites on your system.
        </p>
        <ul>
          <li>You are responsible for reviewing code changes, diffs, and tool commands before applying or executing them.</li>
          <li>We strongly recommend utilizing Padu&apos;s Git worktree isolation and turn-by-turn checkpoints to maintain clean working trees.</li>
          <li>You are responsible for managing operating system access permissions, secret keys, and execution environments safely.</li>
        </ul>
      </section>

      <section>
        <h2>6. Acceptable Use of Official Web Infrastructure</h2>
        <p>
          When accessing official Padu web services (such as <code>padu.dev</code>, official documentation, or update servers),
          you agree not to:
        </p>
        <ul>
          <li>Attempt to disrupt, overload, attack, or compromise the availability or security of official web servers.</li>
          <li>Distribute malicious code, viruses, or exploit payloads through official channels.</li>
          <li>Misrepresent your identity or impersonate the Padu project maintainers.</li>
        </ul>
      </section>

      <section>
        <h2>7. Disclaimer of Warranties (&ldquo;AS IS&rdquo;)</h2>
        <p>
          In accordance with Sections 15 and 16 of the GNU General Public License v3.0, the Padu software, websites,
          and documentation are provided on an <strong>&ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo;</strong> basis,
          without warranty of any kind, express or implied, including but not limited to warranties of merchantability,
          fitness for a particular purpose, non-infringement, or error-free operation.
        </p>
      </section>

      <section>
        <h2>8. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by applicable law, in no event shall the authors, copyright holders, or contributors
          be liable for any direct, indirect, incidental, special, exemplary, or consequential damages (including loss of data,
          code corruption, business interruption, or system downtime) arising in any way out of the use of or inability to use Padu.
        </p>
      </section>

      <section>
        <h2>9. Modifications &amp; Inquiries</h2>
        <p>
          We may update these Terms periodically as new features are added to the software. Significant updates will be noted
          with a revised &ldquo;Last updated&rdquo; date at the top of this page.
        </p>
        <p>
          For questions regarding these Terms, please contact us at{" "}
          <a href="mailto:support@padu.dev">support@padu.dev</a>.
        </p>
      </section>
    </LegalPage>
  );
}
