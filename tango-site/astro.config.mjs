import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import { writeFile, rm } from 'node:fs/promises';
import { instructor, lessons } from './src/config/instructor.ts';
import { privacy } from './src/config/privacy.ts';
import { checkBranding } from '../src/lib/branding-checks.ts';
import { homeContent } from '../src/config/pageContent.ts';
import { business } from '../src/config/business.ts';
import {
  parseSiteUrl,
  indexingAllowed,
  robotsText,
  sitemapXml,
} from '../src/config/seo.mjs';

const root = new URL('.', import.meta.url);
const env = loadEnv(process.env.NODE_ENV || 'production', root.pathname, [
  'SITE_URL',
  'ALLOW_INDEXING',
]);
const site = parseSiteUrl(env.SITE_URL);
const approved =
  !instructor.isPreview && instructor.contentApproved && privacy.clientApproved;
const indexable = indexingAllowed(site, env.ALLOW_INDEXING, !approved);
if (
  !instructor.name.trim() ||
  !instructor.businessName.trim() ||
  lessons.length === 0
)
  throw new Error(
    'Provide instructor name, business name and at least one lesson in tango-site/src/config/instructor.ts.',
  );
// Reuse the template's color checks. Original template assets remain unchanged.
const brandingIssues = checkBranding(
  {
    ...business,
    branding: { ...business.branding, colors: instructor.colors },
  },
  homeContent,
  new URL('..', root).pathname,
);
if (brandingIssues.some((issue) => issue.severity === 'error'))
  throw new Error(
    `Invalid tango branding: ${brandingIssues
      .filter((issue) => issue.severity === 'error')
      .map((issue) => issue.field)
      .join(', ')}`,
  );

export default defineConfig({
  output: 'static',
  site: site?.href,
  trailingSlash: 'always',
  integrations: [
    {
      name: 'tango-site-discovery',
      hooks: {
        'astro:build:done': async ({ dir }) => {
          await writeFile(
            new URL('robots.txt', dir),
            robotsText(site, indexable),
          );
          if (indexable)
            await writeFile(
              new URL('sitemap.xml', dir),
              sitemapXml(site, ['/', '/privacy/']),
            );
          else await rm(new URL('sitemap.xml', dir), { force: true });
        },
      },
    },
  ],
});
