# Deploying this static Astro site to Cloudflare Pages

This is a runbook, not a record of a deployment. **No Cloudflare project, repository
connection, custom domain, DNS record, or certificate setting has been changed by
this work.** Obtain approval for the first deployment and separately for DNS/cutover.
Dashboard wording can change; the official links below are the reference.

## 1. Review before connecting anything

- Confirm the owner-approved GitHub repository, reviewed commit, and release branch.
- Complete [client setup](../CLIENT_SETUP.md) and the appropriate
  [launch checklist](LAUNCH_CHECKLIST.md). Keep demo labels and indexing disabled
  for a demo or an unfinished client preview.
- Decide who owns the hosting, GitHub, registrar/DNS, and form-provider accounts.
  Use the client's own accounts for a client site, with delegated access as needed.
- Decide whether builds may publish automatically. Connecting Git and selecting
  **Save and Deploy** starts the first build; later pushes/merges may publish too.
  Do not treat connecting the repository as a read-only action.
- For private client review, choose an access-control plan before publishing.
  `noindex` and robots.txt are not passwords or access controls.

No hosting account login, Cloudflare API token, or DNS credential is required to
run this repository's local build. Do not put them in source control.

## 2. Validate the build locally

From the repository root, with Node 24:

```sh
npm ci
npx playwright install chromium
npm run verify
npm run preview
```

Review all five pages and the 404 page at the local preview URL. The full suite
contains formatting, type, SEO, site, and mocked submission checks. It cannot prove
DNS, TLS, provider dashboard settings, or production email delivery.

This repository uses `output: 'static'`; `dist` is the entire deployable site.
No server adapter or Cloudflare Functions setup is needed. Do not create a new
Astro app or replace this project with scaffolding. The homepage assets, optimized
gallery files, and discovery files are already generated/copied by its build.

## 3. Connect GitHub — only after deployment approval

1. In Cloudflare, open **Workers & Pages**, then **Create application → Pages →
   Import an existing Git repository**. Choose the Pages product.
2. Authorize the Cloudflare GitHub app for the intended repository; prefer selected
   repositories. An organization may require an administrator's approval.
3. Select the approved repository and begin setup. Confirm `main` as the production
   branch; do not assume whichever branch is initially shown is correct.
4. Enter this project's build settings and environment values below. Review them
   with the owner before selecting **Save and Deploy**.

References: [Astro on Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)
and [GitHub integration](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/).

| Build setting          | Value                                                         |
| ---------------------- | ------------------------------------------------------------- |
| Framework preset       | Astro                                                         |
| Production branch      | `main`                                                        |
| Root directory         | Leave blank / repository root for this layout                 |
| Build command          | `npm run build`                                               |
| Build output directory | `dist`                                                        |
| Node version           | `24` via `.nvmrc`; explicitly set `NODE_VERSION=24` if needed |

