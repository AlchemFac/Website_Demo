# Client setup — adapting the website for another business

This is a code template, not an already-operating business. **North Texas Home
Cleaning and its contacts, services, hours, cities, and history are fictional.**
The existing design works without a logo or form account. Customize a separate
client copy, keep demo safeguards on during review, and obtain approval before
publishing or changing DNS.

## Start here: one configuration folder

The [configuration directory guide](src/config/README.md) is the short file map.
There is no new master config to populate: edit the existing objects in place.
For a second business, work in a separate client copy and branch, then:

1. Update `business.ts` for identity and approved public details.
2. Update `serviceContent.ts` for the actual offerings and service philosophy.
3. Review `pageContent.ts`, `contactContent.ts`, `gallery.ts`, and `siteContent.ts`
   for every heading, regional reference, notice, caption, and call to action.
4. Update `pageMetadata.ts`; retain the current routes unless page structure changes.
5. Choose offline demo mode or client-owned form accounts in build settings.
6. Run `npm run verify` and review the content before requesting release approval.

The default North Texas demo remains unchanged. The examples below are also
fictional; they are instructions, not a second set of live configuration values.

### Required fields versus optional features

“Required” here means required by the current page structure or for a real launch.
TypeScript checks field shapes, not factual accuracy or whether a string is empty.
Keep existing keys; do not delete required fields to hide a section.

| Value / feature                           | Required or optional?                                     | What to do                                                                                                                    |
| ----------------------------------------- | --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `name`, `description`, `branding.tagline` | Required by current pages                                 | Use public, owner-approved wording; edit related page content too                                                             |
| `phone.display`, `phone.href`, `email`    | Required by current contact/footer layout                 | Supply verified public channels; if a client does not publish one, adapt the UI deliberately rather than inventing a value    |
| `hours`                                   | Required by current layout                                | Supply at least one meaningful schedule row; use “By appointment” if that is the approved policy                              |
| `serviceAreas`                            | Required by current layout                                | Supply at least one approved area and review regional prose separately                                                        |
| `branding.colors`                         | Required keys; recoloring is optional                     | Keep all existing tokens; the default palette works without edits                                                             |
| `branding.logo`                           | Optional image                                            | Keep `null`, or supply all of `src`, `width`, `height`                                                                        |
| `services`                                | At least one offering for current pages                   | Supply every `Service` field with unique stable IDs; inclusion/exclusion lists may be empty only if intentionally appropriate |
| Page content and `pageMetadata`           | Required keys                                             | Keep every referenced key; replace copy where needed, including image alt text and provenance                                 |
| `siteContent.quoteAction`                 | Required                                                  | Keep a nonempty label and a working `href`; the default `/contact/` works                                                     |
| `isDemo`                                  | Required boolean                                          | Keep `true` for this fictional demo and unfinished client review                                                              |
| `WEBSITE_PACKAGE`                         | Optional, defaults to `business`                          | Use `starter` for three content pages or `business` for five                                                                  |
| Formspree / Turnstile integration         | Optional as a pair                                        | Both public identifiers blank means offline; both configured enables submission mode                                          |
| `SITE_URL`                                | Optional for demo; required for canonical URLs / indexing | Use only the approved root HTTPS origin when chosen                                                                           |
| `ALLOW_INDEXING`                          | Optional environment override                             | Leave unset or `false` for demos/previews; real indexing also requires `isDemo=false` and a valid `SITE_URL`                  |

## Choose Starter or Business

Set one public build setting in ignored `.env.local` (and separately in hosting
build settings when deploying an approved release):

```dotenv
WEBSITE_PACKAGE=starter
```

Use `business` instead for the five-page package, or leave it unset/blank to retain
the existing demo. Only these two lowercase values are accepted; a typo stops the
build instead of silently publishing the wrong package. Restart the development
server after changing it; rebuild before using `npm run preview`.

| Package            | Content pages                           | Limit |
| ------------------ | --------------------------------------- | ----- |
| Starter            | Home, Services, Contact                 | 3     |
| Business (default) | Home, Services, About, Gallery, Contact | 5     |

The shared 404 is a technical error page and does not count toward either package.
These are fixed presets; Home, Services, and Contact remain available for shared
CTAs. No CMS, database, or new dependency is involved.

