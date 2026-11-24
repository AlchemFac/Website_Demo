# Fernanda Delgado Tango

A single-page Astro website for María Fernanda Delgado García, based on the
existing reusable template. The supporting `/privacy/` route remains a separate
legal-information page. Work stays on `feat/tango-instructor`; the cleaning demo
and promotional-site branch retain their own identity and destinations.

## Run and verify

From the repository root:

```sh
npm ci
npm run dev:tango
npm run verify:tango
```

Development uses port **4340**. `npm run build:tango` outputs `tango-site/dist/`.
`npm run preview:tango` previews the build. Use the Node version supported by the
root `package.json`. No dependency or backend was added for this variation.
The main template's regression suite is `npm run verify`. GitHub Actions now runs
both suites on the tango branch and on pull requests.

## Questionnaire facts and remaining approvals

The completed questionnaire supplies the business name, operator name, public
email/phone, DFW service area, 9 AM–8 PM hours, eight services, an elegant black /
brown / beige preference, and a dancer-silhouette reference. The days and meaning
of the hours are unspecified. They are not described as daily opening hours or
confirmed lesson slots. Descriptive copy is an editorial draft based on her
answers, not a verified training history or biography.

She requests video viewing, a monthly participation calendar, and a contact form.
No actual photos of her, video URLs, event dates, approved review text, social
URLs, prices or booking/cancellation terms were included. Empty portfolio and
calendar states are intentional. Reviews remain hidden until permission-cleared
entries are provided. A logo reference is not a portfolio photo.

## Where to customize

| Information                                             | File                                                         |
| ------------------------------------------------------- | ------------------------------------------------------------ |
| Public identity, contacts, hours, area, colors          | `src/config/instructor.ts` → `instructor`                    |
| Hero, introduction, services, FAQs and metadata         | `src/config/instructor.ts` → `content` and `lessons`         |
| Header/footer anchor links                              | `src/config/instructor.ts` → `navigation`                    |
| Photos, video links, events and approved reviews        | `src/config/portfolio.ts`                                    |
| Form notices and public provider configuration          | `src/config/contact.ts`, `.env.example`                      |
| Privacy practices, contact, approval and effective date | `src/config/privacy.ts`                                      |
| Logo mark and accessible live-text wordmark             | `src/assets/fernanda-logo.png`, `src/components/Brand.astro` |
| Hero and temporary about illustration                   | `src/pages/index.astro`                                      |
| Typography and responsive layout                        | `src/styles/global.css`                                      |

## Logo and imagery

The original generated logo concept takes inspiration from expressive dancer
silhouettes in the supplied reference; it does not reproduce the screenshot or
trace its figures. It uses a transparent background and espresso-brown mark, with
real business-name text beside it on the website. Owner approval is still needed.
See `src/assets/PROVENANCE.md`. The uploaded questionnaire and original reference
are not committed to the repository.

The hero is still a clearly labeled generated dance illustration, not Fernanda or
her students. Replace it with approved photography when available. Suggested
hero: landscape 1800–2400px wide; suggested portrait: 900–1200px tall. JPG, PNG or
WebP originals are suitable. Keep the Astro Image calls for responsive WebP
output, sizes, dimensions, eager hero loading and lazy lower imagery. Desktop
shows the full hero image; mobile keeps its existing crop.

## Portfolio, videos and reviews

Import permission-cleared photo assets in `portfolio.ts` and add `image`, `alt`,
`caption` and `credit`. Add videos with a unique `id`, `title`, `description` and
HTTPS YouTube or Vimeo `url`. Unknown URLs are never embedded as arbitrary HTML.
Players load **only after Play is selected** and can be closed; no external
player is requested on initial page load. There is no autoplay, social feed or
analytics integration. Update privacy information before adding any provider.

Reviews require `quote`, `attribution` and `permissionConfirmed: true`; no ratings
or sample reviews are fabricated. Confirm publication permission before adding.

## Monthly events

Add only actual public events in `portfolio.ts`: unique `id`, `title`, local
`date` as `YYYY-MM-DD`, owner-approved `time`, `location`, `role`, and an optional
HTTPS details URL. Dates and IDs are validated. Leave unknown time/location text
empty rather than guessing. Months can be browsed with keyboard-accessible
buttons; event markers and an agenda reflect only configured dates. The initial
month follows DFW time and is refreshed in the browser, so a static deployment
isn't stuck on the build month. This is a participation calendar, not booking or
availability software. New events require a source update and rebuild.

## Contact form — demo until configured

Direct email and phone use the business contacts supplied in the questionnaire.
Instagram/Facebook icons remain inactive until their approved profile URLs are
provided. WhatsApp remains removed.

The template's shared ContactForm and submission/validation engine accept
site-specific copy and service options; the cleaning demo retains its defaults.
The tango form checks required fields and errors but **sends and saves nothing**
until Fernanda's public identifiers are configured:

```text
PUBLIC_TANGO_FORMSPREE_FORM_ID=
PUBLIC_TANGO_TURNSTILE_SITE_KEY=
```

Both values are required together. Create a client-owned Formspree form, verify
her recipient email and connect a client-owned Turnstile widget with the correct
hostnames. The **secret** goes in Formspree's CAPTCHA settings, never source or
browser code. Do not use the cleaning site's endpoint, recipient, widget or keys.
Review current provider pricing and limits when setting up the accounts.

Before enabling live submission, approve the privacy information and authorize
an integration test. After deployment, verify an accepted response and actual
recipient inbox delivery; provider acceptance does not prove email delivery or
confirm a booking. Also test invalid fields, failed requests, spam verification,
loading and duplicate-submit prevention. No real inquiry was sent during this
update. Contact entries are not logged or stored in browser storage.

## Privacy and launch

The policy is a marked draft. It now reflects direct contacts, demo form behavior,
optional form/spam providers and user-initiated video embeds. Actual hosting,
retention/deletion practices, policy effective date and other bracketed items
still require owner approval and appropriate review. No legal-compliance claim
is made. No residential or fabricated studio address is published.

The preview remains **noindex** and robots disallows crawling. When the actual
site is approved, configure `SITE_URL` in `tango-site/.env.local` or the host,
set `instructor.isPreview=false`, `instructor.contentApproved=true`,
`privacy.clientApproved=true`, and `ALLOW_INDEXING=true` only if indexing is
intended. Do not approve placeholder privacy sections merely to enable a sitemap.
Discovery includes only `/` and `/privacy/` after all gates are satisfied.

For Cloudflare Pages use the repository root, build command `npm run build:tango`,
output `tango-site/dist`, and the tango branch. A Git push can trigger an existing
connected Pages project; review changes before updating that remote branch.
Never change the cleaning project's domain or account configuration accidentally.
See [CLIENT_DETAILS.md](CLIENT_DETAILS.md) for the remaining owner checklist.
