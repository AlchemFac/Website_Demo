# Client configuration

Start with [CLIENT_SETUP.md](../../CLIENT_SETUP.md) for the editing order, required
and optional values, and fictional replacement examples. Edit these existing files
in place; there is no second client object, generated config, or CMS to synchronize.
The checked-in values intentionally remain the North Texas cleaning demo.

| File                | Owns                                                                                              |
| ------------------- | ------------------------------------------------------------------------------------------------- |
| `business.ts`       | Public name, description, contacts, hours, cities, tagline, colors, optional logo and demo status |
| `serviceContent.ts` | Shared offerings, scopes, philosophy, Services page copy and card labels                          |
| `pageContent.ts`    | Home and About headings, descriptions, benefits, process, regional copy, hero asset and page CTAs |
| `contactContent.ts` | Contact page and form wording for both offline and configured submission modes                    |
| `gallery.ts`        | Gallery introduction, images, alt text and truthful provenance/captions                           |
| `siteContent.ts`    | Shared quote destination/label, header demo banner and footer/CTA notices                         |
| `pageMetadata.ts`   | Page-specific search/social titles and descriptions, including 404                                |
| `website.ts`        | Validates `WEBSITE_PACKAGE`; Starter has Home/Services/Contact, Business adds About/Gallery       |
| `privacy.ts`        | Optional auxiliary Privacy page, draft sections and explicit client approval                      |
| `navigation.ts`     | Page registry filtered by package for header, footer, optional builds and sitemap                 |
| `contactForm.ts`    | Validates public build variables and derives the allowed Formspree endpoint                       |
| `seo.mjs`           | Validates the production origin and generates discovery files; not client copy                    |

`BusinessConfig`, `BusinessLogo`, `BrandColors`, `Service`, `PageMetadata`, and
`ContactFormConfig` describe the main shapes beside their existing values. TypeScript
`satisfies` checks those shapes without changing the demo values. Other content
objects use TypeScript inference; they do not need an interface for every sentence.
Keep required object keys and readable field names. Array lengths and IDs still need
editorial review: TypeScript does not verify coverage, business claims, unique service
IDs, working links, image rights, color contrast, or actual email delivery.

Only owner-approved **public** business information belongs in these files. Never
store customer inquiries, private phone numbers, passwords, API secrets, or a
Turnstile secret here. Even a private Git repository is not a secret store.

The form is optional. Leave both public provider values blank to keep offline demo
mode, or configure both through ignored `.env.local` / hosting build settings.
The recipient and Turnstile secret belong in Formspree. See the
[form setup guide](../../docs/contact-integration.md). A new client needs their own
provider configuration; do not reuse this demo owner's recipient or account.

Run `npm run verify` after editing, then review actual content in a browser. Keep
fictional notices and `business.isDemo=true` for this demo; a working form does not
turn it into a real business. Changes here do not publish until a deployment occurs.

`WEBSITE_PACKAGE` is optional: unset/blank means `business`; `starter` emits only
three content pages. About/Gallery templates live in `src/page-templates/` and are
injected only when enabled. The shared 404 is always built. Restart/rebuild after
changing the setting; see CLIENT_SETUP.md for the preset table and test commands.

Build-time branding checks use `src/lib/branding-checks.ts`. For a client release,
run `npm run validate`; for intentional demo review use `npm run validate -- --demo`.
The strict command flags the default demo as unfinished; see CLIENT_SETUP.md for
errors versus warnings and manual checks.
