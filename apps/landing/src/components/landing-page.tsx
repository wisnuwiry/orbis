import * as React from "react";
import {
  ArrowRight,
  ExternalLink,
  GitFork,
  Laptop,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  Zap,
  Cpu,
  type LucideIcon,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useInView,
  useScroll,
  useTransform,
  type Transition,
} from "framer-motion";

// Shared motion presets — hoisted so every JSX site receives the same object
// reference and doesn't trigger jsx-no-new-object-as-prop.
const FADE_IN_UP = { opacity: 0, y: 20 };
const FADE_IN = { opacity: 1, y: 0 };
const FADE_IN_UP_TINY = { opacity: 0, y: -10 };
const FADE_IN_UP_XL = { opacity: 0, y: 30 };
const FADE_IN_UP_40 = { opacity: 0, y: 40 };
const FADE_IN_UP_4 = { opacity: 0, y: 4 };
const FADE_OUT_UP_4 = { opacity: 0, y: 4 };

const EASE_OUT_06_DELAY_01: Transition = { duration: 0.6, delay: 0.1, ease: "easeOut" };
const EASE_OUT_08_DELAY_05: Transition = { duration: 0.8, delay: 0.5, ease: "easeOut" };
const EASE_OUT_05: Transition = { duration: 0.5, ease: "easeOut" };
const EASE_OUT_015: Transition = { duration: 0.15, ease: "easeOut" };
const DURATION_05: Transition = { duration: 0.5 };

const VIEWPORT_60 = { once: true, margin: "-60px" };

const PHONE_PERSPECTIVE_STYLE = { minHeight: 480, perspective: 700 };
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
import { ClaudeIcon, MobileChat, MobileDiff, MobileSidebar, PhoneFrame } from "~/components/mockup";
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

      {/* Phone showcase */}
      <PhoneShowcase />

      {/* Content section */}
      <div className="landing-content bg-background border-t border-white/[0.06]">
        <main className="p-6 md:p-20 md:pt-32 max-w-5xl mx-auto">
          <div className="space-y-32">
            <ArchitectureSection />
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

