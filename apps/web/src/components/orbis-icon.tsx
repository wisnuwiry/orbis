import type { ProviderKind } from '@orbis/client'

export const ORBIS_ICONS = {
  alert: 'i-orbis-alert',
  appearance: 'i-orbis-appearance',
  arrowDown: 'i-orbis-arrow-down',
  arrowLeft: 'i-orbis-arrow-left',
  arrowRight: 'i-orbis-arrow-right',
  arrowUp: 'i-orbis-arrow-up',
  arrowUpRight: 'i-orbis-arrow-up-right',
  bot: 'i-orbis-bot',
  chartColumn: 'i-orbis-chart-column',
  check: 'i-orbis-check',
  chevronDown: 'i-orbis-chevron-down',
  chevronRight: 'i-orbis-chevron-right',
  cloudUpload: 'i-orbis-cloud-upload',
  command: 'i-orbis-command',
  compose: 'i-orbis-compose',
  copy: 'i-orbis-copy',
  cornerDownRight: 'i-orbis-corner-down-right',
  ellipsis: 'i-orbis-ellipsis',
  eye: 'i-orbis-eye',
  eyeOff: 'i-orbis-eye-off',
  file: 'i-orbis-file',
  fileDiff: 'i-orbis-file-diff',
  folder: 'i-orbis-folder',
  folderNew: 'i-orbis-folder-new',
  folderOpen: 'i-orbis-folder-open',
  fork: 'i-orbis-fork',
  gauge: 'i-orbis-gauge',
  gitBranch: 'i-orbis-git-branch',
  gitCommitHorizontal: 'i-orbis-git-commit-horizontal',
  globe: 'i-orbis-globe',
  github: 'i-orbis-github',
  info: 'i-orbis-info',
  laptop: 'i-orbis-laptop',
  list: 'i-orbis-list',
  listFilter: 'i-orbis-list-filter',
  loaderCircle: 'i-orbis-loader-circle',
  lock: 'i-orbis-lock',
  lockOpen: 'i-orbis-lock-open',
  package: 'i-orbis-package',
  paperclip: 'i-orbis-paperclip',
  panelLeft: 'i-orbis-panel-left',
  panelRight: 'i-orbis-panel-right',
  pencil: 'i-orbis-pencil',
  plus: 'i-orbis-plus',
  queue: 'i-orbis-queue',
  rotateCw: 'i-orbis-rotate-cw',
  rewind: 'i-orbis-rewind',
  search: 'i-orbis-search',
  server: 'i-orbis-server',
  settings: 'i-orbis-settings',
  sparkle: 'i-orbis-sparkle',
  star: 'i-orbis-star',
  starFilled: 'i-orbis-star-filled',
  stop: 'i-orbis-stop',
  target: 'i-orbis-target',
  stopFilled: 'i-orbis-stop-filled',
  terminal: 'i-orbis-terminal',
  terminalSquare: 'i-orbis-terminal-square',
  trash: 'i-orbis-trash',
  wrench: 'i-orbis-wrench',
  x: 'i-orbis-x',
  zap: 'i-orbis-zap',
} as const

export type OrbisIconName = keyof typeof ORBIS_ICONS

export function OrbisIcon({
  name,
  className,
  label,
}: {
  name: OrbisIconName
  className?: string
  label?: string
}) {
  return (
    <span
      aria-hidden={label ? undefined : true}
      aria-label={label}
      className={`inline-grid size-4 shrink-0 place-items-center ${className ?? ''}`}
      role={label ? 'img' : undefined}
    >
      <span
        aria-hidden="true"
        className={ORBIS_ICONS[name]}
        style={{ width: '100%', height: '100%' }}
      />
    </span>
  )
}

