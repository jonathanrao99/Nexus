# Nexus

Marketing site for Nexus: Next.js App Router, Tailwind CSS v4, and lightweight WebGL (Three.js) for hero and ambient backgrounds.

## Requirements

- Node.js 20+ (recommended)

## Scripts

| Command | Purpose |
|--------|---------|
| `npm run dev` | Local dev server at [http://localhost:3000](http://localhost:3000) |
| `npm run build` | Production build |
| `npm run start` | Run the production server (after `build`) |
| `npm run lint` | ESLint |
| `npm run extract:html` | Regenerate `lib/home-body-html.ts` and `lib/features-body-html.ts` from `legacy/` HTML |

After editing source HTML under `legacy/`, run `extract:html` so the embedded page bodies stay in sync.

## Project layout

- **`app/`** — Routes: `/`, `/features`, `/architecture`, `/network`, `/pricing`, `/login`, plus global styles and fonts.
- **`components/layout/`** — Shared shell: navigation, footer, marketing page wrapper, ambient backdrop.
- **`components/home/`** — Home page client UI and home hero WebGL.
- **`components/features/`** — Features page client UI.
- **`components/webgl/`** — Shared WebGL helpers and `ThemedWebGLHero` for page variants.
- **`lib/`** — Generated HTML strings, scroll helpers, Lucide polling, etc.
- **`legacy/`** — Original static HTML used as the source for extraction (not served directly).

## Stack

- [Next.js](https://nextjs.org/) 16 · [React](https://react.dev/) 19  
- [Tailwind CSS](https://tailwindcss.com/) 4  
- [Three.js](https://threejs.org/) for canvas effects  
- [Lucide React](https://lucide.dev/) icons (tree-shaken via `experimental.optimizePackageImports` in `next.config.ts`)

## License

MIT — see [LICENSE](./LICENSE).