`src/config/website.ts` validates the choice and defines the preset page IDs.
`navigation.ts` is the page registry: labels, paths, and optional template entries.
Both header and footer use its selected list. About and Gallery live in
`src/page-templates/` and Astro registers them only for Business, so Starter produces
neither `/about/index.html` nor `/gallery/index.html`. Do not put duplicate copies
back in `src/pages/`, where Astro would generate them unconditionally.

The sitemap uses exactly the enabled routes when real-client indexing is approved.
Demo protection still applies: package choice does not enable indexing. Internal
CTAs continue to use enabled Home, Services, and Contact routes. When adding any new
page/link, review its package membership, entrypoint, metadata, and tests together;
merely hiding a navigation link is not enough to exclude a static page.

`npm run verify` tests both presets, including emitted HTML, an isolated indexable
sitemap, all internal link targets, mobile keyboard navigation, and switching from
Business to Starter without stale output. Package fixtures are temporary copies
with blank form identifiers and a reserved test origin; they do not change your
client config or send inquiries. Existing site/form suites exercise Business even
when your local selected package is Starter. `npm run test:packages` runs just the
package checks. Review the selected package with `npm run build` and `npm run preview`.
Never deploy `.package-starter-dist` or `.package-business-dist`: those are test fixtures.

## Fictional replacement examples

These are **editing fragments**, not extra objects or runtime assignments. Replace
matching properties inside the existing exports; preserve keys not shown. Never
paste private customer details into these examples or into source files.

For `business.ts`, a different fictional business might use:

```ts
name: 'Cedar Grove Home Care',
description: 'A fictional example of a residential cleaning business.',
phone: { display: '(214) 555-0101', href: 'tel:+12145550101' },
email: 'hello@example.com',
hours: [{ days: 'Monday–Friday', hours: 'By appointment' }],
serviceAreas: ['Example City'],
isDemo: true,
```

These are reserved demonstration contacts, not real client contacts. Within the
existing `branding` object, change `tagline` to `'Room for everyday life.'`, keep
`logo: null` if no logo is supplied, and keep the existing `colors` object unless
rebranding. For an optional logo object, see section 3 below.

In `serviceContent.ts`, replace or add one item in the existing `services` array:

```ts
{
  id: 'kitchen-refresh',
  number: '01',
  title: 'Kitchen Refresh',
  homepage: {
    description: 'A sample focused refresh for everyday kitchen surfaces.',
    details: 'Example scope: accessible counters, sink, and floors.',
  },
  summary: 'An example focused on the kitchen.',
  description: 'A fictional scope for discussion; a real provider must confirm tasks and exclusions.',
  includes: ['Wipe accessible counters', 'Clean the sink'],
  excludes: ['Inside appliances', 'Repairs or stain restoration'],
},
```

Every item needs the same fields. Its ID must be unique; matching homepage cards,
Services detail cards, and Contact choices read this single array. Do not leave old
IDs, cleaning claims, or service counts in surrounding copy for an unrelated client.

For `pageContent.ts`, edit the existing `homeContent` properties:

```ts
heroTitle: 'A calmer space.',
heroEmphasis: 'More time for you.',
heroDescription: 'Explore the fictional Cedar Grove Home Care service concept.',
```

Update `aboutContent` and both Contact-mode notices separately. Some introductions
interpolate `business.name`, but regional language and most descriptions are editorial
copy. `pageMetadata.ts` controls search/social copy separately from visible headings.
To replace the shared quote wording, edit `siteContent.quoteAction.label`; keep its
`href` pointing to an existing page, and review service-card accessible quote labels.

### Form configuration choices

Copy `.env.example` to ignored `.env.local` for local work; keep it out of commits.
The unchanged example is the safe offline configuration:

```dotenv
PUBLIC_FORMSPREE_FORM_ID=
PUBLIC_TURNSTILE_SITE_KEY=
SITE_URL=
ALLOW_INDEXING=false
```

For sending, replace the first two blanks with the client's **public form ID**
(the part after `/f/`, not the full endpoint) and **public Turnstile site key**.
Both are needed; partial or malformed values fail the build. Do not paste literal
placeholder text into these fields. Configure the same public values independently
in hosting build settings; your local file is not uploaded by Git.

