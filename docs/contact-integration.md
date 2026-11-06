# Contact form: demo and future integration

The Contact page is a browser-only validation demo. No request endpoint, backend,
email delivery, browser storage, or third-party form service has been configured.
The action is labeled “Check demo form”; passing validation never means delivery.
Without JavaScript, its fieldset is disabled and an explanation is shown.

## Content locations

- `src/config/business.ts`: sample business name, phone, email, hours, and areas.
  Contact details remain plain text because this is a fictional company.
- `src/config/serviceContent.ts`: service names used by the form select.
- `src/components/ContactForm.astro`: field requirements, validation, accessible
  error messages, and a `FUTURE INTEGRATION` marker in the submit handler.
- `src/config/gallery.ts`: photo sources, captions, and descriptive alternative text.
- `src/assets/gallery/README.md`: image provenance and replacement guidance.

## Before accepting real submissions

1. Choose an authorized submission service and its destination. Keep service secrets
   out of client-side code. No provider or endpoint is assumed by this demo.
2. Add provider-side validation and abuse protection; browser checks alone are not
   authoritative. Agree on handling of contact data and publish the relevant privacy notice.
3. Replace the marker with the integration. Preserve input on failures, prevent
   duplicate sends while pending, and announce accessible pending, error, and
   success states. Claim delivery only after the provider confirms acceptance.
4. Replace and verify fictional business details. Update demo copy, no-JavaScript
   behavior, and button labels consistently only once submission actually works.
5. Test actual delivery, network failures, provider errors, retries, keyboard use,
   screen-reader announcements, and mobile layouts.

## Demo verification

- Empty/whitespace-only required values show associated errors and focus the first
  invalid field. Email uses HTML email validity; optional phone accepts 7–15 digits
  with common formatting punctuation. Name, email, and message have length limits.
- Corrected fields clear errors. Passing validation announces explicitly that
  nothing was sent or saved. Editing clears that result.
- No form interaction should create a network request or write to local/session storage.
