# Customizing this demo

Keep the fictional-business labels while using sample information. Replace related
content together, and verify factual claims before adapting the site for a client.

## Business and branding

Edit `src/config/business.ts` for the business name, sample contact information,
brand colors, tagline, hours, and cities. The header, footer, and Contact page read
from it. Some editorial copy, titles, metadata, and notices live in page files;
search for `North Texas`, `Dallas`, `Plano`, `Frisco`, and `fictional` when rebranding.

Color values in business settings become CSS variables in `BaseLayout.astro`.
Spacing, typography, borders, widths, and shared layout utilities live in
`src/styles/global.css`. Keep page-specific styles scoped in the page/component.

Use the existing `Button`, `SectionHeading`, `PageCTA`, `ServiceCard`, and
`ServiceDetailCard` components. Native navigation should be a link; a form action
should be a button. Use one `h1` per page and sequential heading levels.

Navigation labels and destinations live in `src/config/navigation.ts`.
The navigation breakpoint is 64rem; if changing it, update both the CSS query and
SiteHeader's matchMedia query. Content generally expands at 40rem; some two-column
sections expand at 48rem. Test narrow screens after changing content or breakpoints.

## Service content

`src/config/serviceContent.ts` is the shared source for:

- `id`, `number`, `title`: identifiers, display order labels, and service names.
- `homepage.description` and `homepage.details`: short homepage card copy.
- `summary`, `description`, `includes`, `excludes`: detailed Services page copy.
- The contact form's service choices, generated from the same service list.
- `philosophy`: the About page's intended service principles.

Edit a service title once here rather than separately on each page. Keep IDs stable
where possible: they are used by service anchors and form option values. Adding or
removing services updates all three consumers. Keep homepage copy brief and confirm
that the detailed inclusions do not contradict it. Other page copy and homepage
benefits remain in their corresponding `src/pages/*.astro` files.

## Images

Edit `src/config/gallery.ts` to replace gallery images, captions, and alt text.
Keep image imports in `src/assets/gallery/` so `GalleryCard` and Astro can generate
responsive WebP derivatives. Describe what the image actually depicts. Record the
source and usage rights when replacing generated images with third-party photos.
Remove an AI label only when the replacement is not AI-generated; never label a
stock photo or generated interior as completed customer work.

The homepage uses `public/images/calm-home.svg`, an original illustration with a
separate CC0 notice. Files in `public/` are served unchanged. Do not move the gallery
PNGs into `public/`, which would bypass the existing image optimization pipeline.

## Contact form and demo mode

See [Contact integration](contact-integration.md). The current action is deliberately
called “Check demo form”; validation cannot deliver an inquiry. Keep no-delivery
messages until an approved submission service is connected and tested.

`business.isDemo` controls only the banner. Explicit notices, the title's “Demo”
suffix, and the `noindex, nofollow` directive also require deliberate review in
`BaseLayout.astro`, page content, the footer, and CTA/form components. Flipping one
flag does not make this demo a production business website.

## Review a change

1. Run `npm run format`, then `npm run verify` (install Playwright Chromium first).
2. Use `npm run dev` or `npm run preview` for a visual review. Check mobile navigation,
   long text, image captions, keyboard focus, form errors, and all CTAs.
3. Review `git diff` for unrelated changes before committing. Open a focused pull
   request with a short description and validation results.

Keep new features small. The existing folder structure is sufficient for this site;
new infrastructure, a CMS, or a backend is not required just to edit its content.
