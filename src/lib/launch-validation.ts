import { existsSync, statSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import type { BusinessConfig } from '../config/business.ts';
import type { Service } from '../config/serviceContent.ts';
import type { PrivacyConfig } from '../config/privacy.ts';
import { parseSiteUrl } from '../config/seo.mjs';
import { checkBranding, type ConfigIssue } from './branding-checks.ts';

interface NavigationPage {
  id: string;
  href: string;
  template?: string;
}
export interface LaunchConfig {
  business: BusinessConfig;
  websitePackage: string;
  navigation: readonly NavigationPage[];
  metadata: Record<string, { title?: string; description?: string }>;
  hero: {
    heroImageSrc: string;
    heroImageAlt: string;
    heroImageWidth: number;
    heroImageHeight: number;
  };
  services: readonly Service[];
  content: Record<string, unknown>;
  gallery: readonly {
    src: unknown;
    title: string;
    alt: string;
    label: string;
    caption: string;
  }[];
  privacy: PrivacyConfig;
  environment: Record<string, string | undefined>;
}
const routes = {
  starter: { home: '/', services: '/services/', contact: '/contact/' },
  business: {
    home: '/',
    services: '/services/',
    about: '/about/',
    gallery: '/gallery/',
    contact: '/contact/',
  },
};
const placeholder =
  /\b(fictional|demo|sample|todo|placeholder|draft|replace me|lorem ipsum|changeme)\b|test inquir|\bno real\b|draft placeholder|client approval required|\bexample (services?|scopes?|locations?)\b|\billustrative\b/i;
const blank = (value: unknown) => typeof value !== 'string' || !value.trim();

/** Pure local checks. Messages contain field names/remedies, never user-entered values. */
export function validateLaunch(
  config: LaunchConfig,
  root: string,
  demo = false,
): ConfigIssue[] {
  const issues: ConfigIssue[] = [];
  const add = (
    severity: ConfigIssue['severity'],
    field: string,
    message: string,
  ) => issues.push({ severity, field, message });
  const launch = (field: string, message: string) =>
    add(demo ? 'warning' : 'error', field, message);
  const required = (value: unknown, field: string) => {
    if (blank(value))
      launch(
        field,
        'Supply nonempty client-approved public content in this field.',
      );
  };
  const scan = (value: unknown, field: string) => {
    if (
      typeof value === 'string' &&
      blank(value) &&
      /(?:title|description|label|introduction)$/i.test(field)
    )
      launch(field, 'Supply nonempty client-approved public content.');
    if (typeof value === 'string' && placeholder.test(value))
      launch(
        field,
        'Replace demo/draft wording with approved client copy; preserve truthful image provenance.',
      );
    else if (Array.isArray(value))
      value.forEach((item, index) => scan(item, `${field}[${index}]`));
    else if (value && typeof value === 'object')
      for (const [key, item] of Object.entries(value))
        scan(item, `${field}.${key}`);
  };
  const b = config.business;
  issues.push(...checkBranding(b, config.hero, root));
  if (b.isDemo)
    launch(
      'business.isDemo',
      'Keep true for the demo; set false only after client content and launch approval.',
    );
  for (const field of ['name', 'description'] as const) {
    required(b[field], `business.${field}`);
    scan(b[field], `business.${field}`);
  }
  if (b.name === 'North Texas Home Cleaning')
    launch(
      'business.name',
      'Replace the default demo identity with the approved client business name.',
    );
  scan(b.branding.tagline, 'business.branding.tagline');
  if (!Array.isArray(b.hours) || !b.hours.length)
    launch('business.hours', 'Provide at least one approved schedule row.');
  for (const [i, row] of b.hours.entries()) {
    required(row.days, `business.hours[${i}].days`);
    required(row.hours, `business.hours[${i}].hours`);
    scan(row, `business.hours[${i}]`);
  }
  if (!b.serviceAreas.length)
    launch(
      'business.serviceAreas',
      'Provide at least one confirmed area or deliberately adapt the service-area sections.',
    );
  b.serviceAreas.forEach((area, i) => {
    required(area, `business.serviceAreas[${i}]`);
    scan(area, `business.serviceAreas[${i}]`);
  });
  const digits = b.phone.display.replace(/\D/g, '');
  if (
    !/^tel:\+[1-9]\d{6,14}$/.test(b.phone.href) ||
    !/^[+\d\s().-]+$/.test(b.phone.display) ||
    digits.length < 7 ||
    digits.length > 15 ||
    !b.phone.href.slice(5).endsWith(digits)
  )
    launch(
      'business.phone',
      'Use a valid public display number and matching tel:+countrycode URI (7–15 digits).',
    );
  if (/55501\d{2}/.test(digits))
    launch(
      'business.phone',
      'Replace the reserved demonstration phone number with an approved public business channel.',
    );
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email))
    launch('business.email', 'Supply a valid approved public email address.');
  if (/@(?:example\.(?:com|net|org)|[^@]+\.(?:test|invalid))$/i.test(b.email))
    launch(
      'business.email',
      'Replace the reserved/example email address; this check does not verify ownership or delivery.',
    );
  const selected = routes[config.websitePackage as keyof typeof routes];
  if (!selected)
    add(
      'error',
      'WEBSITE_PACKAGE',
      'Choose starter or business in local/hosting build settings.',
    );
  const enabledRoutes = new Set(config.navigation.map((p) => p.href));
  if (config.privacy.enabled) enabledRoutes.add('/privacy/');
  if (selected) {
    const expected = Object.entries(selected);
    if (
      config.navigation.length !== expected.length ||
      expected.some(
        ([id, href]) =>
          !config.navigation.some(
            (page) => page.id === id && page.href === href,
          ),
      )
    )
      add(
        'error',
        'navigation',
        'Match the selected preset: Starter has 3 marketing pages, Business has 5. Privacy is separate.',
      );
  }
  if (
    new Set(config.navigation.map((p) => p.id)).size !==
      config.navigation.length ||
    new Set(config.navigation.map((p) => p.href)).size !==
      config.navigation.length
  )
    add(
      'error',
      'navigation',
      'Remove duplicate IDs/paths from the page registry.',
    );
  for (const page of config.navigation) {
    const entry =
      page.template ||
      (page.href === '/'
        ? 'src/pages/index.astro'
        : `src/pages/${page.id}.astro`);
    if (
      !/^\/(?!\/)/.test(page.href) ||
      /[?#]/.test(page.href) ||
      !existsSync(resolve(root, entry))
    )
      add(
        'error',
        `navigation.${page.id}`,
        'Use a local route with an existing Astro entrypoint; review src/config/navigation.ts.',
      );
    const metadata = config.metadata[page.id];
    required(metadata?.title, `pageMetadata.${page.id}.title`);
    required(metadata?.description, `pageMetadata.${page.id}.description`);
    scan(metadata, `pageMetadata.${page.id}`);
  }
  for (const key of ['title', 'description'] as const)
    required(config.metadata.notFound?.[key], `pageMetadata.notFound.${key}`);
  const titles = config.navigation
    .map((page) => config.metadata[page.id]?.title)
    .filter(Boolean);
  if (new Set(titles).size !== titles.length)
    launch('pageMetadata', 'Give enabled pages unique titles.');
  if (!config.services.length)
    launch('services', 'Provide at least one approved offering.');
  if (new Set(config.services.map((s) => s.id)).size !== config.services.length)
    add('error', 'services', 'Give each offering a unique stable ID.');
  config.services.forEach((service, i) => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(service.id))
      add(
        'error',
        `services[${i}].id`,
        'Use a stable lowercase hyphenated ID for anchors and form options.',
      );
    for (const field of ['title', 'description', 'summary'] as const)
      required(service[field], `services[${i}].${field}`);
  });
  scan(config.services, 'services');
  scan(config.content, 'content');
  const checkLinks = (value: unknown, field: string) => {
    if (!value || typeof value !== 'object') return;
    for (const [key, item] of Object.entries(value)) {
      if (/href$/i.test(key) && typeof item === 'string') {
        try {
          const url = new URL(item, 'https://internal.invalid');
          if (
            url.origin !== 'https://internal.invalid' ||
            !enabledRoutes.has(url.pathname)
          )
            throw new Error();
        } catch {
          add(
            'error',
            `${field}.${key}`,
            'Point this internal action at an enabled page, such as /contact/.',
          );
        }
      } else checkLinks(item, `${field}.${key}`);
    }
  };
  checkLinks(config.content, 'content');
  if (config.websitePackage === 'business') {
    if (!config.gallery.length)
      launch(
        'galleryImages',
        'Provide reviewed gallery imagery and truthful provenance.',
      );
    config.gallery.forEach((image, i) => {
      for (const field of ['title', 'alt', 'label', 'caption'] as const)
        required(image[field], `galleryImages[${i}].${field}`);
      const src =
        typeof image.src === 'string'
          ? image.src
          : (image.src as { src?: string } | null)?.src;
      const file = src?.startsWith('/src/assets/')
        ? resolve(root, `.${src}`)
        : undefined;
      if (
        !file ||
        !file.startsWith(resolve(root, 'src/assets') + sep) ||
        !existsSync(file) ||
        !statSync(file).isFile() ||
        !/\.(png|jpe?g|webp|avif)$/i.test(file)
      )
        add(
          'error',
          `galleryImages[${i}].src`,
          'Import an existing local gallery image from src/assets/; review its rights and actual dimensions.',
        );
    });
  }
  const env = config.environment;
  let site;
  try {
    site = parseSiteUrl(env.SITE_URL);
  } catch {
    add(
      'error',
      'SITE_URL',
      'Use an HTTPS root origin with no path, query, credentials, or fragment.',
    );
  }
  if (
    site &&
    /(?:\.example|\.test|\.invalid|example\.(?:com|net|org))$/i.test(
      site.hostname,
    )
  )
    launch(
      'SITE_URL',
      'Replace the reserved/example origin with the approved production domain.',
    );
  if (!site)
    launch(
      'SITE_URL',
      'Configure the approved production HTTPS origin before launch.',
    );
  if (env.ALLOW_INDEXING && !['true', 'false'].includes(env.ALLOW_INDEXING))
    add(
      'error',
      'ALLOW_INDEXING',
      'Use exactly true or false; keep false for demos/previews.',
    );
  if (env.ALLOW_INDEXING === 'true' && (b.isDemo || !site))
    launch(
      'SEO/indexing',
      'Indexing requires a valid SITE_URL and approved non-demo content.',
    );
  if (env.ALLOW_INDEXING !== 'true')
    add(
      'warning',
      'ALLOW_INDEXING',
      'Indexing remains blocked. Enable it only for an approved public launch; noindex is not access control.',
    );
  const formId = env.PUBLIC_FORMSPREE_FORM_ID?.trim() || '',
    siteKey = env.PUBLIC_TURNSTILE_SITE_KEY?.trim() || '';
  if (!formId && !siteKey)
    launch(
      'contactForm',
      'Configure both public identifiers in build settings and complete client-owned provider setup.',
    );
  else if (
    !/^[a-zA-Z0-9]{6,64}$/.test(formId) ||
    !/^[a-zA-Z0-9_-]{10,128}$/.test(siteKey)
  )
    add(
      'error',
      'contactForm',
      'Supply both a public Formspree ID (not a URL) and a public Turnstile site key; keep the secret in Formspree.',
    );
  if (formId === 'testform' || siteKey.startsWith('mock-'))
    launch(
      'contactForm',
      'Replace automated test identifiers with the client-owned public provider identifiers.',
    );
  if (formId && siteKey)
    add(
      'warning',
      'contactForm/manual',
      'After deployment, verify allowed hostnames, server token rejection, provider acceptance, and actual inbox receipt with owner authorization.',
    );
  const privacy = config.privacy;
  if (!privacy.enabled || !privacy.clientApproved)
    launch(
      'privacy',
      'Enable the auxiliary Privacy page and obtain client approval after replacing every placeholder.',
    );
  if (privacy.enabled) {
    if (!existsSync(resolve(root, 'src/page-templates/privacy.astro')))
      add(
        'error',
        'privacy.entrypoint',
        'Restore the optional Privacy Astro template before enabling this page.',
      );
    for (const field of [
      'title',
      'description',
      'heading',
      'introduction',
    ] as const)
      required(privacy[field], `privacy.${field}`);
    scan(privacy, 'privacy');
    const ids = privacy.sections.map((s) => s.id);
    if (
      new Set(ids).size !== ids.length ||
      ids.some((id) => !/^[a-z0-9-]+$/.test(id))
    )
      add(
        'error',
        'privacy.sections',
        'Use unique lowercase section IDs for accessible heading references.',
      );
    for (const id of [
      'information',
      'purpose',
      'providers',
      'retention',
      'contact',
    ]) {
      const section = privacy.sections.find((s) => s.id === id);
      if (
        !section ||
        blank(section.title) ||
        !section.paragraphs.length ||
        section.paragraphs.some(blank)
      )
        launch(
          `privacy.sections.${id}`,
          'Supply client-approved factual information for this required category; do not invent practices or retention periods.',
        );
    }
    if (formId && siteKey) {
      const providers =
        privacy.sections
          .find((s) => s.id === 'providers')
          ?.paragraphs.join(' ') || '';
      if (!/formspree/i.test(providers) || !/turnstile/i.test(providers))
        launch(
          'privacy.sections.providers',
          'Review the configured Formspree/Turnstile providers and disclose their actual roles in the approved policy.',
        );
    }
  }
  add(
    'warning',
    'manual review',
    'Code checks cannot approve legal text, prove contact ownership, verify image licensing, or establish email delivery. Complete CLIENT_SETUP.md and the launch checklist.',
  );
  return issues;
}
