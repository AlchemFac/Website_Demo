import test from 'node:test';
import assert from 'node:assert/strict';
import { getContactCopy } from '../src/config/contactContent.ts';

test('production contact copy contains no fictional or test-inquiry messaging', () => {
  const copy = getContactCopy(false);
  assert.doesNotMatch(
    JSON.stringify(copy),
    /fictional|demo|test inquir|sample details/i,
  );
  assert.equal(copy.formContent.configuredSubmit, 'Send inquiry');
  assert.match(
    copy.formMessages.acceptedStatus,
    /accepted your inquiry for processing/,
  );
  assert.match(
    copy.formMessages.acceptedStatus,
    /not a booking confirmation or proof of email delivery/,
  );
});
test('offline demo explicitly sends and saves nothing', () => {
  const copy = getContactCopy(true);
  assert.match(copy.formContent.offlineNotice, /does not send or save/);
  assert.equal(copy.formContent.offlineSubmit, 'Check demo form');
  assert.match(
    copy.formMessages.offlineSuccess,
    /nothing has been sent or saved/,
  );
});
test('production without a provider never claims a submission', () => {
  const copy = getContactCopy(false);
  assert.match(copy.formContent.offlineNotice, /nothing is sent or saved/);
  assert.match(
    copy.formMessages.offlineSuccess,
    /nothing has been sent or saved/,
  );
  assert.match(copy.contactContent.offlineDescription, /unavailable/);
});
