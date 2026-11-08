# Customization quick reference

The complete, current guide is [CLIENT_SETUP.md](../CLIENT_SETUP.md). It covers
copying a clean template, business name, optional logo, palette, contacts/hours,
services, imagery/provenance, areas, page metadata, and the form destination. It
also inventories hardcoded demo content that still needs editorial replacement.

| Edit                                              | File                                                                                                               |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Identity, logo, colors, contacts, hours, cities   | `src/config/business.ts`                                                                                           |
| Search/social titles and descriptions             | `src/config/pageMetadata.ts`                                                                                       |
| Shared services, card summaries, About principles | `src/config/serviceContent.ts`                                                                                     |
| Photos, alt text, provenance labels/captions      | `src/config/gallery.ts`                                                                                            |
| Navigation/sitemap routes                         | `src/config/navigation.ts`                                                                                         |
| Editorial headings, regional copy, notices        | `src/pages/*.astro` and identified shared components                                                               |
| Form behavior / provider setup                    | `src/components/ContactForm.astro`, `src/scripts/contact-form.ts`, and [integration notes](contact-integration.md) |
| Domain/indexing                                   | Ignored local or hosting build settings; see [deployment](CLOUDFLARE_PAGES.md)                                     |

Reuse existing components and keep page-specific styles scoped. Shared spacing,
fonts, layout, and fallback tokens live in `src/styles/global.css`. The navigation
breakpoint is 64rem and must match `SiteHeader.astro`'s media query. Content uses
40rem and 48rem breakpoints; review long content after changing them.

Keep one h1 per page and sequential heading levels. Navigation is a link; form
actions are buttons. Preserve visible keyboard focus, labels, and descriptive image
alternatives. Default generated imagery is demonstration content, never proof of jobs.

Run `npm run format`, `npm run verify`, and a visual production preview before a
release. Follow the [launch checklist](LAUNCH_CHECKLIST.md). Do not deploy, connect
hosting automation, or change DNS without the owner's approval.
