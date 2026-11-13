import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import { writeFile, rm } from 'node:fs/promises';
import process from 'node:process';
import { business } from './src/config/business.ts';
import { homeContent } from './src/config/pageContent.ts';
import { checkBranding } from './src/lib/branding-checks.ts';
import { privacy } from './src/config/privacy.ts';
import { navigation } from './src/config/navigation.ts';
import {
  parseSiteUrl,
  indexingAllowed,
  robotsText,
  sitemapXml,
} from './src/config/seo.mjs';

// Vite is already supplied by Astro. No sitemap dependency is needed.
const env = loadEnv(process.env.NODE_ENV || 'production', process.cwd(), [
  'SITE_URL',
  'ALLOW_INDEXING',
]);
const site = parseSiteUrl(env.SITE_URL);
const indexable = indexingAllowed(site, env.ALLOW_INDEXING, business.isDemo);

export default defineConfig({
  output: 'static',
  site: site?.href,
  trailingSlash: 'always',
  integrations: [
    {
      name: 'website-package-pages',
      hooks: {
        'astro:config:setup': ({ injectRoute, addWatchFile, logger }) => {
          const issues = checkBranding(business, homeContent, process.cwd());
          for (const issue of issues)
            logger.warn(`${issue.field}: ${issue.message}`);
          if (issues.some((issue) => issue.severity === 'error'))
            throw new Error(
              'Invalid branding configuration; fix the fields listed above.',
            );
          addWatchFile(new URL('./src/config/website.ts', import.meta.url));
          addWatchFile(new URL('./src/config/navigation.ts', import.meta.url));
          addWatchFile(new URL('./src/config/privacy.ts', import.meta.url));
          if (privacy.enabled)
            injectRoute({
              pattern: '/privacy/',
              entrypoint: './src/page-templates/privacy.astro',
              prerender: true,
            });
          for (const page of navigation) {
            if (page.template) {
              injectRoute({
                pattern: page.href,
                entrypoint: page.template,
                prerender: true,
              });
            }
          }
        },
      },
    },
    {
      name: 'static-site-discovery',
      hooks: {
        'astro:build:done': async ({ dir }) => {
          await writeFile(
            new URL('robots.txt', dir),
            robotsText(site, indexable),
          );
          if (indexable) {
            await writeFile(
              new URL('sitemap.xml', dir),
              sitemapXml(site, [
                ...navigation.map((item) => item.href),
                ...(privacy.enabled && privacy.clientApproved
                  ? ['/privacy/']
                  : []),
              ]),
            );
          } else {
            // Do not leave a previous release sitemap behind in a demo/staging build.
            await rm(new URL('sitemap.xml', dir), { force: true });
          }
        },
      },
    },
  ],
});
