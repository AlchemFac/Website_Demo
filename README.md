# Small-business website starter

A minimal Astro + TypeScript starter using plain CSS. **North Texas Home Cleaning is a fictional demonstration business.** All contact details, service areas, hours, and service categories are sample data. This is a scaffold, not a finished website or a real service offering.

## Requirements and local development

Use Node.js 22.23.4 or newer (Node 24 recommended) and npm 9.6.5 or newer.

```sh
npm ci
npm run dev
```

Run commands from the repository root. Open the local address Astro prints. To expose the development server inside a container, use `npm run dev -- --host 0.0.0.0`.

Routes: `/`, `/services/`, `/about/`, `/gallery/`, and `/contact/`.

```sh
npm run build
npm run preview
```

The build generates static HTML and assets in `dist/`. Preview serves that production output locally. No database, authentication, backend, API keys, or environment variables are required. Astro is the only direct dependency; TypeScript uses Astro’s strict configuration. The build compiles the site but is not a standalone TypeScript type-checking command. No automated test suite is included yet.

## Major files

```text
src/
  components/
    SiteHeader.astro      Shared brand and responsive navigation
    SiteFooter.astro      Shared demo disclaimer and service areas
  config/
    business.ts           Business identity, contacts, hours, areas, branding
    navigation.ts         Navigation labels and routes
  layouts/
    BaseLayout.astro      HTML document, metadata, CSS, header, footer, content slot
  pages/
    index.astro           Home placeholder
    services.astro        Sample service categories
    about.astro           Business-story placeholder
    gallery.astro         Photo placeholders (no invented work images)
    contact.astro         Sample contact details and hours; no submission form
  styles/
    global.css            CSS variables, typography, shared layout, responsive rules
public/                   Future static assets copied unchanged to the build
astro.config.mjs          Static-output Astro configuration
tsconfig.json            Strict TypeScript configuration
package.json              Dependency and development/build/preview scripts
package-lock.json         Reproducible npm dependency resolution
.gitignore                Excludes dependencies, build output, and local secrets
```

Brand colors in `business.ts` become CSS variables through `BaseLayout.astro`. Other shared design tokens live in `global.css`. Add reusable UI to `components/`, page content to `pages/`, and shared page structure to `layouts/`. Astro routes follow page filenames.

## Next development stage

Replace and verify the sample business information, write service and about content, and add approved photography. Keep the demo notice while using fictional content. Before a real launch, review contact links, accessibility, metadata, and the demo-only `noindex, nofollow` directive in `BaseLayout.astro`. Setting `isDemo` to false removes the top banner only; also update the explicit demo text in the footer, page content, and document title. No testimonials or business credentials should be added without verified source material.

## Static hosting

Cloudflare Pages and Netlify both support this static output without an adapter:

- Build command: `npm run build`
- Output/publish directory: `dist`
- Node version: 24 (or another release satisfying `package.json`)

Connect the GitHub repository in the chosen hosting service and configure those settings. No deployment has been created by this starter. Add a production `site` URL to `astro.config.mjs` when a real domain is chosen.

Use Git to review changes and commit the source and lockfile; keep `node_modules/` and `dist/` untracked. Future cloud tasks should use the existing isolated checkout rather than creating an additional Git worktree unless explicitly requested.

## Shared design system

`src/styles/global.css` defines color, typography, spacing, border, radius, and layout tokens. Brand colors still come from `src/config/business.ts`. Use `.container` (or `.container.container--narrow`) for content width, `.section` for vertical spacing, `.card`/`.panel` for surfaces, and `.card-grid` for responsive collections.

- `Button.astro`: use `<Button href="/contact/">Contact</Button>` for navigation or `<Button type="submit">Submit</Button>` for actions; `variant="secondary"` provides an outlined style. Native attributes are forwarded.
- `SectionHeading.astro`: accepts `title`, optional `eyebrow`, `description`, `id`, and `level` (`h1`, `h2`, or `h3`; default `h2`). Use one `h1` per page.
- `SiteHeader.astro`: configuration-driven links and brand, current-page indication, and a mobile disclosure button with `aria-expanded`, Escape handling, and focus return. Navigation remains visible without JavaScript.
- `SiteFooter.astro`: configuration-driven business details, hours, areas, and navigation. Demo contact details remain plain text.

Breakpoint reference tokens are `--breakpoint-content: 40rem` and `--breakpoint-nav: 64rem`. Native CSS cannot use custom properties in media conditions: update the documented literal CSS queries and the header’s `matchMedia` query together when changing breakpoints.
