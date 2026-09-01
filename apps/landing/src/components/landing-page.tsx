import * as React from "react";
import {
  ArrowRight,
  ExternalLink,
  GitFork,
  Laptop,
  Monitor,
  Smartphone,
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

// A ~240px-wide phone rotated 15° only foreshortens a couple percent at
// perspective 1200 — it reads as a flat, skewed card. The side phones already
// sit on a correctly projecting plane (the frame and its scaled interior share
// one flattened texture), so the interior just needs the projection to be
// strong enough to see: a tighter perspective gives the trio a real book-fold.
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
import { GitHubIcon } from "~/components/brand-icons";
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
      {/* Hero section with background image */}
      <div className="relative bg-cover bg-center bg-no-repeat">
        <div className="relative px-6 pt-4 pb-10 md:px-32 md:pt-6 md:pb-12 max-w-7xl mx-auto">
          <Nav />
          <Hero title={title} subtitle={subtitle} />
          <GetStarted />
        </div>

        {/* Mockup - inside hero so it's above the gradient, positioned to overflow into black section */}
        <motion.div
          initial={FADE_IN_UP_40}
          animate={FADE_IN}
          transition={EASE_OUT_08_DELAY_05}
          className="relative px-6 md:px-8 pt-4 md:pt-8 pb-8 md:pb-16"
        >
          <div className="max-w-7xl mx-auto">
            <HeroMockup />
          </div>
        </motion.div>
      </div>

      {/* Phone showcase */}
      <PhoneShowcase />

      {/* Content section */}
      <div className="landing-content bg-background">
        <main className="p-6 md:p-20 md:pt-40 max-w-5xl mx-auto">
          <div className="space-y-24">
            <MultiProviderSection />
            <TurnkeySection />
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
    <nav className="mb-16 md:mb-20">
      <SiteHeader />
    </nav>
  );
}

function Hero({ title, subtitle }: { title: React.ReactNode; subtitle: React.ReactNode }) {
  return (
    <div className="space-y-6 text-center">
      <h1 className="text-4xl md:text-6xl font-medium tracking-tight leading-[0.95]">{title}</h1>
      <p className="text-base leading-relaxed text-white/70 md:text-lg max-w-lg mx-auto">
        {subtitle}
      </p>
    </div>
  );
}

const CLAUDE_CODE_BADGE_ICON = <ClaudeCodeIcon className="h-6 w-6" />;
const CODEX_BADGE_ICON = <CodexIcon className="h-6 w-6" />;
const OPENCODE_BADGE_ICON = <OpenCodeIcon className="h-6 w-6" />;
const PI_BADGE_ICON = <PiIcon className="h-6 w-6" />;
const CURSOR_BADGE_ICON = <CursorIcon className="h-6 w-6" />;

const FEATURED_AGENT_COUNT = 5;
const ADDITIONAL_AGENT_COUNT = AGENT_PAGES.length - FEATURED_AGENT_COUNT;

