# Contact submission with Formspree

## Status and provider choice

The code supports Formspree HTTPS submissions with Cloudflare Turnstile and a
`_gotcha` honeypot. **No live account, public identifiers, or email delivery have
been configured or verified by this implementation.** With both environment values
blank, the form remains a browser-only demo and sends nothing.

Formspree works with static hosting without private browser API keys. As checked
November 6, 2026, its Free tier allows 50 monthly submissions; Personal is $15/month
or $120/year for 200 monthly submissions. Higher plans offer higher limits. Check
[current plans](https://formspree.io/plans) before purchasing. Cloudflare offers a
[free Turnstile plan](https://developers.cloudflare.com/turnstile/plans/) suitable
for small sites; it does not require moving the website's hosting to Cloudflare.

## Required account setup — site owner

Complete these steps before any real submission test. Do not send passwords or
private API keys to an assistant or commit them to the repository.

1. Create a [Formspree account](https://formspree.io), create a form, and verify its
   recipient email. Configure the intended recipient/notification workflow in that
   dashboard; `business.email` is sample display content, not the delivery destination.
2. Create a Managed widget in [Cloudflare Turnstile](https://dash.cloudflare.com).
   Authorize your actual website hostname. Use a separate test widget/form with
   localhost or a staging hostname for development as appropriate.
3. In Formspree's CAPTCHA settings, select Cloudflare Turnstile and store the widget's
   **secret key there only**. Keep CAPTCHA and provider spam filtering enabled.
   See [Formspree's Turnstile guide](https://help.formspree.io/articles/form-and-project-settings/protecting-your-forms-with-cloudflare-turnstile/).
4. Configure Formspree's [domain restriction](https://help.formspree.io/articles/form-and-project-settings/restrict-to-domain)
   for the intended hostname. Test that setting from the real preview/production
   origin; localhost and preview hosts may need a separate staging setup.
5. Copy only the public Formspree form ID (the last segment of its `/f/` URL) and the
   public Turnstile site key into local/hosting build settings. No private key is
   needed by Astro or the browser.

The provider must actually enforce token verification and its server-side filtering.
The client cannot prove that the dashboard was configured correctly. Before launch,
confirm in staging that a request with a missing/invalid token is rejected by the
provider. Do not weaken spam protection just to make a smoke test pass. Client
validation and honeypots supplement these protections; they do not replace them.

## Configuration

Copy `.env.example` to an ignored `.env` file, or create `.env` in VS Code. Fill in
these **public** build-time values using your own account:

```dotenv
PUBLIC_FORMSPREE_FORM_ID=
PUBLIC_TURNSTILE_SITE_KEY=
```

- Both blank: safe demo mode; no provider or CAPTCHA requests.
- Both configured: test-inquiry mode posts directly to Formspree with Turnstile.
- Partial/malformed configuration: the build fails with a configuration error.

Do not paste the full endpoint into the ID field. The code constructs only
`https://formspree.io/f/<form-id>` and validates that origin again before sending.
These values appear in the built HTML; they are identifiers, not secrets. The
Turnstile secret stays in Formspree, never in a `PUBLIC_` variable or repository.

Restart `npm run dev` after changing `.env`. For static production hosting, set both
variables in the host's **build environment**, rebuild, and redeploy. Changing
runtime environment settings without rebuilding static HTML has no effect.

If your hosting has a Content Security Policy, allow `connect-src https://formspree.io`
and the required Cloudflare script/frame origins. Follow
[Cloudflare's CSP guidance](https://developers.cloudflare.com/turnstile/reference/content-security-policy/)
rather than disabling CSP broadly. Privacy/ad-blocking software or a failed CAPTCHA
load can block submission; the UI offers a retry without bypassing verification.

## Behavior and privacy

Name, email, service, and message are required. Phone is optional, with 7–15 digits
and common formatting characters allowed. Errors are associated with inputs and
focus moves to the first invalid field. Provider field errors use local safe copy;
raw response text is never rendered or logged.

The UI announces sending, disables the fieldset, and ignores duplicate submit events.
It confirms **provider acceptance**, only for a successful HTTP response containing
`ok: true`. It does not claim inbox delivery or a cleaning booking. After acceptance,
resending is blocked until the visitor deliberately starts a new inquiry.

Failures preserve entries, reset the single-use CAPTCHA, and let the visitor retry.
A 20-second timeout or network failure has an ambiguous outcome: the provider might
already have accepted the request. The UI says so and never automatically retries.
This is practical same-page duplicate protection, not cross-device/server idempotency.

The browser sends an explicit field allowlist over HTTPS, omits cookies, and sends
only the site's origin as referrer. There are no application logs, analytics events,
local/session storage writes, or URL parameters containing contact entries. Formspree
and Cloudflare process the data needed for submission/protection under their terms;
review their retention and privacy settings and provide appropriate site privacy
information before collecting real personal information. The site remains fictional
and its sample business contact details have not been replaced.

Without JavaScript, the form remains disabled with an explanation, avoiding an
accidental native GET submission that could expose entries in a URL.

## Automated tests — no actual delivery

```sh
npm ci
npx playwright install chromium
npm run verify
```

The production build uses your actual configuration. The site suite builds a
separate `.site-test-dist/` with both public settings forced blank, even if `.env.local`
contains live settings. `npm run test:submission`
creates a separate ignored `.submission-test-dist/` build with explicit non-credential
fixtures, then intercepts all Formspree and Turnstile requests before navigation.
It tests validation, loading, acceptance, duplicate prevention, field/server/rate-limit
errors, bad responses, network failure, timeouts, CAPTCHA failures/expiry, and honeypots.
**These tests do not contact the provider and do not prove email delivery.** Neither test build overwrites `dist/`. Never deploy `.site-test-dist/` or
`.submission-test-dist/`.
Ports 4322 (site suite) and 4323 (submission suite) must be available. Both test suites explicitly override public settings, so no local account identifiers
are used by the browser tests.

## Manual delivery verification — required before launch

- [ ] Owner configured and verified the recipient and authorized a sample submission.
- [ ] Correct Formspree/Turnstile settings are active for the exact test origin.
- [ ] Rebuild/deploy with the public identifiers. Submit a unique, non-sensitive test
      message from the browser and confirm provider acceptance appears.
- [ ] Find that submission in the correct Formspree dashboard, including the intended
      service/message fields; check its spam folder if necessary.
- [ ] **The owner personally confirms the email arrived in the intended inbox**
      (including checking junk/spam), with the expected fields and reply-to behavior.
- [ ] Verify invalid/missing tokens are rejected by Formspree; verify valid CAPTCHA
      submissions work. Verify expired/blocked CAPTCHA and failed/offline requests
      show useful errors without discarding entries or retrying automatically.
- [ ] Confirm no duplicate requests while sending or after acceptance; check mobile,
      keyboard, and screen-reader behavior with the real widget.
- [ ] Review provider quota, domain restrictions, privacy information, and fictional
      labels before any real client launch.

Record the test date, deployment version, provider submission identifier, and the
owner's delivery confirmation privately. Do not commit test messages, addresses,
provider response bodies, screenshots of inboxes, or secret values.

Current manual-verification status: **NOT PERFORMED — awaiting account configuration.**
