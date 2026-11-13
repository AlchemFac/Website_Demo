# Customization quick reference

The complete, current guide is [CLIENT_SETUP.md](../CLIENT_SETUP.md). It covers
copying a clean template, business name, optional logo, palette, contacts/hours,
services, imagery/provenance, areas, page metadata, and the form destination. It
also identifies demo content that needs editorial review and technical UI text
that intentionally stays in components.

| Edit                                                                       | File                                                                                                           |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Identity, logo, colors, contacts, hours, cities                            | `src/config/business.ts`                                                                                       |
| Home headings, benefits, process, hero image/caption; About copy           | `src/config/pageContent.ts`                                                                                    |
| Services, scopes, philosophy, Services page copy and card labels           | `src/config/serviceContent.ts`                                                                                 |
| Contact introduction, notices, form actions and business-specific statuses | `src/config/contactContent.ts`                                                                                 |
| Gallery introduction, photos, alt text, provenance/captions                | `src/config/gallery.ts`                                                                                        |
| Shared quote CTA, demo banner, footer labels/notices                       | `src/config/siteContent.ts`                                                                                    |
| Search/social titles and descriptions, including 404                       | `src/config/pageMetadata.ts`                                                                                   |
| Navigation/sitemap routes                                                  | `src/config/navigation.ts`                                                                                     |
| Public provider configuration                                              | `src/config/contactForm.ts` and ignored/hosting environment variables                                          |
| Form behavior and generic validation/network errors                        | `src/components/ContactForm.astro`, `src/scripts/contact-form.ts`; [integration notes](contact-integration.md) |
| Domain/indexing                                                            | Ignored local or hosting build settings; [deployment](CLOUDFLARE_PAGES.md)                                     |

Content objects use TypeScript `as const`; components retain their typed props.
Use plain text, not HTML strings. Names in the main introductions and the default
hero caption reuse `business.ts`; regional prose remains editable in the content
objects. Update both offline/configured form notices when adapting for a client.
Do not claim a booking or email delivery merely because Formspree accepted a request.

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
