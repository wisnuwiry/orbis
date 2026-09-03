#!/usr/bin/env bun

import { existsSync } from "node:fs";
import { lstat, readdir, rm, stat } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import { parseArgs } from "node:util";

const projectRoot = resolve(import.meta.dir, "..");

const useColor =
  Boolean(process.stdout.isTTY) &&
  !process.env.NO_COLOR &&
  process.env.TERM !== "dumb";

const c = {
  reset: useColor ? "\x1b[0m" : "",
  bold: useColor ? "\x1b[1m" : "",
  dim: useColor ? "\x1b[2m" : "",
  green: useColor ? "\x1b[32m" : "",
  yellow: useColor ? "\x1b[33m" : "",
  blue: useColor ? "\x1b[34m" : "",
  magenta: useColor ? "\x1b[35m" : "",
  cyan: useColor ? "\x1b[36m" : "",
  red: useColor ? "\x1b[31m" : "",
};

const help = `Padu Workspace Cache Cleaner

Usage:
  bun run clean [options]
  bun clean [options]

By default, cleans Cargo target caches, Web & Landing build/Wrangler/Vite caches,
Mobile Expo caches, Padu local development caches, and workspace bundler caches.

Options:
  -a, --all, --deep     Deep clean: also removes all node_modules and clears Bun PM cache
  -c, --cargo, --rust   Clean only Cargo build artifacts (cargo clean & target/)
      --sccache         Zero sccache statistics and stop local daemon
      --desktop         Clean Desktop app and local Padu caches
  -w, --web             Clean only Web app caches (apps/web)
  -l, --landing         Clean only Landing app caches (apps/landing)
  -m, --mobile          Clean only Mobile app caches (apps/mobile)
      --padu            Clean only local Padu dev caches (.padu-cache, temp)
      --pm-cache        Clear global Bun package manager cache
  -n, --dry-run         Show paths and estimated sizes without deleting
  -h, --help            Show this help message

Examples:
  bun run clean                  # Clean all project and app caches
  bun run clean --dry-run        # Preview what will be cleaned
  bun run clean --cargo          # Clean only Cargo target cache
  bun run clean --sccache        # Reset sccache stats and daemon
  bun run clean --web            # Clean only Web app cache
  bun run clean --all            # Deep clean including node_modules
`;

const { values } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    all: { type: "boolean", short: "a", default: false },
    deep: { type: "boolean", default: false },
    cargo: { type: "boolean", short: "c", default: false },
    rust: { type: "boolean", default: false },
    sccache: { type: "boolean", default: false },
    desktop: { type: "boolean", default: false },
    web: { type: "boolean", short: "w", default: false },
    landing: { type: "boolean", short: "l", default: false },
    mobile: { type: "boolean", short: "m", default: false },
    padu: { type: "boolean", default: false },
    "pm-cache": { type: "boolean", default: false },
    "dry-run": { type: "boolean", short: "n", default: false },
    help: { type: "boolean", short: "h", default: false },
  },
  strict: false,
  allowPositionals: true,
});

if (values.help) {
  console.log(help);
  process.exit(0);
}

const isDryRun = Boolean(values["dry-run"]);
const isDeep = Boolean(values.all || values.deep);
const isPmCacheRequested = Boolean(values["pm-cache"]);

const hasSelectiveFilter = Boolean(
  values.cargo ||
    values.rust ||
    values.sccache ||
    values.desktop ||
    values.web ||
    values.landing ||
    values.mobile ||
    values.padu ||
    isPmCacheRequested,
);

const shouldCleanCargo =
  isDeep ||
  (!hasSelectiveFilter && !isPmCacheRequested) ||
  Boolean(values.cargo || values.rust || values.desktop);

const shouldCleanWeb =
  isDeep ||
  (!hasSelectiveFilter && !isPmCacheRequested) ||
  Boolean(values.web);

const shouldCleanLanding =
  isDeep ||
  (!hasSelectiveFilter && !isPmCacheRequested) ||
  Boolean(values.landing);