function ArchitectureSection() {
  return (
    <motion.section
      initial={FADE_IN_UP}
      whileInView={FADE_IN}
      viewport={VIEWPORT_60}
      transition={EASE_OUT_05}
    >
      <SectionHeader
        eyebrow="Architecture"
        title="A native runtime built for developer control."
        description="Padu runs directly on your hardware. The desktop client renders natively with GPUI, communicating with a lightweight background daemon that supervises your local agent CLIs."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: GPUI Rendering */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-7 flex flex-col justify-between hover:border-white/20 transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-zinc-400 bg-white/[0.04] border border-white/[0.08] px-2.5 py-0.5 rounded-full">
                gpui / rust
              </span>
              <Cpu className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-white tracking-tight">
              GPU-accelerated native rendering
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Built on GPUI—the high-performance GPU UI framework developed for Zed. No Electron,
              no DOM overhead, and direct rendering to Metal, Vulkan, and DirectX at your display&apos;s
              native refresh rate.
            </p>
          </div>
          <div className="pt-5 mt-4 border-t border-white/[0.06]">
            <div className="font-mono text-xs text-zinc-400 bg-black/40 border border-white/[0.06] rounded-lg px-3 py-2 flex items-center justify-between">
              <span className="text-zinc-500">pipeline</span>
              <span className="text-zinc-300">GPUI UI → Memory Ring → Daemon RPC</span>
            </div>
          </div>
        </div>

        {/* Card 2: Git Worktrees */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-7 flex flex-col justify-between hover:border-white/20 transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-zinc-400 bg-white/[0.04] border border-white/[0.08] px-2.5 py-0.5 rounded-full">
                git worktree
              </span>
              <GitFork className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-white tracking-tight">
              Parallel worktree isolation
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Spawn concurrent agent sessions in dedicated worktree directories. Agents write code and
              run tests on independent branches without mutating your active staging or unstaged files.
            </p>
          </div>
          <div className="pt-5 mt-4 border-t border-white/[0.06]">
            <div className="font-mono text-xs text-zinc-400 bg-black/40 border border-white/[0.06] rounded-lg px-3 py-2 flex items-center justify-between">
              <span className="text-zinc-500">isolation</span>
              <span className="text-zinc-300">.padu/worktrees/task-49a2 (feat/auth)</span>
            </div>
          </div>
        </div>

        {/* Card 3: Checkpoints */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-7 flex flex-col justify-between hover:border-white/20 transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-zinc-400 bg-white/[0.04] border border-white/[0.08] px-2.5 py-0.5 rounded-full">
                checkpoints / time-travel
              </span>
              <RotateCcw className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-white tracking-tight">
              Turn-by-turn checkpoint rewind
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Padu captures automated Git snapshots before and after every turn. Review structured file
              diffs in real time, or rewind code and conversation state back to any historical point.
            </p>
          </div>
          <div className="pt-5 mt-4 border-t border-white/[0.06]">
            <div className="font-mono text-xs text-zinc-400 bg-black/40 border border-white/[0.06] rounded-lg px-3 py-2 flex items-center justify-between">
              <span className="text-zinc-500">state</span>
              <span className="text-zinc-300">turn #3 → diff: +18 -4 → rewind ready</span>
            </div>
          </div>
        </div>

        {/* Card 4: Local First & Daemon */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-7 flex flex-col justify-between hover:border-white/20 transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-zinc-400 bg-white/[0.04] border border-white/[0.08] px-2.5 py-0.5 rounded-full">
                local-first / stdio
              </span>
              <ShieldCheck className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-white tracking-tight">
              Supervised local processes
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              The daemon manages agent CLIs via stdio/PTY and structured RPC. Credentials stay in your
              local OS keychain, and source code never leaves your computer.
            </p>
          </div>
          <div className="pt-5 mt-4 border-t border-white/[0.06]">
            <div className="font-mono text-xs text-zinc-400 bg-black/40 border border-white/[0.06] rounded-lg px-3 py-2 flex items-center justify-between">
              <span className="text-zinc-500">daemon</span>
              <span className="text-zinc-300">127.0.0.1:4789 · 0 cloud telemetry</span>
            </div>
          </div>
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

function PhoneShowcase() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const textInView = useInView(containerRef, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"],
  });

  const [slideDistance, setSlideDistance] = React.useState(260);
  React.useEffect(() => {
    function update() {
      setSlideDistance(window.innerWidth < 768 ? 140 : 260);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const sideOpacity = useTransform(scrollYProgress, [0.2, 0.6], [0, 1]);
  const leftX = useTransform(scrollYProgress, [0.2, 0.6], [0, -slideDistance]);
  const rightX = useTransform(scrollYProgress, [0.2, 0.6], [0, slideDistance]);

  const leftPhoneStyle = React.useMemo(
    () => ({ opacity: sideOpacity, x: leftX, rotateY: -15, scale: 0.97 }),
    [sideOpacity, leftX],
  );
  const rightPhoneStyle = React.useMemo(
    () => ({ opacity: sideOpacity, x: rightX, rotateY: 15, scale: 0.97 }),
    [sideOpacity, rightX],
  );
  const centerPhoneAnimate = React.useMemo(() => (textInView ? FADE_IN : {}), [textInView]);
  const textAnimate = React.useMemo(() => (textInView ? FADE_IN : {}), [textInView]);

  return (
    <div ref={containerRef} className="flex flex-col items-center pt-8 pb-20 gap-16">
      <motion.div
        initial={FADE_IN_UP_TINY}
        animate={textAnimate}
        transition={DURATION_05}
        className="flex flex-col items-center gap-2 px-6 text-center max-w-lg"
      >
        <span className="text-xs font-semibold tracking-wider uppercase text-purple-400">
          Ecosystem
        </span>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
          Control your agents from anywhere.
        </h2>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Connect seamlessly to your local workstation or remote daemon with live streaming and diff inspection.
        </p>
      </motion.div>

      {/* Phone trio */}
      <div
        className="relative flex items-center justify-center overflow-x-clip w-full"
        style={PHONE_PERSPECTIVE_STYLE}
      >
        {/* Left phone — workspace drawer */}
        <motion.div
          style={leftPhoneStyle}
          className="w-[160px] md:w-[240px] absolute"
          role="img"
          aria-label="Padu workspace drawer"
        >
          <PhoneFrame time="18:54" depth="right">
            <MobileSidebar />
          </PhoneFrame>
        </motion.div>

        {/* Center phone — agent chat */}
        <motion.div
          initial={FADE_IN_UP_XL}
          animate={centerPhoneAnimate}
          transition={EASE_OUT_06_DELAY_01}
          className="w-[220px] md:w-[240px] relative z-10"
          role="img"
          aria-label="Padu agent chat"
        >
          <PhoneFrame time="18:53">
            <MobileChat />
          </PhoneFrame>
        </motion.div>

        {/* Right phone — diff view */}
        <motion.div
          style={rightPhoneStyle}
          className="w-[160px] md:w-[240px] absolute"
          role="img"
          aria-label="Padu diff view"
        >
          <PhoneFrame time="18:55" depth="left">
            <MobileDiff />
          </PhoneFrame>
        </motion.div>
      </div>
    </div>
  );
}

function FAQ() {
  return (
    <motion.div
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
    </motion.div>
  );
}
