# Production readiness review

Review date: November 7, 2026 (America/Chicago).
Scope: the five-page Astro demo and its 404 page, including the existing Formspree
integration. Reviewed from contact-submission commit `ca01ced`; corrections are on
`fix/production-readiness`. This report does not mean the changes are merged into
GitHub's default branch or deployed.

## Deployment decision

**Suitable for a restricted demo/staging deployment after review. Not ready for a
paying client's public launch.** The final domain is undecided, the business and
copy are fictional, and production-origin delivery, privacy, and hosting checks
remain open. No SEO ranking, Lighthouse score, or accessibility certification is
claimed.

## Issues corrected

| Finding                                                       | Correction                                                                                                                                             |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| No canonical or crawl/discovery configuration                 | Validated `SITE_URL`, explicit indexing permission, conditional canonicals, robots.txt output, and gated sitemap generation without adding a package.  |
| Page titles were unique but generic                           | More descriptive titles for each page; retained unique descriptions and added matching Open Graph title/description metadata.                          |
| Demo title suffix and robots policy were unconditional        | Demo suffix follows the demo flag; indexing requires both explicit permission and a non-demo business. The current fictional demo stays non-indexable. |
| No branded error page                                         | Added `404.html` with a return-home action, unique metadata, noindex, and no canonical.                                                                |
| Service-link accessible names omitted visible “service” text  | Accessible names now start with the visible “Explore service” wording and include the service name.                                                    |
| Service inclusions/exclusions created repeated landmark names | Labels include the service title as well as the subsection title.                                                                                      |
| Demo notice sat outside a landmark                            | Moved it inside the existing site header without changing its visible content.                                                                         |
| Enlarged gallery text could cause horizontal overflow         | Added emergency word wrapping; the 200% text-size regression test now passes.                                                                          |
| Fixed mobile CTA could obstruct scrolled focus targets        | Added mobile scroll padding and a keyboard/focus-clearance regression test.                                                                            |
| Gallery CTA described the form as always browser-only         | Updated it to describe the configurable test-inquiry form accurately.                                                                                  |
| No explicit document referrer policy                          | Added `strict-origin-when-cross-origin`; submission fetches already send only the origin.                                                              |

Working components, the service model, gallery imagery, and the submission flow
were retained. No runtime or project development dependency was added. A temporary
axe accessibility tool was installed outside the repository solely for this review.

## Verified automated results

- `npm run format:check`: pass. This is the project's formatting check; there is no
  separate ESLint/lint command configured.
- `npm run check`: zero Astro/TypeScript errors, warnings, or hints.
- `npm run test:seo`: five unit tests for root HTTPS URL validation, safe demo
  defaults, indexing permission, sitemap URLs/XML escaping, and invalid routes.
- `npm run build`: six static pages, optimized gallery assets, and robots.txt build
  successfully. The actual final domain has not been configured.
- `npm test`: nine Chromium tests. These check all five main routes at 320, 768,
  and 1440px; unique titles/descriptions; one h1 and sequential heading levels;
  duplicate IDs; image alt/dimension attributes; internal links and anchors;
  gallery loading; form validation; no-JavaScript behavior; mobile keyboard menu,
  Escape/focus return and skip link; sticky-CTA clearance; and 200% text at 375px.
- `npm run test:submission`: thirteen intercepted provider tests for validation,
  pending/success states, duplicate prevention, HTTP and field errors, unexpected
  responses, timeout/network failure, CAPTCHA failure/expiry, honeypot blocking,
  and a compact-widget mobile layout. No real submission is sent by these tests.
- `npm audit --omit=dev --json`: zero known production-dependency advisories were
  reported. This is an advisory lookup, not a complete security audit.
- axe scan: all six pages at 375 and 1440px, plus the configured form's initial,
  validation-error, provider-error, and accepted mock states. Corrected the issues
  listed above; the final scan found no automatic violations. Decorative arrows
  and star glyphs produce incomplete automatic color-contrast checks on Home and
  Services; those are not represented as passes by the scanner.
- Contrast calculations for the checked palette pairs meet 4.5:1 for normal text:
  white on primary green 6.39:1, muted text on accent 5.42:1, primary green on the
  page background 6.15:1, dark green on the hero caption 8.86:1, and error red on
  white 7.66:1. These calculations supplement the automated scan; they do not
  certify the appearance of every state or future brand palette.
- A separate build with reserved fixture origin `https://cleaning.example`
  confirmed canonical output for all five pages, no 404 canonical, and continued
  noindex/crawl blocking while `business.isDemo` is true. The indexing flag alone
  cannot expose the demo sitemap. An invalid HTTP/path site URL failed the build.
  This fixture is not the chosen domain or a production deployment.

## Images, HTML, links, and form review

The hero illustration has explicit dimensions, descriptive alt text, eager loading,
and high fetch priority. Gallery images have descriptive alt text, dimensions,
responsive WebP sources, and lazy loading after the first image. They remain clearly
labeled as generated demonstration interiors rather than customer results.