Verify the client-owned recipient in Formspree, enable Turnstile there with the
matching widget's **secret key**, and authorize the intended hostname in Turnstile.
The secret stays in Formspree, never in a `PUBLIC_` value or repository file.
`business.email` is the displayed address and does not set the recipient. Restart
local development after environment changes; hosting changes require a rebuild.

Review `contactContent`, `formContent`, and `formMessages` for privacy and accurate
submission wording. A provider acceptance response is not proof of inbox delivery
or a booking. Test the approved hostname and have the owner confirm actual receipt
before launch. Local automated tests use mocked submissions, not a client's inbox.

## 1. Make a clean client copy

Use one repository and one set of hosting/form accounts per client. Do not clone a
working folder containing another client's `.env.local`, credentials, or generated
files into the new project.

If the repository owner has enabled GitHub's template setting, use **Use this
template** to create a new repository. Otherwise export a reviewed, merged revision:

```sh
git archive --format=zip --output=../client-template.zip main
```

Extract that ZIP into a new folder and open it in VS Code. This exports tracked
source, not the old Git history, local environment file, dependencies, or test output.
It includes `.env.example` with blank public identifiers and the asset provenance
files. If desired, initialize a new Git repository and connect only the new client
repository after its owner approves that destination.

Use Node 24, run `npm ci`, then `npm run dev`. Update `package.json`'s project name
if needed and keep the lockfile consistent (`npm install --package-lock-only`).
Do not add a backend, CMS, Cloudflare adapter, or account secrets merely to edit
this static template.

## 2. Business name and basic identity

Edit `src/config/business.ts`:

| Field              | What to supply                                                          |
| ------------------ | ----------------------------------------------------------------------- |
| `name`             | Owner-approved public business name                                     |
| `description`      | Short factual business summary used as a metadata fallback              |
| `branding.tagline` | Approved short brand statement                                          |
| `hours`            | Verified operating hours; do not carry over the sample schedule         |
| `isDemo`           | Keep `true` until the client conversion and release review are complete |

The shared header/footer brand and Contact information read from this file.
Page metadata is centralized separately in `src/config/pageMetadata.ts`.
Business names in About, Contact, and Gallery introductions reuse `business.name`.
Other editorial copy lives in the content configuration files below; changing the
name alone does not replace regional or cleaning-specific messaging.

## 3. Logo

The default `branding.logo` is `null`, so the current text brand and design remain
unchanged. To add a rights-cleared local logo, save it under `public/images/`, then
set the logo object in `business.ts`, for example:

```ts
logo: {
  src: '/images/client-logo.svg',
  width: 180,
  height: 60,
},
```

These dimensions are an example: use the asset's actual aspect ratio. Provide a
safely authored SVG or an appropriately sized raster image; avoid oversized originals.
`BusinessBrand.astro` renders it in both header and footer with reserved dimensions
and constrained display size. Keep the visible business name. The image uses empty
alt text because that adjacent name already labels the home link; do not add a
second repeated name. If redesigning the component to remove visible text, give
that link/image an appropriate accessible name and recheck keyboard behavior.

Remove the logo by restoring `logo: null`. No new image is required for this demo.

## 4. Colors and design

Edit `branding.colors` in `business.ts`. Defaults preserve the current appearance.

| Fields                                   | Use                                        |
| ---------------------------------------- | ------------------------------------------ |
| `primary`, `primaryHover`, `onPrimary`   | Buttons, links, hover, and their text      |
| `background`, `surface`, `text`, `muted` | Page, cards, normal and supporting text    |
| `accent`, `border`                       | Highlighted sections and borders           |
| `captionSurface`, `imagePlaceholder`     | Homepage illustration/caption surroundings |

`BaseLayout.astro` applies these values as CSS variables. `global.css` supplies
fallback tokens, spacing, typography, layout widths, and responsive rules. Semantic
error colors in `ContactForm.astro`, the subtle process divider, and illustration
artwork are intentionally not all derived from the brand color. Review those when
making a substantial visual rebrand. The illustration's SVG palette is artwork,
not a CSS theme setting.