Pages installs dependencies before running the build. Keep the committed lockfile.
If intentionally overriding its install step, Cloudflare supports
`SKIP_DEPENDENCY_INSTALL=1`; in that case use `npm ci && npm run build` as the build
command. Do not set the skip flag while leaving only `npm run build`.
See [build image / Node selection](https://developers.cloudflare.com/pages/configuration/build-image/).

## 4. Configure production and preview build environments

Set environment values in the Pages project settings, selecting the correct
**Production** or **Preview** environment. Treat preview settings as independent;
inspect them rather than assuming they match production or local files.

| Setting                     | Approved production                         | Demo / client preview                                                          |
| --------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------ |
| `NODE_VERSION`              | `24`                                        | `24`                                                                           |
| `SITE_URL`                  | Final root HTTPS origin, no path/query/hash | Blank until chosen; or approved canonical production origin for content review |
| `ALLOW_INDEXING`            | `true` only after launch approval           | `false`                                                                        |
| `PUBLIC_FORMSPREE_FORM_ID`  | Client-owned public form ID                 | Blank or a separate test form ID                                               |
| `PUBLIC_TURNSTILE_SITE_KEY` | Public key for the authorized hostname      | Blank or a separate test-widget public key                                     |

Use both public form settings or neither. Partial/malformed values fail the build.
Store the Turnstile secret **in Formspree**, not in a public variable or this repo.
With both form values blank, the page safely validates locally without sending.
With both configured, it can send test inquiries; its existing fictional/test copy
must be reviewed for a real client. The displayed contact email does not control
the recipient. See [form setup](contact-integration.md).

Values are read during build. Changing them requires rebuilding/deploying;
changing a dashboard variable does not rewrite an already-published static site.
Never deploy either test-fixture output directory instead of `dist`.

`business.isDemo=false` is also required before indexing can become enabled.
That is an owner-approved source edit, not an environment setting. Setting only
`ALLOW_INDEXING=true` intentionally cannot make the fictional demo indexable.

## 5. Control previews and automatic releases

In Pages **Settings → Builds & deployments**, review production and preview branch
controls. Production automation can be disabled; previews can be limited to
selected branches or disabled. Require approval before enabling these behaviors.
See [branch controls](https://developers.cloudflare.com/pages/configuration/branch-build-controls/).

GitHub's verification workflow is separate from Cloudflare's deployment build.
A Pages build need not wait for a GitHub check to finish. Require the verification
status on `main` through GitHub rules, or keep releases manual under an approved
procedure. Do not assume CI automatically prevents publication.

Preview URLs are public by default. Pages offers Access protection for previews,
but that switch does not automatically protect the production `pages.dev` or custom
domain. Confirm exactly which hosts are restricted. Avoid using a client's live
recipient for unattended previews. See [preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/).

## 6. Add the custom domain — separate owner/DNS approval required

In the Pages project, use **Custom domains → Set up a domain** before changing a
DNS record. Associate each approved hostname there first.

- **Apex/root domain:** Pages requires that zone in the same Cloudflare account,
  with its authoritative nameservers configured for Cloudflare.
- **Subdomain:** external DNS can remain in place; add the CNAME shown by Pages,
  targeting the actual project `pages.dev` hostname. Use the dashboard's exact
  values, not a fabricated project name.
- Do not point a CNAME at Pages without completing the custom-domain association.
  Wait for the dashboard to show activation.

Reference: [Pages custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/).

Before a nameserver migration, export/record the existing DNS configuration and
obtain approval for the complete change plan. Preserve mail and verification
records, including MX, SPF, DKIM, and DMARC; a website cutover must not break the
business's email. Check existing DNSSEC arrangements with the DNS owner as well.
Do not delete unrelated records or buy a domain on the owner's behalf.

## 7. Verify HTTPS and one canonical hostname

After DNS/domain activation, wait for certificate readiness and open the exact
hostname over HTTPS without a browser warning. Cloudflare manages certificates
for activated domains; check the actual certificate/hostname status rather than
assuming an application build established TLS. If validation stalls, review the
custom-domain status and any CAA restrictions with the DNS owner. Do not disable
certificate verification or weaken security to hide a setup problem.

Verify HTTP redirects to HTTPS. Where needed, obtain approval to configure HTTPS
and apex/www/production `pages.dev` redirects to the chosen canonical hostname.
A canonical HTML tag does not implement a redirect. Keep paths intact and avoid
redirect loops. Update `SITE_URL` to the approved origin and rebuild.
See [TLS setup and HTTPS](https://developers.cloudflare.com/ssl/get-started/).

## 8. Post-deployment acceptance — manual

These checks apply after an approved deployment; they have not been performed here:

- Verify deployment logs and the exact deployed commit. Open every page directly,
  reload a deep route, and verify a missing URL returns HTTP 404, not an SPA fallback.
- Inspect robots.txt. For approved indexing, confirm the sitemap contains exactly
  the intended canonical page URLs and the 404 page is absent. For preview/demo,
  confirm noindex and crawl blocking remain in place.
- Verify no mixed content or console errors, images load, links/CTAs work, focus is
  visible, and layouts work on actual mobile devices and in supported browsers.
- Configure Formspree domain restrictions and Turnstile allowed hostnames for the
  exact site. Send an authorized sample from that hostname, confirm provider
  acceptance, then have the owner verify the intended inbox and reply-to behavior.
- Test blocked/expired spam verification and failed submission behavior. Mock tests
  do not verify the provider's actual token enforcement or email delivery.
- Review privacy information and hosting headers/CSP. Test CSP with the real widget
  before enforcement; do not break form scripts/frames with an unreviewed policy.

For private review, verify the protection using a signed-out browser. Keep customer
messages, inbox screenshots, and credentials out of Git and build logs.

## 9. Releases, maintenance, and rollback

Record the previous good deployment and source commit in private handoff notes.
After each approved release, smoke-test the public site and form. Review domain
renewal ownership, certificate status, provider limits/spam, and dependency changes
on an agreed maintenance schedule.

For an approved urgent rollback, select a known-good successful production deployment
in Pages **Deployments** and use **Rollback to this deployment**. A preview build
is not a production rollback target. Then revert/fix the source in Git so the next
build does not republish the defect. See [Pages rollbacks](https://developers.cloudflare.com/pages/configuration/rollbacks/).

Rollback of application files does not undo DNS, recipient settings, or provider
configuration. Those need their own owner-approved recovery plan. Environment or
source changes that would publish a new build also require release approval.