const FILE_TYPE_ICONS = {
  angular: 'i-orbis-file-type-angular',
  astro: 'i-orbis-file-type-astro',
  audio: 'i-orbis-file-type-audio',
  babel: 'i-orbis-file-type-babel',
  biome: 'i-orbis-file-type-biome',
  bun: 'i-orbis-file-type-bun',
  c: 'i-orbis-file-type-c',
  certificate: 'i-orbis-file-type-certificate',
  clojure: 'i-orbis-file-type-clojure',
  cmake: 'i-orbis-file-type-cmake',
  coffee: 'i-orbis-file-type-coffee',
  console: 'i-orbis-file-type-console',
  cpp: 'i-orbis-file-type-cpp',
  crystal: 'i-orbis-file-type-crystal',
  csharp: 'i-orbis-file-type-csharp',
  css: 'i-orbis-file-type-css',
  dart: 'i-orbis-file-type-dart',
  database: 'i-orbis-file-type-database',
  deno: 'i-orbis-file-type-deno',
  diff: 'i-orbis-file-type-diff',
  docker: 'i-orbis-file-type-docker',
  editorconfig: 'i-orbis-file-type-editorconfig',
  elixir: 'i-orbis-file-type-elixir',
  elm: 'i-orbis-file-type-elm',
  erlang: 'i-orbis-file-type-erlang',
  eslint: 'i-orbis-file-type-eslint',
  exe: 'i-orbis-file-type-exe',
  file: 'i-orbis-file-type-file',
  firebase: 'i-orbis-file-type-firebase',
  git: 'i-orbis-file-type-git',
  gitlab: 'i-orbis-file-type-gitlab',
  go: 'i-orbis-file-type-go',
  gradle: 'i-orbis-file-type-gradle',
  graphql: 'i-orbis-file-type-graphql',
  haskell: 'i-orbis-file-type-haskell',
  haxe: 'i-orbis-file-type-haxe',
  helm: 'i-orbis-file-type-helm',
  html: 'i-orbis-file-type-html',
  image: 'i-orbis-file-type-image',
  java: 'i-orbis-file-type-java',
  javascript: 'i-orbis-file-type-javascript',
  jinja: 'i-orbis-file-type-jinja',
  json: 'i-orbis-file-type-json',
  julia: 'i-orbis-file-type-julia',
  kotlin: 'i-orbis-file-type-kotlin',
  kubernetes: 'i-orbis-file-type-kubernetes',
  lock: 'i-orbis-file-type-lock',
  lua: 'i-orbis-file-type-lua',
  makefile: 'i-orbis-file-type-makefile',
  markdown: 'i-orbis-file-type-markdown',
  nest: 'i-orbis-file-type-nest',
  next: 'i-orbis-file-type-next',
  nginx: 'i-orbis-file-type-nginx',
  nix: 'i-orbis-file-type-nix',
  nodejs: 'i-orbis-file-type-nodejs',
  npm: 'i-orbis-file-type-npm',
  nuxt: 'i-orbis-file-type-nuxt',
  ocaml: 'i-orbis-file-type-ocaml',
  pdf: 'i-orbis-file-type-pdf',
  perl: 'i-orbis-file-type-perl',
  php: 'i-orbis-file-type-php',
  pnpm: 'i-orbis-file-type-pnpm',
  powershell: 'i-orbis-file-type-powershell',
  prettier: 'i-orbis-file-type-prettier',
  prisma: 'i-orbis-file-type-prisma',
  proto: 'i-orbis-file-type-proto',
  pug: 'i-orbis-file-type-pug',
  python: 'i-orbis-file-type-python',
  react: 'i-orbis-file-type-react',
  readme: 'i-orbis-file-type-readme',
  rollup: 'i-orbis-file-type-rollup',
  ruby: 'i-orbis-file-type-ruby',
  rust: 'i-orbis-file-type-rust',
  sass: 'i-orbis-file-type-sass',
  scala: 'i-orbis-file-type-scala',
  settings: 'i-orbis-file-type-settings',
  solidity: 'i-orbis-file-type-solidity',
  storybook: 'i-orbis-file-type-storybook',
  stylelint: 'i-orbis-file-type-stylelint',
  supabase: 'i-orbis-file-type-supabase',
  svelte: 'i-orbis-file-type-svelte',
  svg: 'i-orbis-file-type-svg',
  swift: 'i-orbis-file-type-swift',
  tailwindcss: 'i-orbis-file-type-tailwindcss',
  terraform: 'i-orbis-file-type-terraform',
  tex: 'i-orbis-file-type-tex',
  turborepo: 'i-orbis-file-type-turborepo',
  typescript: 'i-orbis-file-type-typescript',
  video: 'i-orbis-file-type-video',
  vite: 'i-orbis-file-type-vite',
  vitest: 'i-orbis-file-type-vitest',
  vue: 'i-orbis-file-type-vue',
  webassembly: 'i-orbis-file-type-webassembly',
  webpack: 'i-orbis-file-type-webpack',
  xaml: 'i-orbis-file-type-xaml',
  xml: 'i-orbis-file-type-xml',
  yaml: 'i-orbis-file-type-yaml',
  yarn: 'i-orbis-file-type-yarn',
  zig: 'i-orbis-file-type-zig',
  zip: 'i-orbis-file-type-zip',
} as const