Check normal text against its background at 4.5:1 contrast, and check hover/focus,
error, and button states. Keep readable focus indicators. A visually attractive
palette is not automatically an accessible palette.

## 5. Contact information and business hours

Set `phone.display`, `phone.href` (a valid `tel:` URI), `email`, and `hours` in
`business.ts`. Use only verified client information. The sample 555 phone and
example.com address are not a real contact channel.

The footer supports phone/email links for a non-demo business. The Contact page
currently presents sample details as text; review its headings, links, and explanatory
copy in `src/config/contactContent.ts` for the actual service. Do not publish labels
such as “Sample contact details” on a finished client site.

**Changing `business.email` does not change the form recipient.** Configure that
separately in Formspree as described below. Do not put personal account passwords,
provider secrets, or client inbox screenshots into the project.

## 6. Services and service philosophy

Edit `src/config/serviceContent.ts`:

- `id`: stable URL-anchor/form-option identifier; avoid changing existing IDs without
  considering saved links and provider field values.
- `number`, `title`: display order labels and service names shared across pages/form.
- `homepage.description`, `homepage.details`: short homepage card content.
- `summary`, `description`, `includes`, `excludes`: detailed Services page content.
- `philosophy`: intended principles presented on About.
- `servicesPageContent`: page introduction, planning tips, scope notice, and final CTA.
- `serviceLabels`: shared card links, accessible quote labels, and scope headings.

Adding/removing an entry updates the homepage service cards, Services detail cards,
and Contact service choices. Have the owner approve actual scopes, exclusions,
pricing/quote language, and anything claimed about the business. No years of
experience, certifications, insurance, awards, or customer reviews are provided
by this template and none should be invented.

Homepage benefits/process wording and About paragraphs are in
`src/config/pageContent.ts` (`homeContent` and `aboutContent`). Review them for a
different type of business; philosophy items remain in `serviceContent.ts`.

## 7. Images and captions

For gallery items, update `src/config/gallery.ts` together with imports from
`src/assets/gallery/`. Each item has `src`, `title`, `alt`, `label`, and `caption`.
The `demoProvenance` defaults identify the current generated images; override or
replace those fields when using different imagery. Mixed galleries can set each
item's provenance independently.

Provide descriptive alt text about what an image shows. Keep labels truthful: a
stock/generated interior is not a customer's completed job. Record usage rights
and provenance in `src/assets/gallery/README.md`. Removing a label does not turn
a demonstration photo into service evidence.

`GalleryCard.astro` keeps dimensions, responsive WebP variants, and lazy loading
after the first photo. Keep source images in `src/assets/` for optimization. Files
in `public/` are served as-is.

The homepage uses `public/images/calm-home.svg`. To replace it, edit `homeContent`
in `src/config/pageContent.ts`: `heroImageSrc`, `heroImageWidth`, `heroImageHeight`,
`heroImageAlt`, `heroCaption`, and `heroImageLabel` together. The default caption
reuses `business.branding.tagline`; replace that reference if separate copy is needed.
Use Astro Image for a large raster replacement rather than serving an unnecessarily
large raw file. Keep image rights/attribution notices current. `galleryContent` in
`src/config/gallery.ts` controls the gallery introduction, demo note, and CTA; review
those after image replacement.

## 8. Service areas

Edit `business.serviceAreas` with confirmed city names/locations. Shared city lists
in Home, About, Contact, and the footer read that data. Geographic prose such as
“Dallas–Fort Worth” or “North Texas” remains in content configuration and page metadata. Change
those explicitly; do not imply coverage the owner has not approved. A map is not
included and no fabricated street address should be introduced.

## 9. SEO metadata, domain, and navigation

Edit each page's `title` and `description` in `src/config/pageMetadata.ts`.
`BaseLayout.astro` builds the document title and matching Open Graph metadata;
the business name is appended automatically. Keep titles/descriptions unique,
factual, and relevant to the page. Visible h1 headings and descriptions live in
the content files, so review them too. The 404 metadata uses `pageMetadata.notFound`
and retains its independent noindex behavior.

Set the final root HTTPS origin in local/hosting **build settings** as `SITE_URL`.
There must be no path, query, credentials, or fragment. Leave it blank until chosen.
The 404 page intentionally has no canonical and is never put into the sitemap.

