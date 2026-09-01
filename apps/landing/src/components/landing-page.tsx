import * as React from "react";
import {
  ArrowRight,
  Bot,
  Braces,
  ExternalLink,
  GitFork,
  Laptop,
  Monitor,
  Smartphone,
  Terminal,
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
const AGENT_LIST_GRID_STYLE = {
  gridTemplateColumns: "auto auto auto minmax(0, 1fr)",
};

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
            <AutomationSection />
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
    <nav className="mb-20 md:mb-24">
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
        <h2 className="text-3xl font-medium">{title}</h2>
        {badge && (
          <span className="rounded-full bg-purple-400/10 px-2 py-1 text-xs text-purple-300 border border-purple-500/20">
            {badge}
          </span>
        )}
      </div>
      <p className="text-base text-muted-foreground max-w-lg">{description}</p>
      {links ? (
        <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-extra-muted-foreground transition-colors hover:text-muted-foreground"
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
      title="Works with your tools"
      description="Bring your subscriptions, skills and configuration"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {providers.map((p) => (
          <div
            key={p.name}
            className="flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4"
          >
            <span className="text-white/80">{p.icon}</span>
            <span className="font-medium">{p.name}</span>
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
      title="Run it anywhere"
      description="Use Padu locally, from another machine, or in isolated worktrees"
    >
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
        <div className="flex flex-col gap-6 border-b border-white/10 p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
          <div className="flex items-start gap-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.06] p-3 text-muted-foreground">
              <Monitor className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-xl font-medium text-white/90">Desktop app</h3>
              <p className="max-w-lg text-sm leading-relaxed text-white/50">
                The one click experience, download the app and it just works
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="grid gap-4 md:grid-cols-3">
            <TurnkeyExtensionCard
              icon={Smartphone}
              title="Mobile and web"
              description="Connect to the same workspaces from any client"
              ctaHref="/download"
              ctaLabel="Download"
            />
            <TurnkeyExtensionCard
              icon={Laptop}
              title="Remote machines"
              description="Run Padu on a home lab, or a cloud machine"
              ctaHref="/docs/cli"
              ctaLabel="Docs"
            />
            <TurnkeyExtensionCard
              icon={GitFork}
              title="Worktree isolation"
              description="Run agents in separate git worktrees without touching your branch"
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
    <div className="flex min-h-48 flex-col rounded-xl border border-white/10 bg-white/[0.025] p-5">
      <div className="mb-5 flex items-center gap-3 text-muted-foreground">
        <Icon className="h-5 w-5" strokeWidth={1.5} />
      </div>
      <h3 className="font-medium text-white/85">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/45">{description}</p>
      <div className="mt-auto pt-5">
        <a
          href={ctaHref}
          className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-2.5 py-1.5 text-xs text-background transition-colors hover:bg-foreground/90"
        >
          {ctaLabel}
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}

type AutomationKind = "mcp" | "cli" | "sdk";

const AUTOMATION_OPTIONS: Array<{
  kind: AutomationKind;
  label: string;
  caption: string;
  icon: LucideIcon;
}> = [
  {
    kind: "mcp",
    label: "MCP",
    caption: "From another agent",
    icon: Bot,
  },
  {
    kind: "cli",
    label: "CLI",
    caption: "From the terminal",
    icon: Terminal,
  },
  {
    kind: "sdk",
    label: "SDK",
    caption: "From code",
    icon: Braces,
  },
];

const AUTOMATION_LINKS = [
  { href: "/docs/mcp", label: "MCP docs" },
  { href: "/docs/cli", label: "CLI docs" },
  { href: "/docs/connectivity", label: "Connectivity docs" },
] as const;

function AutomationSection() {
  const [activeKind, setActiveKind] = React.useState<AutomationKind>("mcp");

  return (
    <FeatureSection
      title="Built for automation"
      description="Use MCP, the CLI, or the TypeScript SDK to automate Padu"
      links={AUTOMATION_LINKS}
    >
      <div className="grid gap-4 md:grid-cols-[14rem_minmax(0,1fr)]">
        <div className="grid self-start gap-2" role="tablist">
          {AUTOMATION_OPTIONS.map((option) => (
            <AutomationSelector
              key={option.kind}
              option={option}
              active={option.kind === activeKind}
              onSelect={setActiveKind}
            />
          ))}
        </div>
        <AutomationDetail kind={activeKind} />
      </div>
    </FeatureSection>
  );
}

function AutomationSelector({
  option,
  active,
  onSelect,
}: {
  option: (typeof AUTOMATION_OPTIONS)[number];
  active: boolean;
  onSelect: (kind: AutomationKind) => void;
}) {
  const Icon = option.icon;
  const handleClick = React.useCallback(() => onSelect(option.kind), [onSelect, option.kind]);

  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={handleClick}
      className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-colors md:block md:p-4 ${
        active
          ? "border-white/20 bg-white/[0.07]"
          : "border-white/10 bg-white/[0.025] hover:border-white/15 hover:bg-white/[0.04]"
      }`}
    >
      <div className="flex shrink-0 items-center gap-2 text-muted-foreground md:mb-1">
        <Icon className="h-3 w-3" strokeWidth={1.5} />
        <span className="text-[10px]">{option.label}</span>
      </div>
      <p className="text-xs leading-snug text-white/85 md:text-sm">{option.caption}</p>
    </button>
  );
}

function AutomationDetail({ kind }: { kind: AutomationKind }) {
  return (
    <div
      role="tabpanel"
      className="min-h-80 min-w-0 overflow-hidden rounded-xl border border-white/10 bg-black/20 p-5 md:h-[26rem] md:p-6"
    >
      {kind === "mcp" ? <McpAutomationTranscript /> : null}
      {kind === "cli" ? <CliAutomationExample /> : null}
      {kind === "sdk" ? <SdkAutomationExample /> : null}
    </div>
  );
}

function McpAutomationTranscript() {
  return (
    <div className="space-y-5">
      <div className="ml-auto w-fit max-w-xl rounded-xl rounded-tr-none bg-white/[0.07] px-4 py-3">
        <p className="text-sm leading-relaxed text-white/75">
          Take the open GitHub issues labeled ready and fan them out to separate worktree agents.
        </p>
      </div>
      <div className="flex items-start gap-3">
        <Bot className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
        <div className="min-w-0 flex-1 space-y-4">
          <p className="text-sm leading-relaxed text-white/55">
            I found two ready issues. I will run each in its own worktree.
          </p>
          <div className="space-y-2 font-mono text-[11px]">
            <McpAgentCall issue="#412" provider="claude/opus-4.6" />
            <McpAgentCall issue="#417" provider="codex/gpt-5.6-sol" />
          </div>
          <p className="text-sm leading-relaxed text-white/55">
            Done, two agents are running. I will let you know when they finish.
          </p>
        </div>
      </div>
    </div>
  );
}

function McpAgentCall({ issue, provider }: { issue: string; provider: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-md border border-white/[0.07] bg-white/[0.025] px-3 py-2">
      <span className="text-sky-300/80">create_agent</span>
      <span className="text-white/25">{issue}</span>
      <span className="text-white/35">{provider}</span>
      <span className="text-white/25">worktree</span>
    </div>
  );
}

function CliAutomationExample() {
  return (
    <div className="font-mono text-[11px] leading-5 text-white/60">
      <div className="space-y-6">
        <div>
          <ShellPrompt>
            <span className="text-white">padu run</span> <span className="text-white/35">\</span>
          </ShellPrompt>
          <div className="pl-5">
            <span className="text-sky-300/75">--provider</span>{" "}
            <span className="text-white/75">codex/gpt-5.6-sol</span>{" "}
            <span className="text-white/35">\</span>
          </div>
          <div className="pl-5 text-purple-300/80">{'"Fix issue #412 and add tests."'}</div>
          <div className="mt-1 text-purple-300/65">✓ Started agent a7f3c2</div>
        </div>

        <div className="space-y-1">
          <ShellPrompt>
            <span className="text-white">padu ls</span>
          </ShellPrompt>
          <AgentListOutput />
        </div>

        <div>
          <div className="text-white/30"># Target another host</div>
          <ShellPrompt>
            <span className="text-white">padu ls</span>{" "}
            <span className="text-sky-300/75">--host</span>{" "}
            <span className="text-white/75">devbox:6767</span>
          </ShellPrompt>
        </div>
      </div>
    </div>
  );
}

function ShellPrompt({ children }: { children: React.ReactNode }) {
  return (
    <div className="whitespace-nowrap">
      <span className="select-none text-white/25">$ </span>
      {children}
    </div>
  );
}

function AgentListOutput() {
  return (
    <div className="grid gap-x-5" style={AGENT_LIST_GRID_STYLE}>
      <span className="text-white/30">AGENT</span>
      <span className="text-white/30">STATUS</span>
      <span className="text-white/30">PROVIDER/MODEL</span>
      <span className="text-white/30">TITLE</span>
      <span className="text-white/55">a7f3c2</span>
      <span className="text-purple-300/70">running</span>
      <span className="text-white/55">codex/gpt-5.6-sol</span>
      <span className="text-white/55">Fix issue #412 and add tests.</span>
    </div>
  );
}

function SdkAutomationExample() {
  return (
    <pre className="overflow-x-auto font-mono text-[11px] leading-5 text-white/60">
      <span className="text-purple-300">import</span> {"{"} createPaduClient {"}"}{" "}
      <span className="text-purple-300">from</span>{" "}
      <span className="text-purple-300/80">{'"@padu/client"'}</span>;{"\n\n"}
      <span className="text-purple-300">const</span> client ={" "}
      <span className="text-sky-300">createPaduClient</span>({"{"}
      {"\n"} url: <span className="text-purple-300/80">{'"ws://127.0.0.1:6767/ws"'}</span>,{"\n"}
      {"}"});
      {"\n"}
      <span className="text-purple-300">await</span> client.
      <span className="text-sky-300">connect</span>();
      {"\n\n"}
      <span className="text-purple-300">const</span> agent ={" "}
      <span className="text-purple-300">await</span> client.agents.
      <span className="text-sky-300">create</span>({"{"}
      {"\n"} config: {"{"} provider:{" "}
      <span className="text-purple-300/80">{'"codex/gpt-5.6-sol"'}</span> {"}"},{"\n"} cwd:{" "}
      <span className="text-purple-300/80">{'"/Users/me/dev/padu"'}</span>,{"\n"} prompt:{" "}
      <span className="text-purple-300/80">{'"Fix issue #412 and add tests."'}</span>,{"\n"}
      {"}"});
      {"\n\n"}
      <span className="text-purple-300">const</span> result ={" "}
      <span className="text-purple-300">await</span> agent.
      <span className="text-sky-300">waitForFinish</span>();
    </pre>
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
      description="For headless machines you want to connect to from the Padu apps. The desktop app already includes a built-in daemon"
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
          className="text-white/20"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
        <p className="text-lg text-white/80 text-center">
          When you want to step away from your desk,
          <br className="md:hidden" /> you can.
        </p>
        <p className="text-sm text-white/50 text-center">
          The native mobile app has full feature parity with desktop.
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
      <h2 className="text-3xl font-medium">FAQ</h2>
      <div className="space-y-6">
        <FAQItem question="What is Padu?">
          Padu is a fast, native desktop and web interface for orchestrating local AI coding
          agents. Built in Rust with GPUI (the GPU-accelerated UI engine behind Zed), Padu keeps
          all your projects, sessions, transcripts, and credentials strictly on your machine.
        </FAQItem>
        <FAQItem question="Is Padu free and open source?">
          Yes. Padu is completely free and licensed under the GNU General Public License v3.0
          (GPL-3.0). You only need your own API credentials or subscriptions for the agent
          providers you choose to run.
        </FAQItem>
        <FAQItem question="Does my code leave my machine?">
          No. Padu is 100% local-first. It does not send your code, prompts, files, or agent
          transcripts to any external servers, and includes zero telemetry or tracking. Agents
          communicate directly with their respective provider APIs using credentials already
          configured on your computer.
        </FAQItem>
        <FAQItem question="What agents does Padu support?">
          Padu natively supports Claude Code, OpenAI Codex CLI, Cursor CLI, OpenCode, Pi, Amp, Fx,
          Grok Build, Kimi Code, and any agent implementing the Agent Client Protocol (ACP). See
          the full list in the{" "}
          <a href="/agents" className="underline hover:text-white/80">
            supported providers
          </a>{" "}
          catalog.
        </FAQItem>
        <FAQItem question="How does Padu integrate with coding agents?">
          Padu communicates with your locally installed agent CLIs through their native structured
          protocols and process lifecycles. It does not intercept tokens or modify agent
          behavior—it provides a unified native UI for streaming transcripts, switching models,
          inspecting diffs, and queueing follow-up prompts.
        </FAQItem>
        <FAQItem question="How do Git worktrees and checkpoints work?">
          When starting a task, Padu can run the agent inside an isolated Git worktree so it works
          on a dedicated branch without modifying your main working tree. Padu also tracks
          turn-by-turn checkpoints, allowing you to review diffs and rewind to earlier states.
          See the{" "}
          <a href="/docs/worktrees" className="underline hover:text-white/80">
            worktrees docs
          </a>
          .
        </FAQItem>
        <FAQItem question="What platforms are supported?">
          Padu provides native desktop builds for <strong>macOS</strong> (Apple Silicon & Intel),{" "}
          <strong>Linux</strong> (Wayland & X11), and <strong>Windows</strong> (x86_64), alongside
          a browser client and companion mobile apps.
        </FAQItem>
        <FAQItem question="Can I queue or steer messages while an agent is working?">
          Yes. Padu supports live message queueing and steering, allowing you to send
          follow-up instructions, extra context, or corrections while an agent is actively
          executing a task.
        </FAQItem>
        <FAQItem question="Do I need a separate account or cloud service?">
          No. Padu requires no cloud accounts, logins, or remote services. The desktop app
          automatically manages its local daemon on loopback, and you can also run the daemon
          headless on remote machines or home labs via the CLI.
        </FAQItem>
      </div>
    </motion.div>
  );
}