type FileTypeIconName = keyof typeof FILE_TYPE_ICONS

export function FileTypeIcon({
  path,
  className,
}: {
  path: string
  className?: string
}) {
  const name = fileTypeIconName(path)
  return (
    <span
      aria-hidden="true"
      className={`inline-grid size-4 shrink-0 place-items-center ${className ?? ''}`}
    >
      <span className={FILE_TYPE_ICONS[name]} style={{ width: '100%', height: '100%' }} />
    </span>
  )
}

function fileTypeIconName(path: string): FileTypeIconName {
  const name = path.split(/[\\/]/).at(-1)?.toLocaleLowerCase() ?? path.toLocaleLowerCase()
  if (name.startsWith('readme')) return 'readme'
  if (/^(license|licence|copying)/.test(name)) return 'certificate'
  if (name.startsWith('dockerfile') || name.startsWith('compose.')) return 'docker'
  if (name === 'cmakelists.txt' || name.startsWith('cmake.')) return 'cmake'
  if (name === 'makefile' || name.startsWith('makefile.') || name === 'justfile') return 'makefile'
  if (['cargo.toml', 'cargo.lock', 'rust-toolchain.toml'].includes(name)) return 'rust'
  if (['go.mod', 'go.sum', 'go.work'].includes(name)) return 'go'
  if (name === 'pyproject.toml' || name === 'pipfile' || name.startsWith('requirements')) return 'python'
  if (['bun.lock', 'bun.lockb', 'bunfig.toml'].includes(name)) return 'bun'
  if (name.startsWith('pnpm-') || name === '.pnpmfile.cjs') return 'pnpm'
  if (name === 'yarn.lock' || name.startsWith('.yarnrc')) return 'yarn'
  if (name === 'package.json') return 'nodejs'
  if (name === 'package-lock.json') return 'npm'
  if (name === 'tsconfig.json' || name.startsWith('tsconfig.')) return 'typescript'
  if (name === 'jsconfig.json' || name.startsWith('jsconfig.')) return 'javascript'
  if (['.gitignore', '.gitattributes', '.gitmodules', '.gitconfig'].includes(name)) return 'git'
  if (name === '.editorconfig') return 'editorconfig'
  if (name.startsWith('.env')) return 'settings'
  if (name.startsWith('.prettier') || name.startsWith('prettier.config.')) return 'prettier'
  if (name.startsWith('.eslint') || name.startsWith('eslint.config.')) return 'eslint'
  if (name.startsWith('biome.json')) return 'biome'
  if (name.startsWith('.babel') || name.startsWith('babel.config.')) return 'babel'
  if (name.startsWith('.stylelint') || name.startsWith('stylelint.config.')) return 'stylelint'
  if (name.startsWith('vite.config.')) return 'vite'
  if (name.startsWith('vitest.config.') || name.startsWith('vitest.workspace.')) return 'vitest'
  if (name.startsWith('webpack.')) return 'webpack'
  if (name.startsWith('rollup.config.')) return 'rollup'
  if (name.startsWith('next.config.') || name === 'next-env.d.ts') return 'next'
  if (name.startsWith('nuxt.config.') || name === '.nuxtrc') return 'nuxt'
  if (name.startsWith('astro.config.')) return 'astro'
  if (name === 'angular.json' || name.endsWith('.component.ts')) return 'angular'
  if (name === 'nest-cli.json') return 'nest'
  if (name.startsWith('tailwind.config.')) return 'tailwindcss'
  if (name.startsWith('svelte.config.')) return 'svelte'
  if (name.startsWith('vue.config.')) return 'vue'
  if (name === 'firebase.json' || name === '.firebaserc') return 'firebase'
  if (name === 'supabase.toml') return 'supabase'
  if (name.startsWith('prisma.config.')) return 'prisma'
  if (name === 'turbo.json') return 'turborepo'
  if (name.startsWith('deno.json') || name === 'deno.lock') return 'deno'
  if (name === '.gitlab-ci.yml' || name === '.gitlab-ci.yaml') return 'gitlab'
  if (name === 'kustomization.yaml' || name === 'kustomization.yml') return 'kubernetes'
  if (name === 'chart.yaml' || name === 'values.yaml') return 'helm'
  if (name === 'nginx.conf') return 'nginx'
  if (name === '.nvmrc' || name === '.node-version') return 'nodejs'
  if (['build.gradle', 'settings.gradle', 'gradlew', 'gradlew.bat'].includes(name)) return 'gradle'
  if (name.includes('.stories.') || name.includes('.story.')) return 'storybook'
  if (name === 'gemfile' || name === 'gemfile.lock') return 'ruby'
  if (name === 'pom.xml') return 'java'

  const extension = name.includes('.') ? name.split('.').at(-1) ?? '' : ''
  if (extension === 'rs') return 'rust'
  if (['js', 'mjs', 'cjs'].includes(extension)) return 'javascript'
  if (['ts', 'mts', 'cts'].includes(extension)) return 'typescript'
  if (['jsx', 'tsx'].includes(extension)) return 'react'
  if (['py', 'pyi', 'pyw'].includes(extension)) return 'python'
  if (extension === 'go') return 'go'
  if (['c', 'h', 'm'].includes(extension)) return 'c'
  if (['cc', 'cpp', 'cxx', 'hh', 'hpp', 'hxx', 'mm'].includes(extension)) return 'cpp'
  if (extension === 'cs') return 'csharp'
  if (extension === 'swift') return 'swift'
  if (['kt', 'kts'].includes(extension)) return 'kotlin'
  if (['java', 'class'].includes(extension)) return 'java'
  if (extension === 'rb') return 'ruby'
  if (extension === 'php') return 'php'
  if (['html', 'htm'].includes(extension)) return 'html'
  if (['css', 'less'].includes(extension)) return 'css'
  if (['scss', 'sass'].includes(extension)) return 'sass'
  if (['json', 'jsonc', 'jsonl'].includes(extension)) return 'json'
  if (['yaml', 'yml'].includes(extension)) return 'yaml'
  if (['toml', 'ini', 'cfg', 'conf', 'config'].includes(extension)) return 'settings'
  if (['xml', 'xsl', 'plist'].includes(extension)) return 'xml'
  if (['md', 'mdx', 'markdown'].includes(extension)) return 'markdown'
  if (['sh', 'bash', 'zsh', 'fish'].includes(extension)) return 'console'
  if (['ps1', 'psm1'].includes(extension)) return 'powershell'
  if (['sql', 'db', 'sqlite', 'sqlite3', 'csv', 'xls', 'xlsx'].includes(extension)) return 'database'
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'avif', 'ico', 'tiff'].includes(extension)) return 'image'
  if (extension === 'svg') return 'svg'
  if (extension === 'pdf') return 'pdf'
  if (['mp3', 'wav', 'flac', 'ogg', 'm4a'].includes(extension)) return 'audio'
  if (['mp4', 'mov', 'avi', 'webm', 'mkv'].includes(extension)) return 'video'
  if (['zip', 'gz', 'tgz', 'bz2', 'xz', '7z', 'rar', 'tar', 'jar'].includes(extension)) return 'zip'
  if (['wasm', 'wat'].includes(extension)) return 'webassembly'
  if (['svelte', 'vue', 'lua', 'dart', 'astro', 'prisma', 'xaml', 'zig', 'nix', 'proto'].includes(extension)) return extension as FileTypeIconName
  if (['tf', 'tfvars'].includes(extension)) return 'terraform'
  if (['graphql', 'gql'].includes(extension)) return 'graphql'
  if (['coffee', 'cson'].includes(extension)) return 'coffee'
  if (extension === 'cr') return 'crystal'
  if (['ex', 'exs'].includes(extension)) return 'elixir'
  if (extension === 'elm') return 'elm'
  if (['erl', 'hrl'].includes(extension)) return 'erlang'
  if (['clj', 'cljs', 'cljc', 'edn'].includes(extension)) return 'clojure'
  if (['hs', 'lhs'].includes(extension)) return 'haskell'
  if (['hx', 'hxml'].includes(extension)) return 'haxe'
  if (['jinja', 'jinja2', 'j2'].includes(extension)) return 'jinja'
  if (extension === 'jl') return 'julia'
  if (['ml', 'mli'].includes(extension)) return 'ocaml'
  if (['pl', 'pm'].includes(extension)) return 'perl'
  if (['pug', 'jade'].includes(extension)) return 'pug'
  if (['scala', 'sbt', 'sc'].includes(extension)) return 'scala'
  if (extension === 'sol') return 'solidity'
  if (['tex', 'sty', 'cls'].includes(extension)) return 'tex'
  if (['diff', 'patch'].includes(extension)) return 'diff'
  if (['exe', 'dll', 'so', 'dylib'].includes(extension)) return 'exe'
  if (extension === 'lock') return 'lock'
  return 'file'
}

