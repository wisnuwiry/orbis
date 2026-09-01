import * as React from "react";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Cpu,
  GitFork,
  Globe,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  Tablet,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  type Transition,
} from "framer-motion";

// Shared motion presets — hoisted so every JSX site receives the same object
// reference and doesn't trigger jsx-no-new-object-as-prop.
const FADE_IN_UP = { opacity: 0, y: 20 };
const FADE_IN = { opacity: 1, y: 0 };
const FADE_IN_UP_TINY = { opacity: 0, y: -10 };
const FADE_IN_UP_40 = { opacity: 0, y: 40 };
const FADE_IN_UP_4 = { opacity: 0, y: 4 };
const FADE_OUT_UP_4 = { opacity: 0, y: 4 };

const EASE_OUT_08_DELAY_05: Transition = { duration: 0.8, delay: 0.5, ease: "easeOut" };
const EASE_OUT_05: Transition = { duration: 0.5, ease: "easeOut" };
const EASE_OUT_015: Transition = { duration: 0.15, ease: "easeOut" };
const DURATION_05: Transition = { duration: 0.5 };
const SLIDE_TRANSITION: Transition = { duration: 0.35, ease: [0.22, 0.61, 0.36, 1] };

const VIEWPORT_60 = { once: true, margin: "-60px" };

import { CursorFieldProvider } from "~/components/butterfly";
import { AGENT_PAGES } from "~/data/agent-pages";
import {
  getDownloadOptions,
  useDetectedPlatform,
} from "~/downloads";
import { useRelease } from "~/routes/__root";
import { HeroMockup } from "~/components/hero-mockup";
import {
  ClaudeCodeIcon,
  CodexIcon,
  CursorIcon,
  OpenCodeIcon,
  PiIcon,
} from "~/components/agent-icons";
import { ClaudeIcon } from "~/components/mockup";
import { FAQItem } from "~/components/faq-item";
import { SiteFooter } from "~/components/site-footer";
import { SiteHeader } from "~/components/site-header";
import "~/styles.css";

interface LandingPageProps {
  title: React.ReactNode;
  subtitle: React.ReactNode;
}

export function LandingPage({ title, subtitle }: LandingPageProps) {
  return (
    <CursorFieldProvider>
      <div className="relative bg-background">
        {/* Hero header & content */}
        <div className="relative px-6 pt-4 pb-10 md:px-32 md:pt-6 md:pb-12 max-w-7xl mx-auto">
          <Nav />
          <Hero title={title} subtitle={subtitle} />
          <GetStarted />
        </div>

        {/* Mockup Frame */}
        <motion.div
          initial={FADE_IN_UP_40}
          animate={FADE_IN}
          transition={EASE_OUT_08_DELAY_05}
          className="relative px-6 md:px-8 pt-4 md:pt-8 pb-12 md:pb-20"
        >
          <div className="max-w-7xl mx-auto">
            <HeroMockup />
          </div>
        </motion.div>
      </div>

      {/* Content section */}
      <div className="landing-content bg-background border-t border-white/[0.06]">
        <main className="p-6 md:p-20 md:pt-32 max-w-5xl mx-auto">
          <div className="space-y-32">
            <ArchitectureCarousel />
            <EcosystemBentoSection />
            <MultiProviderSection />
            <FAQ />
          </div>
        </main>
        <SiteFooter />
      </div>
    </CursorFieldProvider>
  );
}

function Nav() {
  return (
    <nav className="mb-14 md:mb-20">
      <SiteHeader />
    </nav>
  );
}

function Hero({ title, subtitle }: { title: React.ReactNode; subtitle: React.ReactNode }) {
  return (
    <div className="space-y-6 text-center max-w-3xl mx-auto">
      {/* Eyebrow badge */}
      <motion.div
        initial={FADE_IN_UP_TINY}
        animate={FADE_IN}
        transition={DURATION_05}
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1 text-xs font-mono text-zinc-400"
      >
        Rust &amp; GPUI · Local-First
      </motion.div>

      <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.05] text-white">
        {title}
      </h1>
      <p className="text-base sm:text-lg md:text-xl leading-relaxed text-zinc-400 max-w-2xl mx-auto font-normal">
        {subtitle}
      </p>
    </div>
  );
}

const CLAUDE_CODE_BADGE_ICON = <ClaudeCodeIcon className="h-5 w-5" />;
const CODEX_BADGE_ICON = <CodexIcon className="h-5 w-5" />;
const OPENCODE_BADGE_ICON = <OpenCodeIcon className="h-5 w-5" />;
const PI_BADGE_ICON = <PiIcon className="h-5 w-5" />;
const CURSOR_BADGE_ICON = <CursorIcon className="h-5 w-5" />;

