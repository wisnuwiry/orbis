import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, PaduLegalIdentity } from "~/components/legal-page";
import { pageMeta } from "~/meta";

export const Route = createFileRoute("/terms")({
  head: () =>
    pageMeta(
      "Terms of Service - Padu",
      "Terms for the official Padu Relay and official Padu websites.",
      "/terms",
    ),
  component: Terms,
});

function Terms() {
  return (
    <LegalPage title="Terms of Service" lastUpdated="August 29, 2026">
      <p>
        These Terms govern the official services operated at padu.dev and relay.padu.dev. By using
        the official relay or website, you agree to them. Our{" "}
        <a href="/privacy">Privacy Policy</a> explains how those services process data.
      </p>

      <section>
        <h2>Who provides the services</h2>
        <PaduLegalIdentity />
      </section>

      <section>
        <h2>Padu&apos;s open-source software</h2>
        <p>
          Padu is open-source software licensed under the GNU General Public License v3.0 (GPL-3.0).
          You can install, modify, and self-host it freely under the terms of that license.
        </p>
        <p>
          These Terms do not replace or restrict the open-source license. They apply only to
          services operated on official Padu websites and infrastructure.
        </p>
      </section>

      <section>
        <h2>The official relay</h2>
        <p>
          The relay is an optional service that connects Padu clients to your daemon without
          requiring you to expose the daemon directly to the public internet. Traffic is encrypted
          end-to-end between your client and daemon using NaCl box encryption. The relay carries
          ciphertext but cannot read its contents.
        </p>
        <p>
          The relay is subject to reasonable and fair use. We may limit bandwidth, connection
          volume, or abusive traffic when necessary to keep it reliable and secure for everyone.
        </p>
      </section>

      <section>
        <h2>Your content and code</h2>
        <p>
          Padu is local-first. You retain complete ownership of all prompts, source code, messages,
          files, and agent outputs. Padu does not store or claim any rights to your content.
        </p>
        <p>We do not sell your data, use it for advertising, or use it to train AI models.</p>
      </section>

      <section>
        <h2>Acceptable use</h2>
        <p>You must not use the official relay or website to:</p>
        <ul>
          <li>Break applicable law or infringe another person&apos;s legal rights</li>
          <li>Attack systems, distribute malware, or evade security access controls</li>
          <li>Gain unauthorized access to another machine, daemon, or service</li>
          <li>Interfere with the service or bypass reasonable usage limits</li>
        </ul>
      </section>

      <section>
        <h2>Third-party providers</h2>
        <p>
          Padu connects to AI agent CLIs and providers (such as Anthropic, OpenAI, Cursor, Google,
          xAI, and others) using credentials stored locally on your machine. Those services operate
          under their own terms and privacy policies.
        </p>
      </section>

      <section>
        <h2>Warranty and liability</h2>
        <p>
          Software and AI coding agents can make mistakes. Always review generated code and
          maintain appropriate version control backups.
        </p>
        <p>
          To the extent permitted by law, the open-source software and official relay are provided
          &ldquo;as is&rdquo; without warranties of any kind.
        </p>
      </section>

      <section>
        <h2>Changes and contact</h2>
        <p>
          Questions regarding these Terms can be sent to{" "}
          <a href="mailto:support@padu.dev">support@padu.dev</a>.
        </p>
      </section>
    </LegalPage>
  );
}
