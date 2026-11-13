import process from 'node:process';
import { loadEnv } from 'vite';

export type WebsitePackage = 'starter' | 'business';
export type PageId = 'home' | 'services' | 'about' | 'gallery' | 'contact';

/** Page limits are content pages; the shared technical 404 is always generated. */
export const packagePages = {
  starter: ['home', 'services', 'contact'],
  business: ['home', 'services', 'about', 'gallery', 'contact'],
} as const satisfies Record<WebsitePackage, readonly PageId[]>;

// One setting for dev, build, navigation and sitemap. Keep the five-page demo default.
// This module is build/server-only; do not import it into client-side scripts.
const env = loadEnv(
  process.env.NODE_ENV || 'production',
  process.cwd(),
  'WEBSITE_PACKAGE',
);
const selectedPackage = env.WEBSITE_PACKAGE?.trim() || 'business';
if (selectedPackage !== 'starter' && selectedPackage !== 'business') {
  throw new Error('WEBSITE_PACKAGE must be starter or business.');
}
export const website: { package: WebsitePackage } = {
  package: selectedPackage,
};