const FEATURED_AGENT_COUNT = 5;
const ADDITIONAL_AGENT_COUNT = AGENT_PAGES.length - FEATURED_AGENT_COUNT;

function AgentBadge({ name, icon }: { name: string; icon: React.ReactNode }) {
  const [hovered, setHovered] = React.useState(false);
  const handleMouseEnter = React.useCallback(() => setHovered(true), []);
  const handleMouseLeave = React.useCallback(() => setHovered(false), []);

  return (
    <span
      className="relative inline-flex items-center justify-center rounded-full p-1.5 text-white/60 hover:text-white transition-colors"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {icon}
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={FADE_IN_UP_4}
            animate={FADE_IN}
            exit={FADE_OUT_UP_4}
            transition={EASE_OUT_015}
            className="absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-white text-black text-[11px] font-semibold whitespace-nowrap pointer-events-none shadow-md"
          >
            {name}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-10 space-y-2.5">
      <span className="font-mono text-xs font-medium tracking-wider uppercase text-zinc-400">
        {eyebrow}
      </span>
      <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">{title}</h2>
      <p className="text-sm sm:text-base text-zinc-400 max-w-xl leading-relaxed">{description}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Architecture Tab Carousel (Apple Style)                                    */
/* -------------------------------------------------------------------------- */

const ARCHITECTURE_TABS = [
  {
    id: "gpui",
    name: "GPUI Engine",
    tag: "gpui / rust",
    icon: Cpu,
    title: "GPU-accelerated native rendering",
    description:
      "Built on GPUI—the high-performance GPU UI framework developed for Zed. No Electron, no DOM overhead, and direct rendering to Metal, Vulkan, and DirectX at native refresh rates.",
    points: [
      "Sub-millisecond turn updates under massive streaming token volume",
      "Direct Metal/Vulkan draw calls without browser engine reflow",
      "Virtualized list rendering handling 100k+ line session transcripts",
    ],
    docHref: "/docs",
    docLabel: "Read architecture docs",
    preview: <GpuiPreview />,
  },
  {
    id: "worktrees",
    name: "Git Worktrees",
    tag: "git worktree",
    icon: GitFork,
    title: "Parallel worktree branch isolation",
    description:
      "Spawn concurrent agent sessions in dedicated worktree directories. Agents write code, execute commands, and run tests on independent branches without mutating your active staging or unstaged files.",
    points: [
      "Launch multiple agent tasks in parallel on separate branches",
      "Active working tree stays clean and untouched",
      "Automated lifecycle cleanup when tasks settle",
    ],
    docHref: "/docs/worktrees",
    docLabel: "Read worktrees docs",
    preview: <WorktreePreview />,
  },
  {
    id: "checkpoints",
    name: "Checkpoints",
    tag: "checkpoints / time-travel",
    icon: RotateCcw,
    title: "Turn-by-turn checkpoint rewind",
    description:
      "Padu captures automated Git snapshots before and after every turn. Review structured file diffs in real time, or rewind code, prompts, and conversation state back to any historical point.",
    points: [
      "Automated Git commit snapshot on every agent turn",
      "Unified diff review with side-by-side hunk inspection",
      "1-click rollback of code and conversation context",
    ],
    preview: <CheckpointPreview />,
  },
  {
    id: "daemon",
    name: "Local Daemon",
    tag: "local-first / stdio",
    icon: ShieldCheck,
    title: "Supervised local processes & zero cloud intermediary",
    description:
      "The lightweight background daemon manages agent CLIs via stdio/PTY and structured RPC. Credentials stay in your local OS keychain, and source code never leaves your computer.",
    points: [
      "Loopback RPC communication over local Unix sockets/TCP",
      "100% local data storage with zero analytics or telemetry",
      "Run headless on remote devboxes and connect over private network",
    ],
    docHref: "/docs/cli",
    docLabel: "Read CLI docs",
    preview: <DaemonPreview />,
  },
];

function GpuiPreview() {
  return (
    <div className="rounded-xl border border-white/10 bg-black/60 p-4 font-mono text-[11px] text-zinc-400 space-y-3 select-none">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 text-[10px]">
        <div className="flex items-center gap-1.5 text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>GPUI Native Render Pipeline</span>
        </div>
        <span className="text-zinc-500">120 Hz Target</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-[10px] text-zinc-500">
          <span>Frame Time</span>
          <span className="text-emerald-400 font-semibold">2.1ms / 8.3ms budget</span>
        </div>
        {/* Frame bar */}
        <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden flex">
          <div className="h-full bg-emerald-400 w-[25%]" />
          <div className="h-full bg-purple-400 w-[10%]" />
          <div className="h-full bg-white/20 w-[65%]" />
        </div>
        <div className="flex items-center justify-between text-[9px] text-zinc-500">
          <span>Render: 1.4ms</span>
          <span>Layout: 0.7ms</span>
          <span>Idle: 6.2ms</span>
        </div>
      </div>

      <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5 space-y-1.5 text-[10px]">
        <div className="flex items-center justify-between text-zinc-300">
          <span>Backend Target</span>
          <span className="text-white">macOS Metal / Linux Vulkan / Win DirectX</span>
        </div>
        <div className="flex items-center justify-between text-zinc-300">
          <span>DOM / Webview Layer</span>
          <span className="text-emerald-400 font-semibold">None (0ms Reflow)</span>
        </div>
        <div className="flex items-center justify-between text-zinc-300">
          <span>Transcript Buffer</span>
          <span className="text-white">Virtualized GPUI List (100k+ tokens)</span>
        </div>
      </div>
    </div>
  );
}

function WorktreePreview() {
  return (
    <div className="rounded-xl border border-white/10 bg-black/60 p-4 font-mono text-[11px] text-zinc-400 space-y-3 select-none">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 text-[10px]">
        <div className="flex items-center gap-1.5 text-zinc-300">
          <GitFork className="h-3.5 w-3.5 text-sky-400" />
          <span>Git Worktree Manager</span>
        </div>
        <span className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-[9px]">
          2 Active Worktrees
        </span>
      </div>

      <div className="space-y-2 text-[10px]">
        {/* Main working directory */}
        <div className="rounded border border-white/[0.06] bg-white/[0.01] p-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-300">
            <span className="text-zinc-500">ROOT</span>
            <span className="text-white">~/project (main)</span>
          </div>
          <span className="text-zinc-500 text-[9px]">Active Working Tree · Pristine</span>
        </div>

        {/* Worktree 1 */}
        <div className="rounded border border-sky-500/20 bg-sky-500/[0.03] p-2 space-y-1">
          <div className="flex items-center justify-between text-sky-300">
            <div className="flex items-center gap-2">
              <span className="text-sky-400 font-semibold">TASK #1</span>
              <span>.padu/worktrees/task-81f (feat/auth-refresh)</span>
            </div>
            <span className="text-emerald-400 text-[9px]">Claude Code</span>
          </div>
          <div className="text-zinc-400 text-[9px] pl-2 border-l border-sky-500/30">
            Running tests in isolated branch · 4 files modified
          </div>
        </div>

        {/* Worktree 2 */}
        <div className="rounded border border-purple-500/20 bg-purple-500/[0.03] p-2 space-y-1">
          <div className="flex items-center justify-between text-purple-300">
            <div className="flex items-center gap-2">
              <span className="text-purple-400 font-semibold">TASK #2</span>
              <span>.padu/worktrees/task-49a (fix/rate-limits)</span>
            </div>
            <span className="text-purple-400 text-[9px]">Codex CLI</span>
          </div>
          <div className="text-zinc-400 text-[9px] pl-2 border-l border-purple-500/30">
            Refactoring Redis token bucket · 2 files modified
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckpointPreview() {
  return (
    <div className="rounded-xl border border-white/10 bg-black/60 p-4 font-mono text-[11px] text-zinc-400 space-y-3 select-none">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 text-[10px]">
        <div className="flex items-center gap-1.5 text-zinc-300">
          <RotateCcw className="h-3.5 w-3.5 text-purple-400" />
          <span>Turn-by-Turn Checkpoint Timeline</span>
        </div>
        <span className="text-purple-300 bg-purple-500/10 px-1.5 py-0.5 rounded text-[9px]">
          Time Travel Ready
        </span>
      </div>

      <div className="space-y-2 text-[10px]">
        {/* Turn 1 */}
        <div className="rounded border border-white/[0.06] bg-white/[0.01] p-2 flex items-center justify-between opacity-60">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
            <span className="text-zinc-400">Turn 1: Initialized database schema</span>
          </div>
          <span className="text-zinc-500 text-[9px]">+84 -0</span>
        </div>

        {/* Turn 2 */}
        <div className="rounded border border-white/[0.06] bg-white/[0.01] p-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
            <span className="text-zinc-300">Turn 2: Added token refresh handler</span>
          </div>
          <span className="text-emerald-400 text-[9px]">+28 -6</span>
        </div>

        {/* Turn 3 (Active) */}
        <div className="rounded border border-purple-500/30 bg-purple-500/[0.04] p-2.5 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-medium">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span>Turn 3: Unit test validation</span>
            </div>
            <span className="text-purple-300 text-[9px] font-semibold">Latest Snapshot</span>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span className="px-2 py-0.5 rounded bg-white/10 text-[9px] text-white">Review Diff</span>
            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-[9px] text-purple-300 border border-purple-500/30">
              1-Click Rewind
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DaemonPreview() {
  return (
    <div className="rounded-xl border border-white/10 bg-black/60 p-4 font-mono text-[11px] text-zinc-400 space-y-3 select-none">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 text-[10px]">
        <div className="flex items-center gap-1.5 text-zinc-300">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>Supervised Daemon RPC</span>
        </div>
        <span className="text-zinc-500">127.0.0.1:4789</span>
      </div>

      <div className="space-y-2 text-[10px]">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded border border-white/[0.06] bg-white/[0.02] p-2 space-y-1">
            <span className="text-zinc-500 text-[9px] uppercase">Process Supervision</span>
            <div className="text-white font-medium">PTY / Unix Sockets</div>
            <div className="text-zinc-400 text-[9px]">Zero cloud proxying</div>
          </div>
          <div className="rounded border border-white/[0.06] bg-white/[0.02] p-2 space-y-1">
            <span className="text-zinc-500 text-[9px] uppercase">Key Storage</span>
            <div className="text-white font-medium">OS Native Keychain</div>
            <div className="text-zinc-400 text-[9px]">AES-256 encrypted</div>
          </div>
        </div>

        <div className="rounded border border-emerald-500/20 bg-emerald-500/[0.03] p-2.5 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-emerald-400 font-medium text-[10px]">Zero Cloud Telemetry</div>
            <div className="text-zinc-400 text-[9px]">Code, prompts, and credentials stay on your hardware.</div>
          </div>
          <span className="text-emerald-400 font-bold text-sm">100% Local</span>
        </div>
      </div>
    </div>
  );
}

function ArchitectureCarousel() {
  const [activeTab, setActiveTab] = React.useState(0);
  const current = ARCHITECTURE_TABS[activeTab];

  const handlePrev = React.useCallback(() => {
    setActiveTab((i) => (i === 0 ? ARCHITECTURE_TABS.length - 1 : i - 1));
  }, []);

  const handleNext = React.useCallback(() => {
    setActiveTab((i) => (i === ARCHITECTURE_TABS.length - 1 ? 0 : i + 1));
  }, []);

  return (
    <motion.section
      initial={FADE_IN_UP}
      whileInView={FADE_IN}
      viewport={VIEWPORT_60}
      transition={EASE_OUT_05}
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <SectionHeader
          eyebrow="Architecture"
          title="A native runtime built for developer control."
          description="Padu runs directly on your hardware. The desktop client renders natively with GPUI, communicating with a lightweight background daemon that supervises your local agent CLIs."
        />

        {/* Carousel controls */}
        <div className="flex items-center gap-2 mb-10 shrink-0">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous architecture feature"
            className="w-8 h-8 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 transition-all cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1.5 px-2">
            {ARCHITECTURE_TABS.map((tab, idx) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(idx)}
                aria-label={`Go to ${tab.name}`}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  activeTab === idx ? "w-6 bg-white" : "w-1.5 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next architecture feature"
            className="w-8 h-8 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 transition-all cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Apple-style Tab Bar */}
      <div className="mb-6 flex flex-wrap items-center gap-1 sm:gap-2 bg-white/[0.03] p-1.5 rounded-2xl border border-white/[0.08] backdrop-blur-xl w-full">
        {ARCHITECTURE_TABS.map((tab, idx) => {
          const selected = activeTab === idx;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(idx)}
              aria-selected={selected}
              role="tab"
              className={`relative flex-1 min-w-[120px] cursor-pointer rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                selected ? "text-white" : "text-zinc-400 hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              {selected && (
                <motion.span
                  layoutId="arch-tab-pill"
                  transition={SLIDE_TRANSITION}
                  className="absolute inset-0 rounded-xl bg-white/10 border border-white/15 shadow-sm"
                />
              )}
              <Icon className="h-4 w-4 shrink-0 relative z-10" />
              <span className="relative z-10 truncate">{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Slide Content Container */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 md:p-10 relative overflow-hidden min-h-[380px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={SLIDE_TRANSITION}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
          >
            {/* Left explanation side */}
            <div className="md:col-span-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-zinc-400 bg-white/[0.04] border border-white/[0.08] px-2.5 py-0.5 rounded-full">
                  {current.tag}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
                {current.title}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {current.description}
              </p>

              <ul className="space-y-2 pt-2 text-xs sm:text-sm text-zinc-300">
                {current.points.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              {current.docHref && (
                <div className="pt-3">
                  <a
                    href={current.docHref}
                    className="inline-flex items-center gap-1 text-xs font-medium text-purple-300 hover:text-purple-200 transition-colors"
                  >
                    {current.docLabel ?? "Read documentation"} <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Right schematic preview */}
            <div className="md:col-span-6 w-full">
              {current.preview}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

/* -------------------------------------------------------------------------- */
/* Device Schematic Placeholders for Ecosystem Bento                          */
/* -------------------------------------------------------------------------- */

function TabletPlaceholder() {
  return (
    <div className="w-full rounded-xl border border-white/10 bg-black/60 p-2.5 flex flex-col gap-2 font-mono text-[10px] text-zinc-400 select-none">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-1.5 px-1">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <span className="text-zinc-500 ml-1 text-[9px]">Padu iPadOS</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Connected · Local Daemon
          </span>
        </div>
      </div>
      {/* Two-column layout */}
      <div className="grid grid-cols-12 gap-2 h-36">
        {/* Left column: Transcript & Chat */}
        <div className="col-span-6 rounded border border-white/[0.06] bg-white/[0.01] p-2 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <span className="font-semibold text-white">Claude Code</span>
              <span className="text-zinc-500">turn #2</span>
            </div>
            <div className="text-[9px] text-zinc-400 bg-white/[0.02] p-1.5 rounded border border-white/[0.04]">
              &gt; Refactored auth middleware with token refresh.
            </div>
            <div className="h-1.5 w-3/4 rounded bg-white/10" />
            <div className="h-1.5 w-1/2 rounded bg-white/10" />
          </div>
          <div className="rounded border border-white/10 bg-white/[0.03] px-2 py-1 text-zinc-500 text-[9px] flex items-center justify-between">
            <span>Send instruction...</span>
            <span className="text-zinc-400">⏎</span>
          </div>
        </div>
        {/* Right column: Split Diff */}
        <div className="col-span-6 rounded border border-white/[0.06] bg-white/[0.01] p-2 flex flex-col justify-between">
          <div className="space-y-1 text-[9px]">
            <div className="flex items-center justify-between text-zinc-400 pb-1 border-b border-white/[0.04]">
              <span>src/auth.ts</span>
              <span className="text-emerald-400">+12 -3</span>
            </div>
            <div className="space-y-0.5 font-mono text-[8.5px]">
              <div className="text-zinc-500">@@ -14,6 +14,8 @@</div>
              <div className="bg-red-500/10 text-red-300 px-1 rounded">- const token = req.cookies.token;</div>
              <div className="bg-emerald-500/10 text-emerald-300 px-1 rounded">+ const token = await extractBearerToken(req);</div>
              <div className="bg-emerald-500/10 text-emerald-300 px-1 rounded">+ if (!token) throw new AuthError();</div>
            </div>
          </div>
          <div className="text-right text-[8.5px] text-zinc-500">
            <span>Diff Review · 1-click apply</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function IPhonePlaceholder() {
  return (
    <div className="w-full max-w-[200px] mx-auto rounded-2xl border border-white/10 bg-black/60 p-2.5 flex flex-col justify-between h-44 font-mono text-[9px] text-zinc-400 select-none">
      {/* Notch & status */}
      <div className="flex items-center justify-between px-1">
        <span className="text-[8px] text-zinc-500">9:41</span>
        <div className="w-10 h-2.5 rounded-full bg-white/15" />
        <span className="text-[8px] text-zinc-500">5G</span>
      </div>
      {/* Mini chat bubble */}
      <div className="space-y-1.5 my-auto">
        <div className="bg-white/10 text-white px-2 py-1 rounded-lg rounded-br-none text-[8.5px] max-w-[85%] ml-auto">
          Add login rate limiting
        </div>
        <div className="bg-white/[0.04] border border-white/[0.08] text-zinc-300 px-2 py-1.5 rounded-lg rounded-bl-none text-[8px] max-w-[90%] space-y-1">
          <div className="flex items-center gap-1 text-purple-300">
            <span className="w-1 h-1 rounded-full bg-purple-400 animate-pulse" />
            <span>Codex CLI: editing...</span>
          </div>
          <div className="text-[7.5px] text-zinc-400">Added 5 req/min Redis rate limiter</div>
        </div>
      </div>
      {/* Composer input */}
      <div className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[8px] text-zinc-500 flex items-center justify-between">
        <span>Steer agent...</span>
        <span className="text-zinc-400">↑</span>
      </div>
    </div>
  );
}

function AndroidPlaceholder() {
  return (
    <div className="w-full max-w-[200px] mx-auto rounded-xl border border-white/10 bg-black/60 p-2.5 flex flex-col justify-between h-44 font-mono text-[9px] text-zinc-400 select-none">
      {/* Top bar */}
      <div className="flex items-center justify-between px-1 border-b border-white/[0.06] pb-1">
        <span className="text-[8.5px] text-zinc-300 font-semibold">Padu Android</span>
        <span className="text-[7.5px] text-emerald-400 bg-emerald-500/10 px-1 rounded">Live</span>
      </div>
      {/* Session Card */}
      <div className="space-y-1.5 my-auto">
        <div className="rounded border border-white/[0.08] bg-white/[0.03] p-1.5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[8px] text-white font-medium">Session #49a</span>
            <span className="text-[7px] text-zinc-500">Worktree: feat/ui</span>
          </div>
          <div className="text-[7.5px] text-zinc-400">Agent: OpenCode (8 turns)</div>
          <div className="flex items-center gap-1 pt-0.5">
            <span className="px-1 py-0.2 rounded bg-white/5 text-[7px] text-zinc-400 border border-white/10">3 files changed</span>
            <span className="px-1 py-0.2 rounded bg-purple-500/10 text-[7px] text-purple-300">Ready</span>
          </div>
        </div>
      </div>
      {/* Bottom Action Bar */}
      <div className="flex items-center justify-around text-[7.5px] text-zinc-500 pt-1 border-t border-white/[0.06]">
        <span className="text-white">Sessions</span>
        <span>Diffs</span>
        <span>Settings</span>
      </div>
    </div>
  );
}

function PwaPlaceholder() {
  return (
    <div className="w-full rounded-xl border border-white/10 bg-black/60 p-2.5 flex flex-col gap-2 font-mono text-[10px] text-zinc-400 select-none">
      {/* Browser address bar */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] pb-1.5 px-1">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
        </div>
        <div className="flex-1 rounded bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 text-center text-[9px] text-zinc-400">
          https://app.padu.dev
        </div>
        <span className="text-[8px] text-zinc-500 font-sans">PWA</span>
      </div>
      {/* Browser content preview */}
      <div className="grid grid-cols-12 gap-2 h-36">
        <div className="col-span-4 rounded border border-white/[0.06] bg-white/[0.01] p-1.5 space-y-1 text-[8.5px]">
          <div className="text-zinc-500 font-semibold uppercase text-[7.5px]">Connected Daemons</div>
          <div className="bg-white/[0.04] p-1 rounded border border-white/[0.06] text-white">● local-devbox:4789</div>
          <div className="p-1 text-zinc-500">○ vps-europe:4789</div>
          <div className="p-1 text-zinc-500">○ homelab-server</div>
        </div>
        <div className="col-span-8 rounded border border-white/[0.06] bg-white/[0.01] p-2 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[9px]">
              <span className="text-white font-medium">Terminal &amp; Transcript Stream</span>
              <span className="text-emerald-400 text-[8px]">WebSocket Active</span>
            </div>
            <div className="font-mono text-[8px] text-zinc-400 bg-black/50 p-1.5 rounded border border-white/[0.04] space-y-0.5">
              <div>$ git diff --stat</div>
              <div className="text-zinc-500"> 2 files changed, 24 insertions(+), 6 deletions(-)</div>
              <div className="text-purple-300">&gt; Claude Code completed turn in 1.4s</div>
            </div>
          </div>
          <div className="text-[8px] text-zinc-500">
            Works in Safari, Chrome, Firefox, Edge, and Arc without plugins
          </div>
        </div>
      </div>
    </div>
  );
}

function EcosystemBentoSection() {
  return (
    <motion.section
      initial={FADE_IN_UP}
      whileInView={FADE_IN}
      viewport={VIEWPORT_60}
      transition={EASE_OUT_05}
    >
      <SectionHeader
        eyebrow="Ecosystem"
        title="Every device. Every screen."
        description="Connect seamlessly to your active workspace from your iPad, iPhone, Android, or modern web browser with zero feature loss."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* iPad / Tablet - 2 columns */}
        <div className="md:col-span-2 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-7 flex flex-col justify-between hover:border-white/20 transition-all">
          <div className="space-y-2.5 mb-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-zinc-400 bg-white/[0.04] border border-white/[0.08] px-2.5 py-0.5 rounded-full">
                iPad &amp; Tablets
              </span>
              <Tablet className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-white tracking-tight">
              Split-screen workspace &amp; diff review
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-lg">
              Expansive multi-column view with live transcript streaming, file tree navigation, and
              touch-optimized side-by-side diff inspection.
            </p>
          </div>
          <TabletPlaceholder />
        </div>

        {/* iPhone (iOS) - 1 column */}
        <div className="md:col-span-1 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-7 flex flex-col justify-between hover:border-white/20 transition-all">
          <div className="space-y-2.5 mb-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-zinc-400 bg-white/[0.04] border border-white/[0.08] px-2.5 py-0.5 rounded-full">
                iPhone &amp; iOS
              </span>
              <Smartphone className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-white tracking-tight">
              Prompt steering in your pocket
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Steer running agents, queue follow-ups, and review changes on the go.
            </p>
          </div>
          <IPhonePlaceholder />
        </div>

        {/* Android - 1 column */}
        <div className="md:col-span-1 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-7 flex flex-col justify-between hover:border-white/20 transition-all">
          <div className="space-y-2.5 mb-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-zinc-400 bg-white/[0.04] border border-white/[0.08] px-2.5 py-0.5 rounded-full">
                Android
              </span>
              <Smartphone className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-white tracking-tight">
              Native companion app
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Direct daemon connectivity over local Wi-Fi, VPN, or private tailnets.
            </p>
          </div>
          <AndroidPlaceholder />
        </div>

        {/* PWA & Web - 2 columns */}
        <div className="md:col-span-2 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-7 flex flex-col justify-between hover:border-white/20 transition-all">
          <div className="space-y-2.5 mb-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-zinc-400 bg-white/[0.04] border border-white/[0.08] px-2.5 py-0.5 rounded-full">
                Web &amp; PWA
              </span>
              <Globe className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-white tracking-tight">
              Progressive Web App at app.padu.dev
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-lg">
              Zero install required. Connect to any local or remote daemon from any modern browser
              with full real-time WebSocket communication.
            </p>
          </div>
          <PwaPlaceholder />
        </div>
      </div>
    </motion.section>
  );
}

function MultiProviderSection() {
  const providers = [
    { name: "Claude Code", icon: <ClaudeIcon size={24} />, slug: "claude-code" },
    { name: "OpenAI Codex", icon: <CodexIcon className="w-6 h-6" />, slug: "codex" },
    { name: "OpenCode", icon: <OpenCodeIcon className="w-6 h-6" />, slug: "opencode" },
    { name: "Pi Agent", icon: <PiIcon className="w-6 h-6" />, slug: "pi" },
    { name: "Cursor CLI", icon: <CursorIcon className="w-6 h-6" />, slug: "cursor" },
  ];

  return (
    <motion.section
      initial={FADE_IN_UP}
      whileInView={FADE_IN}
      viewport={VIEWPORT_60}
      transition={EASE_OUT_05}
    >
      <SectionHeader
        eyebrow="Integrations"
        title="Direct drivers for your local agents."
        description="Padu communicates with your locally installed CLIs via native structured protocols. Switch between agents while preserving workspace state."
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
        {providers.map((p) => (
          <a
            key={p.name}
            href={`/${p.slug}`}
            className="flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/[0.02] p-4.5 hover:border-white/20 hover:bg-white/[0.04] transition-all group"
          >
            <span className="text-white/80 group-hover:text-white transition-colors">{p.icon}</span>
            <span className="font-medium text-sm text-white/90 group-hover:text-white transition-colors">
              {p.name}
            </span>
          </a>
        ))}
        <a
          href="/agents"
          className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 bg-white/[0.01] p-4.5 text-zinc-400 hover:text-white hover:border-white/30 hover:bg-white/[0.03] transition-all"
        >
          <span className="font-medium text-sm">+{ADDITIONAL_AGENT_COUNT} more agents</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </motion.section>
  );
}

function GetStarted() {
  return (
    <div className="pt-8">
      <div className="flex flex-row flex-wrap justify-center gap-3">
        <DownloadButton />
        <OtherPlatformsButton />
      </div>
      <div className="flex items-center justify-center gap-2 pt-6">
        <span className="text-xs text-zinc-500 font-medium">Supports</span>
        <div className="flex items-center gap-1 bg-white/[0.02] px-2.5 py-1 rounded-full border border-white/[0.06]">
          <AgentBadge name="Claude Code" icon={CLAUDE_CODE_BADGE_ICON} />
          <AgentBadge name="Codex" icon={CODEX_BADGE_ICON} />
          <AgentBadge name="OpenCode" icon={OPENCODE_BADGE_ICON} />
          <AgentBadge name="Pi" icon={PI_BADGE_ICON} />
          <AgentBadge name="Cursor" icon={CURSOR_BADGE_ICON} />
        </div>
        <a
          href="/agents"
          className="text-xs text-zinc-400 hover:text-white transition-colors font-medium ml-1"
        >
          +{ADDITIONAL_AGENT_COUNT} more
        </a>
      </div>
    </div>
  );
}

function DownloadButton() {
  const release = useRelease();
  const detectedPlatform = useDetectedPlatform();
  const primary = getDownloadOptions(release).find((o) => o.platform === detectedPlatform)!;
  const PrimaryIcon = primary.icon;

  return (
    <a
      href={primary.href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:bg-foreground/90 active:scale-[0.98] transition-all"
    >
      <PrimaryIcon className="h-4 w-4" />
      Download for {primary.label}
    </a>
  );
}

function OtherPlatformsButton() {
  return (
    <a
      href="/download"
      className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4.5 py-2.5 text-sm font-medium text-white hover:bg-white/[0.08] active:scale-[0.98] transition-all"
    >
      Other platforms
    </a>
  );
}

function FAQ() {
  return (
    <motion.section
      initial={FADE_IN_UP}
      whileInView={FADE_IN}
      viewport={VIEWPORT_60}
      transition={EASE_OUT_05}
      className="space-y-6"
    >
      <SectionHeader
        eyebrow="FAQ"
        title="Frequently asked questions."
        description="Everything you need to know about Padu's architecture, privacy, and agent support."
      />
      <div className="divide-y divide-white/[0.08]">
        <FAQItem question="What is Padu?">
          Padu is a high-performance, native desktop and web workspace for orchestrating local AI
          coding agents. Built in Rust with GPUI (the GPU-accelerated UI engine behind Zed), Padu
          keeps all your projects, sessions, transcripts, and credentials strictly on your machine.
        </FAQItem>
        <FAQItem question="Is Padu free and open source?">
          Yes. Padu is 100% free and open source, licensed under the GNU General Public License v3.0
          (GPL-3.0). You bring your own API credentials or subscriptions for the agent providers you
          choose to run.
        </FAQItem>
        <FAQItem question="Does my code or data leave my machine?">
          No. Padu is strictly local-first. It never transmits your source code, prompts, files, or
          agent transcripts to external servers, and includes zero telemetry or analytics tracking.
          Agents communicate directly with their provider APIs using the credentials on your computer.
        </FAQItem>
        <FAQItem question="What AI coding agents does Padu support?">
          Padu supports leading coding agents with native direct drivers and ACP (Agent Client
          Protocol) integrations: Claude Code, OpenAI Codex CLI, OpenCode, Pi Agent, Amp, DeepSeek,
          Cursor CLI, Fx, Grok Build, Kimi Code, GitHub Copilot, Google Gemini CLI, Cline, Goose, and
          Mistral Vibe. See the full catalog on the{" "}
          <a href="/agents" className="underline hover:text-white transition-colors">
            supported agents page
          </a>
          .
        </FAQItem>
        <FAQItem question="How does Padu integrate with coding agents?">
          Padu communicates directly with your locally installed agent CLIs via native structured
          protocols and process lifecycles. It does not intercept tokens or alter agent
          behavior—it provides a unified native UI for streaming live transcripts, switching models,
          inspecting unified diffs, and queueing follow-up prompts.
        </FAQItem>
        <FAQItem question="How do Git worktrees and checkpoints work?">
          When launching a task, Padu can run the agent inside an isolated Git worktree so it operates
          on a separate branch without modifying your active working directory. Padu also tracks
          turn-by-turn Git checkpoints, enabling 1-click diff reviews and exact state rewinds. Read
          the{" "}
          <a href="/docs/worktrees" className="underline hover:text-white transition-colors">
            worktrees documentation
          </a>
          .
        </FAQItem>
        <FAQItem question="What platforms and operating systems are supported?">
          Padu provides native desktop releases for <strong>macOS</strong> (Apple Silicon & Intel),{" "}
          <strong>Linux</strong> (Wayland & X11), and <strong>Windows</strong> (x86_64), alongside
          a web client and companion mobile apps.
        </FAQItem>
        <FAQItem question="Can I steer or queue prompts while an agent is actively working?">
          Yes. Padu supports live message queueing and steering, allowing you to append new
          instructions, additional context, or corrections while an agent is executing a turn.
        </FAQItem>
        <FAQItem question="Do I need a separate account or cloud service to use Padu?">
          No. Padu requires no cloud accounts, logins, or remote subscription fees. The desktop app
          manages its local daemon automatically on loopback, and you can run the daemon headless
          on remote servers or cloud VMs using the CLI.
        </FAQItem>
      </div>
    </motion.section>
  );
}
