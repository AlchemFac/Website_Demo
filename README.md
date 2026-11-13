# Small-business website template — Astro

A reusable static website with three-page Starter and five-page Business packages with responsive components, a configurable
brand, optimized gallery images, and an optional Formspree contact integration.
**The included North Texas Home Cleaning business is fictional.** Names, contacts,
hours, services, cities, and business copy are demonstration content. Images are
clearly labeled generated interiors, not customer work.

**Deployment status:** prepared for Cloudflare Pages, not deployed by this setup.
No domain or DNS changes have been made. A real client launch still requires the
[launch checklist](docs/LAUNCH_CHECKLIST.md) and owner approval.

## Start here

- [CLIENT_SETUP.md](CLIENT_SETUP.md) — adapt the site for a second business, including
  name, logo, colors, services, photos, areas, metadata, and form destination.
- [Cloudflare Pages deployment](docs/CLOUDFLARE_PAGES.md) — GitHub connection, exact
  build settings, preview/production variables, custom domain, HTTPS, and rollback.
- [Launch checklist](docs/LAUNCH_CHECKLIST.md) — approval gates and manual checks.
- [Contact integration](docs/contact-integration.md) — provider account setup and
  delivery verification. Local delivery was previously owner-verified; a future
  production hostname must be tested separately.
- [Production readiness review](docs/production-readiness.md) — historical findings,
  automated checks, and manual accessibility/privacy work still needed.

## Local development

Use **Node.js 24** and npm; `.nvmrc` records the Node major version. Open the
repository folder in VS Code, then run:

```sh
npm ci
npm run dev
```

Visit the local address printed by Astro (normally `http://localhost:4321/`).
Stop with **Ctrl+C**. For a container-only preview, add `-- --host 0.0.0.0`.
The unconfigured demo needs no backend or credentials. To enable test inquiries,
copy `.env.example` to ignored `.env.local`, set both public form identifiers, save,
and restart the server. Never copy another client's environment file.

## Build and test

```sh
npm run build
npm run preview
```

`astro.config.mjs` uses `output: 'static'` and trailing-slash routes. Build artifacts
are in **`dist`**, including optimized images, `404.html`, and `robots.txt`.
A sitemap is generated only when a valid final domain, indexing approval, and a
non-demo business are all configured. No Cloudflare adapter, Pages Functions,
database, Workers runtime, Wrangler file, or API token is needed for this build.

| Command                   | Purpose                                                                        |
| ------------------------- | ------------------------------------------------------------------------------ |
| `npm run dev`             | Development server                                                             |
| `npm run format`          | Apply Prettier/Astro formatting                                                |
| `npm run format:check`    | Check formatting without edits                                                 |
| `npm run check`           | Astro/TypeScript diagnostics                                                   |
| `npm run test:seo`        | Domain, robots, and sitemap helper tests                                       |
| `npm test`                | Isolated demo build and Chromium site tests                                    |
| `npm run test:packages`   | Both package builds, navigation, output exclusion, sitemaps, and mobile checks |
| `npm run test:submission` | Isolated configured-form build with provider requests intercepted              |
| `npm run verify`          | Formatting, types, SEO tests, build, and both browser suites                   |

For the full verification suite, install the test browser once:

```sh
npx playwright install chromium
npm run verify
```

Ports 4322/4323 must be available for browser tests. Tests explicitly override live
form settings and never send real inquiries. Their ignored output folders are
`.site-test-dist` and `.submission-test-dist`; **deploy only `dist`**. These fixtures
do not replace the normal build. A system Chromium can be selected with
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. Cloud environments with unwritable telemetry
directories can set `ASTRO_TELEMETRY_DISABLED=1`.

## Production settings at a glance

The [Cloudflare guide](docs/CLOUDFLARE_PAGES.md) documents the approval steps and
production/preview differences. Do not connect hosting or trigger a deployment
without owner approval: a connected Git repository can deploy automatically.

| Pages setting          | Value for this repository                                       |
| ---------------------- | --------------------------------------------------------------- |
| Framework              | Astro                                                           |
| Production branch      | `main`                                                          |
| Root directory         | Repository root; leave blank when `package.json` is at the root |
| Build command          | `npm run build`                                                 |
| Build output directory | `dist`                                                          |
| Node                   | `24`, from `.nvmrc` or `NODE_VERSION=24`                        |

Cloudflare installs dependencies before the build. Commit `package-lock.json`.
GitHub Actions runs `npm run verify`; Cloudflare's build alone does **not** wait
for GitHub checks. Require checks on `main` or use an explicitly approved manual
release process before allowing automatic production deployments.