`src/config/navigation.ts` controls page labels/routes and uses the selected package
from `src/config/website.ts` for shared navigation and sitemap routes. If adding
a page, review navigation, metadata, headings, internal links, and tests together.
Keep root-relative route links and trailing-slash behavior consistent.

For an approved real-business launch only: replace fictional content, set
`business.isDemo=false`, set `ALLOW_INDEXING=true`, then rebuild. Those changes
allow indexing and sitemap generation only when a valid `SITE_URL` exists. A domain
or flag alone does not override the demo protection. Keep preview environments at
`ALLOW_INDEXING=false`. No search rankings or Lighthouse scores are promised.

## 10. Form destination and spam protection

Create client-owned Formspree and Turnstile configurations. In Formspree, verify
the recipient, enable CAPTCHA with the matching Turnstile secret, and restrict the
approved origin. In Turnstile, authorize the real hostname. Use a separate form
and widget for previews where appropriate.

Configure these **public** build values in ignored `.env.local` or Pages settings:

```dotenv
PUBLIC_FORMSPREE_FORM_ID=
PUBLIC_TURNSTILE_SITE_KEY=
SITE_URL=
ALLOW_INDEXING=false
```

Fill in both public identifiers or leave both blank for offline demo behavior.
The secret belongs only in the provider dashboard. Do not copy this demo owner's
form ID or recipient into a second client's site. Static changes require a rebuild
and redeploy to affect hosting. See [Contact integration](docs/contact-integration.md)
for detailed account setup, privacy, error behavior, and the manual inbox test.

Configured mode currently says “Send test inquiry” because this is fictional.
Before real inquiries are accepted, approve `contactContent`, `formContent`, and
`formMessages` in `src/config/contactContent.ts`, and add the client's privacy
information. Both offline and configured modes have separate notices. The form
component and script consume the same copy configuration; provider configuration
stays in `src/config/contactForm.ts`. Preserve validation, field errors/focus, pending state, duplicate
protection, and honest provider-acceptance messaging. Do not change success copy
to claim inbox delivery or a booking merely because the provider accepted a request.

## Content editing map and remaining manual review

Frequently customized text is plain typed data under `src/config/`. No CMS, HTML
strings, or translation system is required. Edit the values directly; Astro escapes
text and the components retain semantic markup and accessible labels.

| File in `src/config/`                               | What to change                                                                                                                                     |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `business.ts`                                       | Identity, contacts, hours, cities, tagline, optional logo, palette, `isDemo`                                                                       |
| `pageContent.ts` → `homeContent`                    | Hero (including emphasized second line), illustration, benefits, process steps, region copy, notices, homepage CTA                                 |
| `pageContent.ts` → `aboutContent`                   | Introduction, purpose, philosophy headings, area prose, notices, About CTA                                                                         |
| `serviceContent.ts`                                 | Service descriptions/scopes, homepage summaries, philosophy items, Services introduction, planning tips, scope labels and accessible link prefixes |
| `contactContent.ts` → `contactContent`              | Contact introduction in both modes, sample detail/hours/area headings, coverage notice                                                             |
| `contactContent.ts` → `formContent`, `formMessages` | Form notices, message hint, demo/test action labels, required cleaning-needs message, sending/acceptance and offline statuses                      |
| `gallery.ts`                                        | Images, alt text, per-image provenance/captions; `galleryContent` introduction, note, and CTA                                                      |
| `siteContent.ts`                                    | Shared quote button label/destination, PageCTA eyebrow/notice, header demo banner, footer labels/notice                                            |
| `pageMetadata.ts`                                   | Per-page SEO titles/descriptions, including the 404 metadata                                                                                       |
| `website.ts`                                        | Starter/Business package choice and preset page membership                                                                                         |
| `navigation.ts`                                     | Navigation labels and routes                                                                                                                       |

For example, change `homeContent.heroTitle` and `heroEmphasis` for the two visual
headline lines. Change `siteContent.quoteAction.label` for all shared quote buttons;
its `href` must lead to a working destination. Service-specific accessible labels
use `serviceLabels.quoteAccessiblePrefix` plus the service title: keep them consistent
with the visible quote action. Image dimensions must match the replacement asset.

