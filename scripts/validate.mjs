import process from 'node:process';
import { createServer, loadEnv } from 'vite';
import { validateLaunch } from '../src/lib/launch-validation.ts';

const demo = process.argv.includes('--demo');
if (process.argv.slice(2).some((arg) => arg !== '--demo')) {
  console.error(
    'ERROR command: Use npm run validate, or npm run validate -- --demo.',
  );
  process.exit(1);
}
let server;
try {
  const env = loadEnv('production', process.cwd(), [
    'SITE_URL',
    'ALLOW_INDEXING',
    'PUBLIC_',
    'WEBSITE_PACKAGE',
  ]);
  server = await createServer({
    root: process.cwd(),
    configFile: false,
    logLevel: 'silent',
    server: { middlewareMode: true, hmr: false, watch: null },
    optimizeDeps: { noDiscovery: true, include: [] },
  });
  const load = (name) => server.ssrLoadModule(`/src/config/${name}.ts`);
  const business = (await load('business')).business;
  const home = await load('pageContent');
  const service = await load('serviceContent');
  const contact = await load('contactContent');
  const site = (await load('siteContent')).siteContent;
  const metadata = (await load('pageMetadata')).pageMetadata;
  const privacy = (await load('privacy')).privacy;
  const packageName = env.WEBSITE_PACKAGE?.trim() || 'business';
  if (!['starter', 'business'].includes(packageName)) {
    console.error(
      'ERROR WEBSITE_PACKAGE: Choose starter or business in local/hosting build settings.',
    );
    process.exitCode = 1;
  } else {
    const navigation = (await load('navigation')).navigationFor(packageName);
    const gallery =
      packageName === 'business' ? await load('gallery') : undefined;
    // Ignore disabled-page copy and conditional demo-only banners on a real client site.
    const { demoBanner, footerNotice, footer, ...shared } = site;
    const { demoInformation, ...publicFooter } = footer;
    const content = {
      home: home.homeContent,
      services: service.servicesPageContent,
      serviceLabels: service.serviceLabels,
      contact: contact.contactContent,
      form: contact.formContent,
      messages: contact.formMessages,
      shared,
      footer: publicFooter,
      ...(business.isDemo ? { demoBanner, footerNotice, demoInformation } : {}),
      ...(gallery
        ? {
            about: home.aboutContent,
            philosophy: service.philosophy,
            gallery: gallery.galleryContent,
          }
        : {}),
    };
    const issues = validateLaunch(
      {
        business,
        websitePackage: packageName,
        navigation,
        metadata,
        hero: home.homeContent,
        services: service.services,
        content,
        gallery: gallery?.galleryImages || [],
        privacy,
        environment: env,
      },
      process.cwd(),
      demo,
    );
    console.log(
      demo
        ? 'Demo review — not a production launch approval.'
        : 'Production pre-launch validation (offline).',
    );
    for (const issue of issues)
      console.log(
        `${issue.severity.toUpperCase()} ${issue.field}: ${issue.message}`,
      );
    const errors = issues.filter((i) => i.severity === 'error').length;
    const warnings = issues.length - errors;
    console.log(
      `${errors} error(s), ${warnings} warning(s). ${errors ? 'Resolve errors before launch.' : demo ? 'Demo checks passed; production readiness is not established.' : 'Automated checks passed; manual launch review remains required.'}`,
    );
    process.exitCode = errors ? 1 : 0;
  }
} catch {
  // Never echo arbitrary loader exceptions: they may contain source values or environment data.
  console.error(
    'ERROR configuration: Could not load local configuration/assets. Check src/config imports, referenced image files, and TypeScript syntax; run npm run check. No configuration values were printed.',
  );
  process.exitCode = 1;
} finally {
  await server?.close();
}
