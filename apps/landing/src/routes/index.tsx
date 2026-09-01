import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "~/components/landing-page";
import { pageMeta } from "~/meta";

export const Route = createFileRoute("/")({
  head: () =>
    pageMeta(
      "Padu – Native, Local-First Desktop & Web Workspace for AI Coding Agents",
      "High-performance, local-first control plane for Claude Code, Codex, OpenCode, Pi, Amp, and Cursor. Built in Rust with GPUI. Multi-agent orchestration, Git worktrees, and instant checkpoint rewind.",
      "/",
    ),
  component: Home,
});

function Home() {
  return (
    <LandingPage
      title={
        <>
          The native workspace
          <br />
          for AI coding agents
        </>
      }
      subtitle={
        <>
          Orchestrate Claude Code, Codex, OpenCode, Pi, and Cursor in a blazing-fast, local-first client.
          <br />
          Built in Rust with GPUI. Zero cloud lock-in.
        </>
      }
    />
  );
}
