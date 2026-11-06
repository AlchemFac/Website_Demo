# North Texas Home Cleaning — Astro demo

A five-page small-business website built with Astro, TypeScript, and plain CSS.
**North Texas Home Cleaning is fictional.** Contact information, service scopes,
hours, and areas are examples. Gallery images are labeled AI-generated interiors,
not customer work. The Contact form validates locally and never sends or saves entries.

## Open and run locally

Use **Node.js 24** (`.nvmrc` is included) and a recent npm. In VS Code, open the
repository folder and run these commands in its terminal:

```sh
npm ci
npm run dev
```

Open the local URL Astro prints, normally `http://localhost:4321/`. Stop the server
with **Ctrl+C**. For a container preview, use `npm run dev -- --host 0.0.0.0`.
No database, backend, API keys, or environment variables are needed.

To update an existing local checkout after a pull request is merged:

```sh
git switch main
git pull --ff-only
npm ci
```

Commit or otherwise preserve local changes before switching branches. Use one local
checkout; switching branches changes the files VS Code displays automatically.

## Pages and folders

| Route        | Content                                                                |
| ------------ | ---------------------------------------------------------------------- |
| `/`          | Homepage, service summaries, benefits, process, areas, and quote links |
| `/services/` | Detailed example cleaning scopes, inclusions, and exclusions           |
| `/about/`    | Fictional introduction, intended philosophy, and example areas         |
| `/gallery/`  | Responsive, optimized, clearly labeled demo imagery                    |
| `/contact/`  | Sample business details and browser-only form validation               |

```text
.github/workflows/checks.yml   Automated pull-request and main-branch checks
src/
  assets/gallery/             Original gallery images and provenance README
  components/                 Buttons, headings, cards, CTAs, form, header/footer
  config/
    business.ts               Business name, branding, contacts, hours, and areas
    navigation.ts             Navigation labels and routes
    serviceContent.ts         Shared service data, homepage summaries, philosophy
    gallery.ts                Gallery image imports, captions, and alt text
  layouts/BaseLayout.astro    Document, metadata, demo banner, header, and footer
  pages/                      The five Astro routes above
  styles/global.css           Shared design tokens and responsive layout rules
public/images/                Homepage SVG illustration and its license
docs/                        Customization and contact integration guides
tests/                       Playwright browser regression tests
playwright.config.ts          Production-preview test server and browser settings
.prettierrc.json               Consistent formatting with Astro support
package.json                  Commands and dependencies
package-lock.json             Reproducible dependency versions
astro.config.mjs              Static output configuration
tsconfig.json                Strict Astro/TypeScript configuration
```

## Commands and checks

| Command                | Purpose                                                      |
| ---------------------- | ------------------------------------------------------------ |
| `npm run dev`          | Start the development server                                 |
| `npm run format`       | Format supported source/configuration/documentation files    |
| `npm run format:check` | Check formatting without editing files                       |
| `npm run check`        | Check Astro and TypeScript types                             |
| `npm run build`        | Build static output in `dist/`                               |
| `npm run preview`      | Serve the existing production build locally                  |
| `npm test`             | Run browser tests against the existing production build      |
| `npm run verify`       | Check formatting, check types, build, then run browser tests |

For browser tests, install Chromium once after `npm ci`:

```sh
npx playwright install chromium
npm run verify
```

Tests cover navigation and horizontal overflow at mobile, tablet, and desktop widths,
gallery loading, form validation, error focus, demo non-delivery, and the
JavaScript-disabled fallback. They use port **4322**. If you deliberately use a
system Chromium instead of Playwright's download, set
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to its full path. Cloud environments with
unwritable telemetry directories can set `ASTRO_TELEMETRY_DISABLED=1`.

GitHub Actions runs the same verification on pull requests and pushes to `main`.
A green check means these checks passed, not that every possible issue was tested.
To enforce them before merging, configure the **Format, types, build, and browser
tests** status check in a GitHub branch ruleset. This repository includes the workflow;
repository settings must be configured separately.

## Working with Git

Start changes from an up-to-date `main`, create a descriptive branch such as
`feat/contact-delivery`, commit a focused change, push, and open a pull request.
After its checks pass, review and merge it, then delete the finished branch.
Deleting a fully merged branch removes its label, not the work retained in `main`.
Never delete a branch with unmerged work just to tidy the list.

Keep `node_modules/`, `dist/`, `.astro/`, Playwright results, and local `.env` files
out of Git. Commit source code and `package-lock.json`. GitHub can automatically
delete merged head branches through the repository's pull-request settings.

## Customization and delivery

- [Customization guide](docs/customization.md): edit branding, copy, service scopes,
  images, and design consistently.
- [Contact integration notes](docs/contact-integration.md): current demo behavior and
  steps required before accepting real inquiries.
- [Gallery image provenance](src/assets/gallery/README.md) and
  [homepage illustration license](public/images/LICENSE.md).

This demo uses `noindex, nofollow`. Before a real launch, replace and verify business
information, approve image rights and content, connect and test form delivery, and
review demo labels and metadata together. No real service credentials or testimonials
are represented.

For static hosting, use Node 24, build command `npm run build`, and output directory
`dist`. No hosting integration or deployment is configured here. Set Astro's `site`
URL when a real domain is chosen. Preview the production build before publishing.