const PROVIDER_ICONS: Record<ProviderKind, string> = {
  amp: 'i-orbis-provider-amp',
  claude: 'i-orbis-provider-claude',
  codex: 'i-orbis-provider-openai',
  cursor: 'i-orbis-provider-cursor',
  deepSeek: 'i-orbis-provider-deepseek',
  fx: 'i-orbis-provider-fx',
  openCode: 'i-orbis-provider-opencode',
  grok: 'i-orbis-provider-grok',
  kimi: 'i-orbis-provider-kimi',
  ohMyPi: 'i-orbis-provider-ohmypi',
  pi: 'i-orbis-provider-pi',
}

export const PROVIDERS: Array<{
  id: ProviderKind
  name: string
  shortName: string
  command: string
}> = [
  { id: 'amp', name: 'Amp', shortName: 'Amp', command: 'amp' },
  { id: 'claude', name: 'Claude Code', shortName: 'Claude', command: 'claude' },
  { id: 'codex', name: 'Codex CLI', shortName: 'Codex', command: 'codex' },
  { id: 'cursor', name: 'Cursor CLI', shortName: 'Cursor', command: 'cursor-agent' },
  { id: 'deepSeek', name: 'DeepSeek Harness', shortName: 'DeepSeek', command: 'dsh' },
  { id: 'fx', name: 'Fx', shortName: 'Fx', command: 'fx' },
  { id: 'openCode', name: 'OpenCode', shortName: 'OpenCode', command: 'opencode' },
  { id: 'grok', name: 'Grok Build', shortName: 'Grok', command: 'grok' },
  { id: 'kimi', name: 'Kimi Code', shortName: 'Kimi', command: 'kimi' },
  { id: 'ohMyPi', name: 'Oh My Pi', shortName: 'Oh My Pi', command: 'omp' },
  { id: 'pi', name: 'Pi', shortName: 'Pi', command: 'pi' },
]

export function providerMeta(provider: ProviderKind) {
  return PROVIDERS.find((candidate) => candidate.id === provider) ?? PROVIDERS[2]!
}

export function ProviderIcon({
  provider,
  className,
  label,
}: {
  provider: ProviderKind
  className?: string
  label?: string
}) {
  return (
    <span
      aria-hidden={label ? undefined : true}
      aria-label={label}
      className={`inline-grid size-4 shrink-0 place-items-center ${providerColor(provider)} ${className ?? ''}`}
      role={label ? 'img' : undefined}
    >
      <span
        aria-hidden="true"
        className={PROVIDER_ICONS[provider]}
        style={{ width: '100%', height: '100%' }}
      />
    </span>
  )
}

function providerColor(provider: ProviderKind) {
  if (provider === 'amp') return 'text-[#f34e3f]'
  if (provider === 'claude') return 'text-[#d97757]'
  if (provider === 'deepSeek') return 'text-[#4d6bfe]'
  return 'text-[#34363b] dark:text-[#f3f3f3]'
}
