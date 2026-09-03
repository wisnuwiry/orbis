import fs from "node:fs";
import path from "node:path";
import { defineConfig, type UserConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const repoRoot = path.resolve(__dirname, "../..");
const siteHost = "https://padu.dev";

function discoverDocsRoutes(): string[] {
  const docsDir = path.join(repoRoot, "public-docs");
  if (!fs.existsSync(docsDir)) return ["/docs"];
  const routes = new Set<string>(["/docs"]);
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (!entry.name.endsWith(".md")) continue;
      const rel = path
        .relative(docsDir, full)
        .replace(/\.md$/, "")
        .replace(/\/index$/, "");
      if (rel === "index" || rel === "") continue;
      routes.add(`/docs/${rel.split(path.sep).join("/")}`);
    }
  };
  walk(docsDir);
  return [...routes].sort();
}

function discoverAgentRoutes(): string[] {
  const routesDir = path.join(__dirname, "src/routes");
  if (!fs.existsSync(routesDir)) return [];
  const reserved = new Set([
    "__root",
    "agents",
    "changelog",
    "docs",
    "download",
    "index",
    "privacy",
    "terms",
  ]);
  return fs
    .readdirSync(routesDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".tsx"))
    .map((entry) => entry.name.replace(/\.tsx$/, ""))
    .filter((name) => !reserved.has(name))
    .sort()
    .map((slug) => `/${slug}`);
}

const sitemapPages = [
  "/",
  "/agents",
  "/changelog",
  "/download",
  "/privacy",
  "/terms",
  ...discoverAgentRoutes(),
  ...discoverDocsRoutes(),
].map((routePath) => ({
  path: routePath,
}));

function syncMarkdownDocs(): void {
  const docsDir = path.join(repoRoot, "public-docs");
  if (!fs.existsSync(docsDir)) return;
  const publicDir = path.join(__dirname, "public");
  const targetDocsDir = path.join(publicDir, "docs");
  fs.mkdirSync(targetDocsDir, { recursive: true });
  for (const entry of fs.readdirSync(docsDir, { withFileTypes: true })) {
    if (!entry.name.endsWith(".md")) continue;
    const src = path.join(docsDir, entry.name);
    if (entry.name === "index.md") {
      fs.copyFileSync(src, path.join(publicDir, "docs.md"));
    } else {
      fs.copyFileSync(src, path.join(targetDocsDir, entry.name));
    }
  }
}

syncMarkdownDocs();

export default defineConfig((): UserConfig => {
  return {
    server: {
      host: "0.0.0.0",
      port: 3000,
      strictPort: false,
      fs: {
        allow: [repoRoot],
      },
      watch: {
        ignored: ["**/.tanstack/**"],
      },
    },
    plugins: [
      tsConfigPaths(),
      tanstackStart({
        router: {
          quoteStyle: "double",
          semicolons: true,
        },
        prerender: {
          enabled: true,
        },
        pages: sitemapPages,
        sitemap: {
          host: siteHost,
        },
      }),
      react(),
      tailwindcss(),
    ],
  };
});