function AgentBadge({ name, icon }: { name: string; icon: React.ReactNode }) {
  const [hovered, setHovered] = React.useState(false);
  const handleMouseEnter = React.useCallback(() => setHovered(true), []);
  const handleMouseLeave = React.useCallback(() => setHovered(false), []);

  return (
    <span
      className="relative inline-flex items-center justify-center rounded-full p-1.5 text-white/60"
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
            className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-white text-black text-xs whitespace-nowrap pointer-events-none"
          >
            {name}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

function FeatureSection({
  title,
  description,
  badge,
  links,
  children,
}: {
  title: string;
  description: string;
  badge?: string;
  links?: ReadonlyArray<{ href: string; label: string }>;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={FADE_IN_UP}
      whileInView={FADE_IN}
      viewport={VIEWPORT_60}
      transition={EASE_OUT_05}
    >
      <SectionTitle title={title} description={description} badge={badge} links={links} />
      {children}
    </motion.section>
  );
}

function SectionTitle({
  title,
  description,
  badge,
  links,
}: {
  title: string;
  description: string;
  badge?: string;
  links?: ReadonlyArray<{ href: string; label: string }>;
}) {
  return (
    <div className="mb-12 space-y-2">
      <div className="flex items-center gap-3">
        <h2 className="text-3xl font-medium tracking-tight">{title}</h2>
        {badge && (
          <span className="rounded-full bg-purple-400/10 px-2.5 py-0.5 text-xs text-purple-300 border border-purple-500/20 font-medium">
            {badge}
          </span>
        )}
      </div>
      <p className="text-base text-muted-foreground max-w-lg leading-relaxed">{description}</p>
      {links ? (
        <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
              <ExternalLink className="h-3 w-3" />
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function MultiProviderSection() {
  const providers = [
    { name: "Claude Code", icon: <ClaudeIcon size={28} /> },
    { name: "Codex", icon: <CodexIcon className="w-7 h-7" /> },
    { name: "OpenCode", icon: <OpenCodeIcon className="w-7 h-7" /> },
    { name: "Pi", icon: <PiIcon className="w-7 h-7" /> },
    { name: "Cursor", icon: <CursorIcon className="w-7 h-7" /> },
  ];

  return (
    <FeatureSection
      title="Multi-agent orchestration"
      description="Switch between leading AI coding agents while keeping your local workspace context and credentials intact."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {providers.map((p) => (
          <div
            key={p.name}
            className="flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 hover:border-white/20 transition-colors"
          >
            <span className="text-white/80">{p.icon}</span>
            <span className="font-medium text-white/90">{p.name}</span>
          </div>
        ))}
        <a
          href="/agents"
          className="flex items-center justify-center gap-3 rounded-xl border border-dashed border-white/10 bg-white/[0.01] px-5 py-4 text-white/50 hover:text-white/80 hover:border-white/20 hover:bg-white/[0.03] transition-colors"
        >
          <span className="font-medium">+{ADDITIONAL_AGENT_COUNT} more</span>
        </a>
      </div>
    </FeatureSection>
  );
}

function TurnkeySection() {
  return (
    <FeatureSection
      title="Engineered for performance"
      description="Run Padu natively with GPU-accelerated rendering, connect over your network, or run agents in isolated Git worktrees."
    >
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
        <div className="flex flex-col gap-6 border-b border-white/10 p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
          <div className="flex items-start gap-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.06] p-3 text-muted-foreground">
              <Monitor className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-xl font-medium text-white/90">Native desktop app</h3>
              <p className="max-w-lg text-sm leading-relaxed text-white/50">
                High-performance native app built in Rust and GPUI with instant startup and 120fps streaming.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="grid gap-4 md:grid-cols-3">
            <TurnkeyExtensionCard
              icon={Smartphone}
              title="Mobile and web"
              description="Connect to the same workspace from browser and companion clients."
              ctaHref="/download"
              ctaLabel="Download"
            />
            <TurnkeyExtensionCard
              icon={Laptop}
              title="Remote daemon"
              description="Run the Padu daemon headless on remote devboxes, home servers, or cloud VMs."
              ctaHref="/docs/cli"
              ctaLabel="Docs"
            />
            <TurnkeyExtensionCard
              icon={GitFork}
              title="Worktree isolation"
              description="Run concurrent agents in separate Git worktrees without touching your active branch."
              ctaHref="/docs/worktrees"
              ctaLabel="Docs"
            />
          </div>
        </div>
      </div>
    </FeatureSection>
  );
}

function TurnkeyExtensionCard({
  icon: Icon,
  title,
  description,
  ctaHref,
  ctaLabel,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <div className="flex min-h-48 flex-col rounded-xl border border-white/10 bg-white/[0.025] p-5 hover:border-white/20 transition-colors">
      <div className="mb-5 flex items-center gap-3 text-muted-foreground">
        <Icon className="h-5 w-5" strokeWidth={1.5} />
      </div>
      <h3 className="font-medium text-white/85">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/45">{description}</p>
      <div className="mt-auto pt-5">
        <a
          href={ctaHref}
          className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-2.5 py-1.5 text-xs text-background transition-colors hover:bg-foreground/90 font-medium"
        >
          {ctaLabel}
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}


function GetStarted() {
  return (
    <div className="pt-10">
      <div className="flex flex-row flex-wrap justify-center gap-3">
        <DownloadButton />
        {/* App Store & Google Play buttons temporarily hidden until released */}
        {/* <a href={appStoreUrl} ...><AppleIcon /></a> */}
        {/* <a href={playStoreUrl} ...><PlayStoreIcon /></a> */}
        <ServerInstallButton />
      </div>
      <div className="flex items-center justify-center gap-2 pt-6">
        <span className="text-xs text-muted-foreground">Supports</span>
        <div className="flex items-center gap-1">
          <AgentBadge name="Claude Code" icon={CLAUDE_CODE_BADGE_ICON} />
          <AgentBadge name="Codex" icon={CODEX_BADGE_ICON} />
          <AgentBadge name="OpenCode" icon={OPENCODE_BADGE_ICON} />
          <AgentBadge name="Pi" icon={PI_BADGE_ICON} />
          <AgentBadge name="Cursor" icon={CURSOR_BADGE_ICON} />
        </div>
        <a
          href="/agents"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
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
      className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/90 transition-colors"
    >
      <PrimaryIcon className="h-4 w-4" />
      Download for {primary.label}
    </a>
  );
}

const SERVER_INSTALL_TRIGGER = (
  <span className="inline-flex items-center justify-center rounded-lg border border-white/12 px-3 py-2 text-white hover:bg-white/10 transition-colors">
    <TerminalIcon className="h-5 w-5" />
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

  // Scroll-linked animation: track how far through the container the user has scrolled
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"],
  });

  // Responsive slide distance
  const [slideDistance, setSlideDistance] = React.useState(260);
  React.useEffect(() => {
    function update() {
      setSlideDistance(window.innerWidth < 768 ? 140 : 260);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Side phones start at x=0 (behind center) and slide out to final position
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
    <div ref={containerRef} className="flex flex-col items-center pt-4 pb-16 gap-20">
      {/* Arrow + text */}
      <motion.div
        initial={FADE_IN_UP_TINY}
        animate={textAnimate}
        transition={DURATION_05}
        className="flex flex-col items-center gap-1.5 px-6"
      >
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
          className="text-white/20 mb-2"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
        <p className="text-lg text-white/90 text-center font-medium">
          Control your agents from any device, anywhere.
        </p>
        <p className="text-sm text-white/50 text-center max-w-md">
          Connect seamlessly to your local or remote daemon with full feature parity, live streaming, and turn inspection.
        </p>
      </motion.div>

      {/* Phone trio — side phones are absolute, start behind center, slide outward with perspective rotation */}
      <div
        className="relative flex items-center justify-center overflow-x-clip w-full"
        style={PHONE_PERSPECTIVE_STYLE}
      >
        {/* Left phone — workspace drawer, rotated to face inward */}
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

        {/* Right phone — diff view, rotated to face inward */}
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
      <div className="space-y-2 mb-8">
        <h2 className="text-3xl font-medium tracking-tight">Frequently asked questions</h2>
        <p className="text-base text-muted-foreground max-w-lg leading-relaxed">
          Everything you need to know about Padu&apos;s architecture, privacy, and agent support.
        </p>
      </div>
      <div className="space-y-4">
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

