# Tango with Maria Fernanda

A separate, single-page instructor website built with the existing Astro template.
It reuses the shared Button, ArrowIcon, branding/privacy TypeScript interfaces,
color-validation helper and SEO/robots/sitemap utilities. The original cleaning
site is unchanged. The supporting `/privacy/` route is a legal-information page;
the marketing experience remains one page.

## Run and verify

From the repository root:

```sh
npm ci
npm run dev:tango
npm run verify:tango
```

Development uses port **4340**. `npm run build:tango` outputs `tango-site/dist/`.
`npm run preview:tango` previews that build. Use the repository's supported Node
version (see `package.json`); no new dependency or backend is required.

## What is confirmed

- Instructor: Maria Fernanda.
- Area: Dallas–Fort Worth; no fixed public business/studio address supplied.
- Lessons: private, beginner, couples and groups.
- No logo, prices, booking rules, approved biography/portrait or contact/social
  destinations have been supplied. Introductory copy is proposed, not a verified
  biography. No awards, years of experience, ratings or testimonials are invented.

## Where to customize

| Information                                                   | File                                      |
| ------------------------------------------------------------- | ----------------------------------------- |
| Name, business name, area, contact destinations, colors       | `src/config/instructor.ts` → `instructor` |
| Hero, about, contact copy, FAQs and metadata                  | `src/config/instructor.ts` → `content`    |
| Lesson descriptions, prices, durations                        | `src/config/instructor.ts` → `lessons`    |
| Navigation in header and footer                               | `src/config/instructor.ts` → `navigation` |
| Privacy practices, legal identity, contact and effective date | `src/config/privacy.ts`                   |
| Hero image and about-image reference                          | `src/pages/index.astro`                   |
| Typography, layout and responsive styling                     | `src/styles/global.css`                   |

Email, phone and social values are empty strings by default; UI placeholders are
plain text, not broken links. Add the public email, `phoneDisplay` and a `tel:`
`phoneHref`; social destinations require absolute HTTPS URLs. The site does not
send inquiries or collect bookings. Do not reuse the cleaning demo's Formspree
endpoint, recipient, Turnstile widget or private keys for Maria.

Selecting a lesson shows the lesson name in the contact section, only in memory;
it does not send a request or store personal information. The mobile menu supports
keyboard access, Escape and focus restoration. FAQs use native disclosure markup.

## Images and privacy

`src/assets/tango-salon.png` is an AI-generated demonstration image. See
`src/assets/PROVENANCE.md`. It is clearly labeled and is not Maria or her students.
Replace it with permission-cleared photography if available. Suggested hero:
landscape 1800–2400px wide, dancers to the right with space for text to the left.
Suggested portrait: 900–1200px tall, clear face, uncluttered background. JPG, PNG
or WebP source works; retain the Astro Image calls, responsive widths, explicit
sizes and eager/lazy priorities. The hero is prioritized; the lower image is lazy. Mobile hero sizing accounts for
the tall background crop so the browser does not stretch a tiny image to fill it.

Fonts and assets are self-hosted; there are no social embeds, tracking scripts,
form backends, cookies or browser storage in the application. Hosting and any
future email/booking/payment services have their own processing practices; verify
those and complete the draft privacy policy. Do not invent retention periods or
claim legal compliance. No home address is required by this template; assess any
actual business-disclosure requirements independently.

## Before launch

Use [CLIENT_DETAILS.md](CLIENT_DETAILS.md) as the meeting checklist. Confirm all
copy and lesson descriptions with Maria, replace the contact/social placeholders,
confirm lesson locations and policies, replace/approve illustrative imagery, and
complete an accurate owner-approved privacy policy.

The preview is intentionally **noindex** and `robots.txt` disallows crawling.
There is no sitemap or canonical URL without completed setup. Set the real origin
in `tango-site/.env.local` using `.env.example`, then set `instructor.isPreview`
to false, `instructor.contentApproved` and `privacy.clientApproved` to true only
after actual approval, and `ALLOW_INDEXING=true` if public indexing is intended.
The build emits a sitemap with just `/` and `/privacy/` when all gates are met.
Check both pages' metadata after changing the business name.

For a later approved Cloudflare Pages deployment: repository root remains the
build root, build command `npm run build:tango`, output directory `tango-site/dist`,
and select the tango branch. Set this site's own environment variables in Pages;
never change the existing cleaning site's project or DNS accidentally. No merge,
GitHub push, account configuration, DNS change or deployment is performed here.