const shouldCleanMobile =
  isDeep ||
  (!hasSelectiveFilter && !isPmCacheRequested) ||
  Boolean(values.mobile);

const shouldCleanPadu =
  isDeep ||
  (!hasSelectiveFilter && !isPmCacheRequested) ||
  Boolean(values.padu || values.desktop);

const shouldCleanBundler =
  isDeep || (!hasSelectiveFilter && !isPmCacheRequested);

const shouldCleanNodeModules = isDeep;
const shouldCleanBunPmCache = isDeep || isPmCacheRequested;

function formatBytes(bytes: number): string {
  if (bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const val = bytes / Math.pow(1024, i);
  return `${val.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

async function getPathSize(targetPath: string): Promise<number> {
  if (!existsSync(targetPath)) return 0;

  try {
    const meta = await lstat(targetPath);
    if (meta.isFile() || meta.isSymbolicLink()) {
      return meta.size;
    }
  } catch {
    return 0;
  }

  // Fast path on Unix systems: du -sk
  if (process.platform !== "win32") {
    try {
      const proc = Bun.spawn(["du", "-sk", targetPath], {
        stdout: "pipe",
        stderr: "ignore",
      });
      const output = await new Response(proc.stdout).text();
      const match = output.trim().match(/^(\d+)/);
      if (match) {
        return parseInt(match[1], 10) * 1024;
      }
    } catch {
      // Fallback below
    }
  }

  try {
    let totalSize = 0;
    const entries = await readdir(targetPath, {
      withFileTypes: true,
      recursive: true,
    });
    for (const entry of entries) {
      if (entry.isFile()) {
        try {
          const parent = entry.parentPath || targetPath;
          const s = await stat(join(parent, entry.name));
          totalSize += s.size;
        } catch {
          // Ignore transient file errors
        }
      }
    }
    return totalSize;
  } catch {
    return 0;
  }
}

type CleanItemResult = {
  label: string;
  bytes: number;
  status: "cleaned" | "would_clean" | "skipped" | "error";
  error?: string;
};

type CleanSection = {
  title: string;
  items: Array<{
    label: string;
    path?: string;
    action?: () => Promise<void>;
  }>;
};

const startTime = performance.now();
let totalBytesReclaimed = 0;
let itemsProcessed = 0;

console.log(
  `\n${c.bold}${c.cyan}🧹 Padu Workspace Cache Cleaner${c.reset} ${
    isDryRun ? `${c.yellow}(dry-run preview)${c.reset}` : ""
  }`,
);
if (isDeep) {
  console.log(
    `${c.dim}Mode: Deep clean (including node_modules and package manager cache)${c.reset}\n`,
  );
} else {
  console.log(`${c.dim}Project root: ${projectRoot}${c.reset}\n`);
}

const sections: CleanSection[] = [];

// 1. Cargo / Rust
if (shouldCleanCargo) {
  const cargoTargetDir = resolve(
    projectRoot,
    process.env.CARGO_TARGET_DIR || "target",
  );
  sections.push({
    title: "Cargo & Rust Workspace",
    items: [
      {
        label: "cargo clean (target/)",
        path: cargoTargetDir,
        action: async () => {
          const proc = Bun.spawn(["cargo", "clean"], {
            cwd: projectRoot,
            stdout: "ignore",
            stderr: "pipe",
          });
          const exitCode = await proc.exited;
          if (exitCode !== 0) {
            const err = await new Response(proc.stderr).text();
            throw new Error(err.trim() || `cargo clean failed with code ${exitCode}`);
          }
          // Ensure target directory is removed if cargo clean leaves empty structure
          if (existsSync(cargoTargetDir)) {
            await rm(cargoTargetDir, { recursive: true, force: true });
          }
        },
      },
    ],
  });
}

// 1b. Sccache
if (values.sccache) {
  const sccacheBin = Bun.which("sccache");
  if (sccacheBin) {
    sections.push({
      title: "Sccache Compiler Cache",
      items: [
        {
          label: "sccache (stop daemon & zero stats)",
          path: sccacheBin,
          action: async () => {
            const stopProc = Bun.spawn(["sccache", "--stop-server"], {
              stdout: "ignore",
              stderr: "ignore",
            });
            await stopProc.exited;
            const zeroProc = Bun.spawn(["sccache", "--zero-stats"], {
              stdout: "ignore",
              stderr: "ignore",
            });
            await zeroProc.exited;
          },
        },
      ],
    });
  } else {
    console.warn("[clean] sccache binary not found on PATH; skipping sccache clean.");
  }
}

// 2. Web App
if (shouldCleanWeb) {
  sections.push({
    title: "Web App (@padu/web)",
    items: [
      {
        label: "apps/web/dist",
        path: join(projectRoot, "apps/web/dist"),
      },
      {
        label: "apps/web/.wrangler",
        path: join(projectRoot, "apps/web/.wrangler"),
      },
      {
        label: "apps/web/.vite",
        path: join(projectRoot, "apps/web/.vite"),
      },
      {
        label: "apps/web/node_modules/.cache",
        path: join(projectRoot, "apps/web/node_modules/.cache"),
      },
    ],
  });
}

// 3. Landing App
if (shouldCleanLanding) {
  sections.push({
    title: "Landing App (@padu/landing)",
    items: [
      {
        label: "apps/landing/dist",
        path: join(projectRoot, "apps/landing/dist"),
      },
      {
        label: "apps/landing/.wrangler",
        path: join(projectRoot, "apps/landing/.wrangler"),
      },
      {
        label: "apps/landing/.vite",
        path: join(projectRoot, "apps/landing/.vite"),
      },
      {
        label: "apps/landing/node_modules/.cache",
        path: join(projectRoot, "apps/landing/node_modules/.cache"),
      },
    ],
  });
}

// 4. Mobile App
if (shouldCleanMobile) {
  sections.push({
    title: "Mobile App (@padu/mobile)",
    items: [
      {
        label: "apps/mobile/.expo",
        path: join(projectRoot, "apps/mobile/.expo"),
      },
      {
        label: "apps/mobile/dist",
        path: join(projectRoot, "apps/mobile/dist"),
      },
      {
        label: "apps/mobile/node_modules/.cache",
        path: join(projectRoot, "apps/mobile/node_modules/.cache"),
      },
    ],
  });
}

// 5. Padu Dev & Local State
if (shouldCleanPadu) {
  sections.push({
    title: "Padu Local Dev Cache",
    items: [
      {
        label: ".padu-cache",
        path: join(projectRoot, ".padu-cache"),
      },
      {
        label: "temp/",
        path: join(projectRoot, "temp"),
      },
    ],
  });
}

// 6. Bundler & Workspace Shared Tooling
if (shouldCleanBundler) {
  sections.push({
    title: "Workspace Bundler & Shared Tooling",
    items: [
      {
        label: "node_modules/.cache",
        path: join(projectRoot, "node_modules/.cache"),
      },
      {
        label: "node_modules/.vite",
        path: join(projectRoot, "node_modules/.vite"),
      },
      {
        label: "packages/padu-client/dist",
        path: join(projectRoot, "packages/padu-client/dist"),
      },
      {
        label: "dist/ (workspace root)",
        path: join(projectRoot, "dist"),
      },
    ],
  });
}

// 7. Deep Clean: node_modules & Bun PM Cache
if (shouldCleanNodeModules) {
  sections.push({
    title: "Dependencies (node_modules)",
    items: [
      {
        label: "node_modules (root)",
        path: join(projectRoot, "node_modules"),
      },
      {
        label: "apps/web/node_modules",
        path: join(projectRoot, "apps/web/node_modules"),
      },
      {
        label: "apps/landing/node_modules",
        path: join(projectRoot, "apps/landing/node_modules"),
      },
      {
        label: "apps/mobile/node_modules",
        path: join(projectRoot, "apps/mobile/node_modules"),
      },
      {
        label: "packages/padu-client/node_modules",
        path: join(projectRoot, "packages/padu-client/node_modules"),
      },
    ],
  });
}

if (shouldCleanBunPmCache) {
  const bunCacheProc = Bun.spawnSync(["bun", "pm", "cache"], {
    stdout: "pipe",
    stderr: "ignore",
  });
  const bunCachePath = bunCacheProc.stdout.toString().trim();

  sections.push({
    title: "Bun Package Manager Cache",
    items: [
      {
        label: `bun pm cache (${bunCachePath || "global"})`,
        path: bunCachePath || undefined,
        action: async () => {
          const proc = Bun.spawn(["bun", "pm", "cache", "rm"], {
            stdout: "ignore",
            stderr: "pipe",
          });
          const exitCode = await proc.exited;
          if (exitCode !== 0) {
            const err = await new Response(proc.stderr).text();
            throw new Error(err.trim() || `bun pm cache rm failed`);
          }
        },
      },
    ],
  });
}

for (const section of sections) {
  console.log(`${c.bold}${c.blue}▸ ${section.title}${c.reset}`);

  for (const item of section.items) {
    let bytes = 0;
    if (item.path && existsSync(item.path)) {
      bytes = await getPathSize(item.path);
    }

    if (!item.path && !item.action) {
      continue;
    }

    const exists = item.path ? existsSync(item.path) : true;

    if (!exists && !item.action) {
      console.log(
        `  ${c.dim}– ${item.label.padEnd(38)} ${c.dim}not present${c.reset}`,
      );
      continue;
    }

    itemsProcessed++;

    if (isDryRun) {
      if (bytes > 0 || !item.path) {
        console.log(
          `  ${c.yellow}○${c.reset} ${item.label.padEnd(38)} ${c.dim}would free${c.reset} ${formatBytes(bytes)}`,
        );
        totalBytesReclaimed += bytes;
      } else {
        console.log(
          `  ${c.dim}– ${item.label.padEnd(38)} ${c.dim}empty${c.reset}`,
        );
      }
      continue;
    }

    try {
      if (item.action) {
        await item.action();
      } else if (item.path && exists) {
        await rm(item.path, { recursive: true, force: true });
      }

      totalBytesReclaimed += bytes;

      if (bytes > 0) {
        console.log(
          `  ${c.green}✔${c.reset} ${item.label.padEnd(38)} ${c.green}${formatBytes(bytes)}${c.reset}`,
        );
      } else {
        console.log(
          `  ${c.green}✔${c.reset} ${item.label.padEnd(38)} ${c.dim}cleaned${c.reset}`,
        );
      }
    } catch (error) {
      console.error(
        `  ${c.red}✖${c.reset} ${item.label.padEnd(38)} ${c.red}Failed: ${(error as Error).message}${c.reset}`,
      );
    }
  }

  console.log();
}

const duration = ((performance.now() - startTime) / 1000).toFixed(2);

console.log(`${c.bold}${"─".repeat(56)}${c.reset}`);
if (isDryRun) {
  console.log(
    `${c.bold}${c.yellow}✨ Dry run finished:${c.reset} ${formatBytes(totalBytesReclaimed)} eligible for cleanup across ${itemsProcessed} targets in ${duration}s`,
  );
  console.log(
    `${c.dim}Run without --dry-run to permanently clean cache.${c.reset}\n`,
  );
} else if (totalBytesReclaimed > 0) {
  console.log(
    `${c.bold}${c.green}✨ Cache clean complete!${c.reset} Reclaimed ${c.bold}${c.green}${formatBytes(totalBytesReclaimed)}${c.reset} in ${duration}s\n`,
  );
} else {
  console.log(
    `${c.bold}${c.green}✨ Workspace is clean!${c.reset} All caches are already empty in ${duration}s\n`,
  );
}