## Build-time variables

Configure production and preview independently in the hosting dashboard; local
`.env.local` is not uploaded through Git.

| Variable                    | Default / purpose                                                           |
| --------------------------- | --------------------------------------------------------------------------- |
| `SITE_URL`                  | Blank until a final root HTTPS domain is approved; then used for canonicals |
| `ALLOW_INDEXING`            | `false`; `true` only after launch approval and `business.isDemo=false`      |
| `PUBLIC_FORMSPREE_FORM_ID`  | Public form ID, not a private API key; blank for demo                       |
| `PUBLIC_TURNSTILE_SITE_KEY` | Public widget key; configure together with the form ID                      |

The Turnstile **secret** belongs only in Formspree's dashboard. The displayed
`business.email` is not the form recipient setting. Environment changes require
a new static build and deployment to affect the hosted site.

## Website packages

Set `WEBSITE_PACKAGE=starter` in ignored `.env.local` for Home, Services, and Contact.
Use `business` or leave it unset to keep all five demo content pages. The shared 404
is always generated. Restart development / rebuild after changing the setting.
Header, footer, and sitemap follow the selected preset; disabled About/Gallery
pages are omitted from static output. See [client setup](CLIENT_SETUP.md#choose-starter-or-business).

## Project map

```text
CLIENT_SETUP.md               Client-by-client customization guide
src/config/business.ts        Identity, optional logo, palette, contacts, hours, areas
src/config/pageMetadata.ts    Per-page search/social titles and descriptions
src/config/pageContent.ts     Homepage and About headings, body copy, image and CTAs
src/config/siteContent.ts     Shared quote action, demo notices, footer labels
src/config/contactContent.ts  Contact/form wording in offline and configured modes
src/config/serviceContent.ts  Shared services, philosophy, Services copy and labels
src/config/gallery.ts         Gallery copy, image imports, alt text and provenance
src/config/website.ts         Starter/Business selection (WEBSITE_PACKAGE), default Business
src/config/navigation.ts      Routes/navigation, also used by sitemap generation
src/config/contactForm.ts     Public form configuration validation
src/config/seo.mjs             Domain and discovery-file helpers
src/components/               Reusable brand, cards, CTA, form, header/footer, UI
src/layouts/BaseLayout.astro   Shared document, theme, metadata, layout
src/pages/                    Home, Services, Contact, shared 404
src/page-templates/            About and Gallery, registered only for Business
src/styles/global.css         Shared typography, layout, responsive rules
src/assets/gallery/           Gallery sources; Astro generates optimized output
public/images/                Static homepage illustration and licensing notice
docs/                         Deployment, launch, customization, contact, review notes
tests/                        SEO, responsive/keyboard, and form browser tests
.github/workflows/checks.yml   GitHub verification; no deployment job
```

Business-specific body copy is centralized under src/config/. See the
[hardcoded-content inventory](CLIENT_SETUP.md#remaining-demo-content-to-review)
before claiming a complete rebrand. Changing only `business.name` or `isDemo`
does not convert this demo into a real service offering.

## Maintenance and Git workflow

1. Update local `main` with `git switch main` and `git pull --ff-only`; run `npm ci`
   when the lockfile changed. Preserve uncommitted work before switching branches.
2. Create a focused branch, edit source/configuration, and run `npm run format`
   and `npm run verify`. Review content and the production preview visually.
3. Open a pull request with the purpose and actual test results. Review and merge
   only after checks pass and any release/automatic-deployment approval is clear.
4. After a successful release, record the commit/deployment ID in the client's
   private handoff notes and delete fully merged working branches when appropriate.

Keep dependencies and the lockfile in sync; review release notes and update through
small pull requests rather than running a broad unreviewed upgrade. Periodically
check links, provider quotas/spam, inbox delivery, domain renewals, and HTTPS.
Store credentials and client records outside the repository. Never commit `.env.local`,
`node_modules`, `dist`, test artifacts, inbox screenshots, or real customer messages.
For an urgent regression, follow the approved rollback procedure in the Cloudflare
guide, then fix the source so the next deployment does not restore the problem.

## Pre-launch gate

Run `npm run validate` for a strict offline client launch check; this fictional demo
intentionally reports blocking errors. `npm run validate -- --demo` reviews the demo
with expected launch gaps as warnings. See [client setup](CLIENT_SETUP.md#pre-launch-validation-offline)
for fixes, exit codes, limits and how to gate an approved release. Neither command
deploys or sends inquiries.
