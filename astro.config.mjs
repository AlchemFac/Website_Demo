import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import { writeFile, rm } from 'node:fs/promises';
import process from 'node:process';
import { business } from './src/config/business.ts';
import { navigation } from './src/config/navigation.ts';
import {
  parseSiteUrl,
  indexingAllowed,
  robotsText,
  sitemapXml,
} from './src/config/seo.mjs';

// Vite is already supplied by Astro. No sitemap package is needed for five routes.
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
              sitemapXml(
                site,
                navigation.map((item) => item.href),
              ),
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