All current fictional copy is preserved. Replacing a business name or flipping
`isDemo` does **not** automatically turn demonstration copy into verified claims.
Read every content object for regional references, service scope, pricing language,
image provenance, privacy disclosure, and test-only messaging before launch. Keep
all demo notices while this remains the fictional cleaning example.

Technical UI text (field labels, generic validation/network/CAPTCHA errors, menu
controls, and generic 404 navigation) stays in the components/scripts. Those are
not business identity settings; edit them only when changing behavior or language,
and recheck accessibility. Page markup, semantic headings, image loading policy,
and form validation/submission logic remain in their existing files.

Still review the fixed illustration artwork/license in `public/images/calm-home.svg`,
semantic error colors and decorative process divider, and historical test evidence
in `docs/contact-integration.md` and `docs/production-readiness.md`. Those documents
do not prove delivery for a second client or a new hostname.

Use VS Code's **Ctrl+Shift+F** to search for `North Texas`, `Dallas`, `Plano`,
`Frisco`, `cleaning`, `fictional`, `sample`, `demo`, `test inquiry`, `555-0100`, and
`hello@example.com`. Review matches; do not blindly replace technical test fixtures
or safety checks. Update documentation/asset provenance for the new client and
never treat the original demo's inbox test as proof of that client's delivery.

## Finish and hand off

Run `npm run format`, `npm run verify`, and `npm run preview`. Review the design
with actual content at mobile/tablet/desktop widths. Obtain visual/content approval,
then follow [Cloudflare deployment](docs/CLOUDFLARE_PAGES.md) and the
[launch checklist](docs/LAUNCH_CHECKLIST.md). Deployment and DNS each need approval.
Record account ownership and operating instructions privately; hand off source,
not private credentials in Git. Keep the approved release and rollback references.

## Branding assets and checks

The public name and tagline, optional logo, and palette stay in `business.ts`.
`primary`/`primaryHover` style buttons and links; `accent` is the secondary accent
surface (`--color-accent`), paired with `text`. No separate competing theme exists.
The hero asset, dimensions, alt text, caption and provenance are `homeContent` in
`pageContent.ts`; gallery imports/captions are in `gallery.ts`.

Use six-digit hex colors. Builds reject malformed colors, missing local hero/logo
files, blank hero alt text and invalid dimensions. Warnings flag common text pairs
below 4.5:1; they do not certify accessibility. Review actual text, image overlays,
focus indicators and all form states in a browser.

| Asset         | Recommended source                                                                                                         | Loading behavior to preserve                                                                                          |
| ------------- | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Optional logo | Safely authored SVG, or a compact transparent PNG/WebP roughly 360 px wide for a 180 px display; use its true aspect ratio | Public local file, explicit dimensions; adjacent visible name provides the accessible link label                      |
| Hero          | Existing 840×920 SVG; for a raster, roughly 840–1680 px wide with the intended crop, compressed WebP/AVIF                  | Eager/high-priority hero with reserved dimensions; public files are served as-is, so optimize before adding them      |
| Gallery       | Rights-cleared PNG/JPEG/WebP source around 960–1920 px wide, large enough for the existing 960 px variant                  | Import through `src/assets/`; Astro keeps responsive 360/640/960 WebP variants and lazy loading after the first image |

Do not upscale small originals or ship full camera files. Keep the existing demo
assets until approved replacements exist. Update descriptive alt text, dimensions,
captions and truthful provenance together. Preserve `public/images/LICENSE.md` and
`src/assets/gallery/README.md` licensing/provenance records (and any required new
attributions). A stock/generated room is never evidence of completed customer work.

## Repeatable client form handoff

`business.isDemo` selects demo versus production text in `contactContent.ts`.
This is separate from provider configuration: a fictional demo with both public
identifiers configured deliberately sends **test** inquiries; an offline demo sends
nothing. A real client without provider settings shows an explicit unavailable
notice and never pretends to submit. Changing copy or `isDemo` does not configure
accounts or prove delivery. Keep all other demo content under review too.

