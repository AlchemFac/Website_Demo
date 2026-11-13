# Final launch checklist

Use this checklist per client and per production hostname. **The current site is a
fictional demo; this file does not approve or record a deployment.** Keep account
IDs, signatures, credentials, and personal test messages in private handoff records.

## Approval and ownership

- [ ] Owner approved the business identity, services, contact channels, hours, and areas.
- [ ] Owner approved the final design, logo, imagery/usage rights, and all page copy.
- [ ] GitHub, Cloudflare, domain/DNS, and form accounts have agreed ownership/access.
- [ ] The exact release commit, target hostname, and initial deployment are approved.
- [ ] Automatic production/preview deployment behavior is explicitly approved or disabled.
- [ ] DNS/custom-domain cutover is separately approved, with a recovery plan.
- [ ] A previous good production deployment/source reference is known, if applicable.

## Template conversion

- [ ] Completed [CLIENT_SETUP.md](../CLIENT_SETUP.md), including the demo-content inventory.
- [ ] Real business name, optional logo, tagline, colors, and metadata are correct.
- [ ] Replaced all sample contacts, hours, cities, service scopes, and geographic prose.
- [ ] Body copy, quote claims, form labels, and acceptance messages reflect the actual offer.
- [ ] No fabricated experience, credentials, testimonials, review ratings, or addresses.
- [ ] Image descriptions, captions, provenance labels, and licenses match the actual assets.
- [ ] Privacy information covers the real business and its form providers/data practices.
- [ ] Fictional/sample/test notices are removed only where a verified replacement exists.
- [ ] `business.isDemo` and indexing settings match whether this is still a demo or a real launch.

## Code and build

- [ ] Node 24 is selected; source and `package-lock.json` are reviewed and committed.
- [ ] `npm ci` succeeded in the reviewed checkout.
- [ ] `npm run format:check` and `npm run check` passed.
- [ ] `npm run test:seo`, `npm test`, and `npm run test:submission` passed.
- [ ] `npm run build` succeeded; production artifact is **only `dist`**.
- [ ] Viewed the actual production build with `npm run preview`.
- [ ] No `.env.local`, private keys, customer data, screenshots of inboxes, or test artifacts are committed.
- [ ] No new backend, worker, adapter, or infrastructure was added accidentally.
- [ ] The Pages build command/output/root and production branch match the deployment guide.

## Environment and search discovery

- [ ] Production/preview environment settings were reviewed independently.
- [ ] `SITE_URL` is the exact approved HTTPS origin, or blank for an unassigned demo.
- [ ] Production form identifiers belong to this client; preview is disabled or isolated.
- [ ] Turnstile secret is stored only in Formspree, never browser code.
- [ ] Rebuilt after changing source, environment settings, or the canonical hostname.
- [ ] For a demo/preview, `ALLOW_INDEXING=false` and noindex/crawl blocking are present.
- [ ] For an approved indexable business, `business.isDemo=false` and `ALLOW_INDEXING=true`.
- [ ] Canonicals use the final origin; robots.txt and sitemap agree with the release decision.
- [ ] Sitemap contains only intended canonical routes; no 404, local, or fixture URLs.
- [ ] Private previews require authentication; robots/noindex alone are not access control.

## Domain, DNS, HTTPS — manual after approval

- [ ] Associated the correct hostname in Pages Custom domains before approved DNS edits.
- [ ] Recorded existing DNS and preserved mail/verification records; reviewed DNSSEC if moving nameservers.
- [ ] Confirmed domain activation and a valid certificate for the exact hostname.
- [ ] Verified HTTP → HTTPS and chosen www/apex/Pages hostname redirects without loops.
- [ ] DNS and certificate setup did not interrupt the business's email or other services.
- [ ] Confirmed security headers/CSP without blocking the real form or CAPTCHA.
- [ ] A missing URL returns HTTP 404 and the intended page, not a misleading HTTP 200 fallback.

## Browser and form — manual on the final origin

- [ ] All pages, direct/deep links, navigation, service anchors, and CTAs work.
- [ ] Images load at reasonable sizes with no broken assets or avoidable layout shifts.
- [ ] Layouts work on physical mobile devices and in supported Safari/Chrome/Firefox browsers.
- [ ] Keyboard menu, skip link, visible focus, sticky CTA clearance, and zoom work.
- [ ] Screen-reader labels/headings/errors/status messages and the real Turnstile widget are usable.
- [ ] Form recipient, Formspree domain restrictions, and Turnstile hostnames are verified.
- [ ] Invalid fields cannot submit; missing/invalid/expired CAPTCHA is rejected by the provider.
- [ ] An authorized sample was accepted from the final hostname and appeared in the correct provider dashboard.
- [ ] **Owner confirmed actual inbox receipt**, expected field values, and reply-to behavior.
- [ ] Loading/duplicate protection, offline/network error, and retry paths preserve entries and explain uncertainty.
- [ ] No real contact data appears in application logs, analytics events, URLs, or source control.

## Sign-off and maintenance

- [ ] Record approver, commit, deployment ID, hostname, date, and inbox-test confirmation privately.
- [ ] Owner has a supported content-update and release workflow plus rollback instructions.
- [ ] Domain renewal, provider quotas/spam, inbox monitoring, and account access have assigned owners.
- [ ] Dependency updates will use reviewed pull requests and the verification suite.
- [ ] Do a final signed-out public-site smoke test and archive the approved handoff notes.

## Preparation verification is separate from launch

Local build/test results for this template do not check off the client-specific,
hosting, DNS, or manual inbox items above. The historical review and local demo
inbox confirmation are in `production-readiness.md` and `contact-integration.md`.
Repeat the relevant checks for every new business and hostname.

## Automated client gate

- [ ] Run `npm run validate` and resolve all errors; do not substitute `--demo` for a client release.
- [ ] Review warnings and confirm client-approved privacy sections, actual image rights and provider ownership.
- [ ] After deployment approval, manually verify the deployed hostname, token enforcement and recipient delivery; automated checks cannot establish them.

See [validator instructions](../CLIENT_SETUP.md#pre-launch-validation-offline). The
existing demo remains buildable and is not represented as production-ready.
