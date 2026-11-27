import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calendarDays,
  currentDfwMonth,
  eventsForMonth,
  validEventDate,
} from '../tango-site/src/config/calendar.ts';
import { videoEmbed, localVideoPath } from '../tango-site/src/config/media.ts';

test('calendar handles leap years and fills complete weeks', () => {
  assert.equal(calendarDays(2028, 1).filter(Boolean).length, 29);
  assert.equal(calendarDays(2027, 1).filter(Boolean).length, 28);
  assert.equal(calendarDays(2026, 10).length % 7, 0);
  assert.equal(calendarDays(2026, 10).filter(Boolean)[0].date, '2026-11-01');
});
test('current month follows DFW even while UTC is already in the next month', () => {
  assert.deepEqual(currentDfwMonth(new Date('2027-01-01T01:00:00Z')), {
    year: 2026,
    month: 11,
  });
});
test('event filtering respects the month and sorts public dates', () => {
  const data = [
    { date: '2026-12-20' },
    { date: '2027-12-01' },
    { date: '2026-12-02' },
    { date: '2026-11-30' },
  ];
  assert.deepEqual(
    eventsForMonth(data, 2026, 11).map((x) => x.date),
    ['2026-12-02', '2026-12-20'],
  );
});
test('invalid event dates cannot silently roll into another month', () => {
  assert.equal(validEventDate('2027-02-29'), false);
  assert.equal(validEventDate('2028-02-29'), true);
  assert.equal(validEventDate('2026-13-01'), false);
  assert.equal(validEventDate('not a date'), false);
});
test('approved video links resolve only to supported privacy-conscious players', () => {
  assert.equal(
    videoEmbed('https://youtu.be/abcdefghijk'),
    'https://www.youtube-nocookie.com/embed/abcdefghijk',
  );
  assert.equal(
    videoEmbed('https://www.youtube.com/watch?v=abcdefghijk'),
    'https://www.youtube-nocookie.com/embed/abcdefghijk',
  );
  assert.equal(
    videoEmbed('https://vimeo.com/123456789'),
    'https://player.vimeo.com/video/123456789?dnt=1',
  );
});
test('video embeds reject arbitrary origins, credentials and script URLs', () => {
  for (const value of [
    'javascript:alert(1)',
    'https://youtube.com.attacker.test/watch?v=abcdefghijk',
    'https://user:secret@youtube.com/watch?v=abcdefghijk',
    'http://youtu.be/abcdefghijk',
    'https://example.com/video',
  ])
    assert.equal(videoEmbed(value), undefined);
});

test('local video paths cannot escape the media directory or use another origin', () => {
  assert.equal(
    localVideoPath('/media/tango-practice.mp4'),
    '/media/tango-practice.mp4',
  );
  for (const value of [
    'https://example.com/clip.mp4',
    '//example.com/clip.mp4',
    '/media/../clip.mp4',
    '/media/%2e%2e/clip.mp4',
    '/media/clip.MOV',
    '/media/clip.mp4?token=anything',
    '/private/clip.mp4',
  ])
    assert.equal(localVideoPath(value), undefined);
});

test('committed video assets stay inside the free Pages per-file size limit', async () => {
  const { stat, readdir } = await import('node:fs/promises');
  const directory = new URL('../tango-site/public/media/', import.meta.url);
  for (const name of await readdir(directory)) {
    const file = await stat(new URL(name, directory));
    assert.ok(
      file.size > 0 && file.size < 25 * 1024 * 1024,
      `Keep ${name} below 25 MiB for Cloudflare Pages.`,
    );
  }
});