The header/footer/main/navigation landmarks, heading hierarchy, form labels,
required markers, associated errors, and error/success focus behavior were reviewed.
The mobile menu remains usable without JavaScript by leaving navigation visible;
the form stays disabled without JavaScript to prevent accidental URL submission.

No broken internal destination was found in the reviewed build. SVG/Unicode icons
that add no information remain hidden from assistive technology. No testimonials,
certifications, awards, years of experience, or fabricated business location were added.

## Security and privacy observations

- `.env.local` is ignored and untracked. No private API/Turnstile secret is needed by
  this static application. The public form ID/site key are public by design.
- Submission is restricted to the Formspree HTTPS form origin. Payload fields are
  explicitly selected; cookies are omitted and redirects are rejected.
- The application does not log form payloads, render raw provider error HTML,
  store entries in local/session storage, or send them in URL query parameters.
- Provider CAPTCHA enforcement, domain restrictions, quotas, account ownership,
  and data retention are dashboard settings; source-code checks cannot verify them.
- Local inbox delivery was owner-verified on November 6, 2026, as recorded in
  `docs/contact-integration.md`. That does not verify the future deployed origin.
- The actual widget and live provider were not exercised during this review.
  Submission tests use intercepted synthetic fixtures. No real inquiry was sent.
- Hosting HTTPS, response headers, cache policy, and HTTP status/redirect behavior
  cannot be verified without a deployed host. Review CSP for Formspree connections
  and Cloudflare scripts/frames, `X-Content-Type-Options`, and framing policy there.
- Robots/noindex are crawler directives, not access controls. Authenticate private
  previews. Existing indexed URLs may require a separate recrawl/removal strategy.

## Required replacements and owner decisions

| Before client launch                | Location / action                                                                                                                                                                                       |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Real business identity and branding | Verify name, tagline, colors, and descriptions in `src/config/business.ts` and editorial page copy.                                                                                                     |
| Real contact details                | Replace the sample 555 phone and example.com email in `business.ts`; verify links and the true recipient in the client's Formspree account.                                                             |
| Actual hours and service coverage   | Confirm hours, cities, and any geographic restrictions with the business owner.                                                                                                                         |
| Approved service offering           | Review scopes, exclusions, optional tasks, service philosophy, and quotation promises in shared content and pages. Do not add unsupported claims.                                                       |
| Approved imagery                    | Keep the generated/demo labels or replace imagery with rights-cleared assets; update alt text and provenance together.                                                                                  |
| Final HTTPS domain                  | Set `SITE_URL` to the final root origin. Verify DNS, TLS, www/apex redirects, and canonical URLs on that host.                                                                                          |
| Client-owned form accounts          | Use verified recipient settings and hostname restrictions; configure Turnstile secret only inside Formspree and public identifiers in the hosting build environment.                                    |
| Privacy information                 | Approve a real notice identifying the business, what data is collected, third parties, purpose/retention, and contact channel. The current form's short notice is not a complete client privacy policy. |
| Real business copy and demo notices | Replace all fictional/sample/test-inquiry wording throughout pages, metadata, footer, CTAs, and form. Changing one flag does not complete a client conversion.                                          |
| Search indexing                     | Only after approval, set `business.isDemo=false` and `ALLOW_INDEXING=true`, then rebuild and verify robots/canonicals/sitemap together.                                                                 |
| Publish reviewed source             | Review/merge pending branches, choose a static host, configure build variables, and deploy the approved commit.                                                                                         |

## Domain and indexing configuration

Set these in an ignored `.env.local` or the hosting build environment:

```dotenv
SITE_URL=
ALLOW_INDEXING=false
```

`SITE_URL` must be a root HTTPS origin without credentials, a path, query, or hash.
It is intentionally blank until the owner chooses a domain. Canonicals use the
page path on that origin, never the local preview URL. 404 is excluded.

A sitemap is generated from the shared navigation routes only when the domain is
set, `ALLOW_INDEXING=true`, and `business.isDemo=false`. It omits fabricated lastmod
values. Otherwise, robots.txt disallows crawling and any old sitemap is removed
from the build output. Canonical and sitemap behavior should be checked with
`npm run build` / `npm run preview`: discovery files are generated at build time.

## Manual browser / deployment checks still required

- Test the actual deployed origin on Safari/iOS, Chrome/Android, and Firefox. Only
  Chromium was automated here; there was no physical-device or cross-browser run.
- Use NVDA and/or VoiceOver to review navigation, headings, field errors, pending
  state, provider acceptance, and the actual Turnstile widget. Automated axe checks
  and focus assertions cannot replace that assessment.
- Review design and contrast visually with the approved brand and imagery, OS high
  contrast settings, real browser zoom, and long client content.
- Confirm real Formspree delivery from the final hostname in the intended inbox,
  verify reply-to and spam handling, and verify provider rejection of bad tokens.
- Check hosting headers/CSP without breaking the form/widget; confirm HTTPS
  redirects, missing-page HTTP 404 responses, robots.txt content type, XML sitemap
  availability, and canonical behavior from all public URL variants.
- Submit the final sitemap in the business owner's search-console account after
  launch approval. No external search-console setup was performed here.
