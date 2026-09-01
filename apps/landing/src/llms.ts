import { getAlternativePages } from "~/data/alternative-pages";
import { AGENT_PAGES } from "~/data/agent-pages";
import { type Doc, getDocs } from "~/docs";

const SITE_URL = "https://padu.dev";

const PRODUCT_PREAMBLE = `# Padu

> Native, local-first desktop and web workspace for orchestrating AI coding agents. Built in Rust with GPUI.

Padu is an open-source native application that lets you run and orchestrate AI coding agents on your own machine. Your code stays strictly local — Padu connects directly to your real development environment, local Git repositories, and installed CLI agents instead of running in someone else's cloud.

Engineered with Rust and GPUI (the GPU-accelerated UI framework behind Zed), Padu delivers instant startup, minimal memory consumption, and smooth 120fps transcript streaming. A self-hosted daemon manages subprocess lifecycles, structured event streaming, Git worktree isolation, and turn-by-turn checkpoint rewinds.

Padu provides native direct drivers and ACP integrations for leading coding agents: Claude Code, OpenAI Codex CLI, OpenCode, Pi Agent, Amp, DeepSeek, Cursor CLI, Fx, Grok Build, Kimi Code, GitHub Copilot, Google Gemini CLI, Cline, Goose, and Mistral Vibe.

Distribution: Native desktop apps for macOS, Windows, Linux; web application; companion mobile clients. License: GPL-3.0 at https://github.com/wisnuwiry/padu. Marketing site: https://padu.dev.
`;

function docLine(doc: Doc): string {
  const url = `${SITE_URL}${doc.href}.md`;
  const description = doc.frontmatter.description?.trim();
  const suffix = description ? `: ${description}` : "";
  return `- [${doc.frontmatter.title}](${url})${suffix}`;
}

function agentLine(agent: (typeof AGENT_PAGES)[number]): string {
  return `- [${agent.name}](${SITE_URL}/${agent.slug}): ${agent.subtitle}`;
}

function alternativeLine(page: ReturnType<typeof getAlternativePages>[number]): string {
  const description = page.description.trim();
  const suffix = description ? `: ${description}` : "";
  return `- [${page.title}](${SITE_URL}${page.href})${suffix}`;
}

function topLevelDocs(): Doc[] {
  return getDocs().filter((d) => !d.slug.includes("/"));
}

export function buildLlmsTxt(): string {
  const docs = topLevelDocs().map(docLine).join("\n");
  const alternatives = getAlternativePages().map(alternativeLine).join("\n");
  const agents = AGENT_PAGES.map(agentLine).join("\n");

  return `${PRODUCT_PREAMBLE}
## Docs

${docs}

## Alternatives

${alternatives}

## Supported agents

${agents}

## Optional

- [Changelog](${SITE_URL}/changelog): Release notes for the Padu daemon, CLI, desktop, and mobile apps.
- [Download](${SITE_URL}/download): Install Padu on Mac, Windows, Linux, iOS, Android, or run the web app.
- [Privacy](${SITE_URL}/privacy): Privacy policy.
- [Terms](${SITE_URL}/terms): Terms for the official relay and hosted Hub.
- [GitHub](https://github.com/wisnuwiry/padu): Source code, issues, and releases.
`;
}
