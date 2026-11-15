# Promotional website — working preview

This is a separate Astro site on branch `feat/promotional-website`. The reusable
cleaning template remains in the repository root. No deployment or GitHub merge
has been performed for this site.

From the repository root:

```sh
npm run dev:promotion
npm run check:promotion
npm run build:promotion
npm run preview:promotion
```

These commands reuse the existing Astro dependency; there is no separate install.
The output is `promotion-site/dist`, not the template's `dist`.

## Before publishing

Edit `src/config/studio.ts` here:

- `name` is an explicit placeholder approved by the owner; choose the real brand.
- `email` is blank. Inquiries stay unavailable. A public email enables a clearly
  labeled email link (not a backend form or guaranteed delivery).
- Build prices are $599 Starter / $999 Business **one time**.
- One optional Website Care plan is $59 monthly for either package, with one separate monthly website health check plus 30 combined minutes for content edits, minor fixes and technical help. See `SCOPE.md` for operating limits and billing policies.
- Packages, revisions, and FAQ copy describe the agreed scope. Google Business
  Profile services remain excluded because those add-ons were not finalized.

There is no form backend and no personal information is collected or stored by
this page. No root `.env.local` identifiers were copied. Update the
preview notice/footer copy, metadata, domain and robots/indexing settings only
when brand, contact details and launch approval are complete. The current page is
noindex, has no invented canonical domain, and `robots.txt` blocks crawling.
Choose and approve any required public privacy information before adding collection,
analytics or a submission service. The preview banner is not access control.

This site is not published. For a later approved Cloudflare Pages deployment,
create a **separate project** and use these monorepo settings:

| Setting                   | Value                                        |
| ------------------------- | -------------------------------------------- |
| Repository root directory | Leave blank                                  |
| Branch                    | The approved promotional-site branch         |
| Framework preset          | None/custom; keep the explicit command below |
| Build command             | `npm run build:promotion`                    |
| Output directory          | `promotion-site/dist`                        |
| Node version              | `24`                                         |

Do not repoint the cleaning demo's existing Cloudflare project. No project, DNS,
provider account, or automatic publication setting has been changed here.

## Imagery and claims

`src/assets/cleaning-concept.png` is an original screenshot of the fictional North
Texas Home Cleaning template in this repository. It is visibly labeled as a
concept, not a customer engagement, testimonial, or verified result. The underlying
homepage illustration is original demonstration artwork; see the root
`public/images/LICENSE.md`. Do not invent clients, reviews, statistics or guarantees.
Astro produces WebP variants for the screenshot. There are no external fonts,
tracking scripts or unnecessary animations.

`benefits` controls the three short customer benefits, and `carePlan` is the single source
for optional care. `studio.demoUrl` controls both live-concept links. Those open the
fictional cleaning site in a new tab; they are not claims of paid customer work.
See [SCOPE.md](SCOPE.md) for the current offer.

The benefits section is intentionally brief. Detailed scope remains in the pricing,
ownership, process, care and FAQ sections; SCOPE.md is the matching written summary.