For each client, use their own Formspree form and recipient and their own Turnstile
widget. Verify recipient ownership, configure CAPTCHA in Formspree with that widget's
secret, and authorize the exact deployment/custom hostname in Turnstile. Copy only
the public form ID and public site key into local/hosting build variables. Form
destination, displayed contact email, widget hostnames, and private verification
secret are distinct settings. Review provider plan limits and privacy terms with
the owner; limits/prices can change. Do not reuse the demo account for a client.

After an approved deployment, manually check required fields, keyboard error focus,
widget success/expiration/retry, loading state and duplicate-click protection. With
owner authorization, send one labeled test using the deployed hostname, confirm
Formspree acceptance, and have the intended recipient confirm the email and reply-to
behavior. Check Turnstile server validation activity and that missing/invalid tokens
are rejected; successful delivery alone does not prove spam enforcement. Confirm a
recoverable failure retains entries without automatic resends. Record the result
privately, without storing inbox screenshots or inquiry contents in Git.

Automated tests intercept provider requests; they do not establish account setup,
server-side token enforcement, or inbox delivery. No contact details are saved to
browser storage or application logs. Existing fields stay in memory until cleared
or the page closes; provider-side retention must be supplied by the client in the
approved privacy information. Success means provider acceptance, never guaranteed
delivery or a scheduled cleaning.

## Optional Privacy page — client approval required

Edit `src/config/privacy.ts`. Set `enabled=true` to render `/privacy/` and its footer
and Contact links. It is an auxiliary page outside both 3/5-page marketing limits.
Keep `clientApproved=false` while drafting: the page is noindex, has no canonical,
and is omitted from the sitemap regardless of other indexing settings. The default
`enabled=false` preserves the existing demo and emits no Privacy HTML or links.

Replace the clearly labeled placeholder introduction, metadata, and all five
sections with client-approved facts: categories collected, purposes, actual service
providers, retention criteria/periods, and public privacy contact/process. Add any
additional reviewed information appropriate to the business. Do not invent data
practices, legal compliance, deletion promises, retention periods, or legal rights.
The template is not legal advice and does not establish compliance.

Only after client review, replace draft metadata and set `clientApproved=true`.
This permits normal canonical/sitemap behavior only when the global production
origin, indexing permission, and non-demo settings also allow it. Approval is an
editorial declaration, not an automated legal assessment; enabling a page is not
approval. Do not publish this placeholder as a finished policy. Review form/provider
privacy disclosures against the approved text.

## Pre-launch validation (offline)

Run `npm run validate` before a real client release. It exits with code 1 when
errors remain, prints `ERROR` or `WARNING`, and names the configuration field plus
a remedy without echoing its value. This demo intentionally fails the production
check: default identity/contacts, fictional copy, absent client form/domain settings,
and unapproved privacy information must not accidentally pass as a client launch.

Use `npm run validate -- --demo` for demo review. Expected production gaps become
warnings; broken routes, invalid package choices, malformed branding, missing
assets, and inconsistent provider identifiers still fail. This mode is never
production approval. `npm run verify` tests the validator and keeps demo builds
working; it does not treat the demo as launch-ready.

The validator checks enabled-page copy/metadata, public contacts, package/navigation
consistency, internal action targets, local branding/gallery image references,
provider identifier syntax, SEO settings, and required approved privacy sections.
It reads existing config with Vite (already supplied by Astro); it makes no external
network requests, sends no forms, and does not print identifiers, secrets or inquiry
content. Syntax/import failures produce a generic safe error with files to inspect.
Imported image existence is checked; decoding/rights/actual display remain manual.

Warnings cover items that need judgment, including common contrast pairs, intentional
noindex, provider delivery tests, image licensing, and legal/client approval. A zero
error result does not prove accessibility, ownership, legal compliance or delivery.
Keep private evidence outside Git. Complete the launch checklist after automated
checks pass.

This is an explicit check, not a deployment service. It does not alter DNS, accounts,
hosting settings, or block an existing auto-deployment by itself. For an approved
real-client release workflow, use `npm run validate && npm run build` as the build
command (or require equivalent CI checks). Keep the demo's ordinary `npm run build`
so demonstration deployments remain possible. Do not use `--demo` to bypass a real
client's release gate. No hosting command has been changed here.
