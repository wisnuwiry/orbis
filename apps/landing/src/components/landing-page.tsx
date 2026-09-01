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
import { CommandDialog } from "~/components/command-dialog";
import { AGENT_PAGES } from "~/data/agent-pages";
import {
  getDownloadOptions,
  useDetectedPlatform,
  TerminalIcon,
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
      {/* Background ambient lighting */}
      <div className="relative overflow-hidden bg-background">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] sm:w-[1000px] h-[550px] bg-gradient-to-b from-purple-500/12 via-sky-500/5 to-transparent blur-3xl opacity-70 rounded-full"
        />

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
            <BentoFeatureSection />
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
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-white/80 backdrop-blur-xl shadow-sm"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
        Built with Rust & GPUI · 100% Local-First
      </motion.div>

      <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-[-0.03em] leading-[1.06] text-white">
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
    <div className="mb-12 space-y-3">
      <span className="text-xs font-semibold tracking-wider uppercase text-purple-400">
        {eyebrow}
      </span>
      <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">{title}</h2>
      <p className="text-base text-zinc-400 max-w-xl leading-relaxed">{description}</p>
    </div>
  );
}

function BentoFeatureSection() {
  return (
    <motion.section
      initial={FADE_IN_UP}
      whileInView={FADE_IN}
      viewport={VIEWPORT_60}
      transition={EASE_OUT_05}
    >
      <SectionHeader
        eyebrow="Architecture"
        title="Engineered like no other client."
        description="Built in Rust with GPU acceleration. Instant cold startup, sub-millisecond turn updates, and fluid 120fps streaming."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Hero Bento Card - 120 FPS GPUI */}
        <div className="md:col-span-3 rounded-2xl border border-white/10 bg-white/[0.02] p-8 md:p-10 relative overflow-hidden group hover:border-white/20 transition-all">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300">
                <Cpu className="h-3.5 w-3.5" />
                GPUI Native Engine
              </div>
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                120 FPS GPU-Accelerated UI
              </h3>
              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                Powered by GPUI, the rendering technology behind Zed. Zero Electron overhead, sub-millisecond
                turn response, and smooth 120fps scrolling even with tens of thousands of streaming tokens.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center">
                <span className="block text-2xl font-semibold text-white">120</span>
                <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium">
                  FPS Render
                </span>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center">
                <span className="block text-2xl font-semibold text-white">&lt;10ms</span>
                <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium">
                  Latency
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bento Card 2 - Local First */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-7 flex flex-col justify-between hover:border-white/20 transition-all">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/80">
              <ShieldCheck className="h-5 w-5 text-emerald-400" strokeWidth={1.75} />
            </div>
            <h3 className="text-lg font-semibold text-white tracking-tight">
              100% Local-First & Private
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Your source code, prompts, credentials, and transcripts stay on your computer. Zero telemetry,
              zero tracking, and no cloud lock-in.
            </p>
          </div>
        </div>

        {/* Bento Card 3 - Worktree Isolation */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-7 flex flex-col justify-between hover:border-white/20 transition-all">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/80">
              <GitFork className="h-5 w-5 text-sky-400" strokeWidth={1.75} />
            </div>
            <h3 className="text-lg font-semibold text-white tracking-tight">
              Git Worktree Isolation
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Launch multiple agents in parallel on isolated branches. Agents never touch your active
              working tree or dirty edits.
            </p>
          </div>
          <div className="pt-4">
            <a
              href="/docs/worktrees"
              className="inline-flex items-center gap-1 text-xs font-medium text-purple-300 hover:text-purple-200 transition-colors"
            >
              Read docs <ArrowRight className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Bento Card 4 - Checkpoint Rewinds */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-7 flex flex-col justify-between hover:border-white/20 transition-all">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/80">
              <RotateCcw className="h-5 w-5 text-purple-400" strokeWidth={1.75} />
            </div>
            <h3 className="text-lg font-semibold text-white tracking-tight">
              Turn-by-Turn Checkpoints
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Inspect structured diffs after every turn. Instantly rewind code, conversation, and runtime
              state with 1-click.
            </p>
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
        eyebrow="Compatibility"
        title="All your favorite agents, unified."
        description="Switch seamlessly between leading AI coding agents while keeping your local workspace context and credentials intact."
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
        <ServerInstallButton />
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
      className="inline-flex items-center gap-2 rounded-full bg-white text-black px-6 py-2.5 text-sm font-semibold hover:bg-white/90 active:scale-95 transition-all shadow-[0_0_24px_rgba(255,255,255,0.2)]"
    >
      <PrimaryIcon className="h-4 w-4" />
      Download for {primary.label}
    </a>
  );
}

const SERVER_INSTALL_TRIGGER = (
  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white hover:bg-white/[0.08] active:scale-95 transition-all backdrop-blur-md">
    <TerminalIcon className="h-4 w-4 text-white/70" />
    Remote CLI
  </span>
);

const SERVER_INSTALL_FOOTNOTE = (
  <>
    Requires Node.js 18+. Run <span className="font-mono text-white/40">padu</span> to start the
    daemon.
  </>
);

function ServerInstallButton() {
  return (
    <CommandDialog
      trigger={SERVER_INSTALL_TRIGGER}
      title="Run agents on a remote machine"
      description="For headless machines you want to connect to from the Padu apps. The desktop app already includes a built-in daemon."
      command="npm install -g @padu/cli && padu"
      footnote={SERVER_INSTALL_FOOTNOTE}
    />
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
