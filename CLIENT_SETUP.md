# Client setup — adapting the website for another business

This is a code template, not an already-operating business. **North Texas Home
Cleaning and its contacts, services, hours, cities, and history are fictional.**
The existing design works without a logo or form account. Customize a separate
client copy, keep demo safeguards on during review, and obtain approval before
publishing or changing DNS.

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

`src/config/navigation.ts` controls shared navigation and sitemap routes. If adding
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
