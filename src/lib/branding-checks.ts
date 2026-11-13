import { statSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import type { BrandColors, BusinessConfig } from '../config/business.ts';

export interface ConfigIssue {
  severity: 'error' | 'warning';
  field: string;
  message: string;
}
interface HeroImage {
  heroImageSrc: string;
  heroImageAlt: string;
  heroImageWidth: number;
  heroImageHeight: number;
}

/** Server/build-only. Never include submitted form data in diagnostics. */
export function localImageExists(root: string, src: string): boolean {
  if (!/^\/(?!\/)/.test(src) || /[?#\\]/.test(src)) return false;
  const publicRoot = resolve(root, 'public');
  const file = resolve(publicRoot, `.${src}`);
  if (
    !file.startsWith(publicRoot + sep) ||
    !/\.(svg|png|jpe?g|webp|avif)$/i.test(file)
  )
    return false;
  try {
    return statSync(file).isFile();
  } catch {
    return false;
  }
}
export function contrastRatio(a: string, b: string): number {
  const luminance = (hex: string) => {
    const channels = [1, 3, 5].map((start) => {
      const c = parseInt(hex.slice(start, start + 2), 16) / 255;
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  };
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
export function checkBranding(
  business: Pick<BusinessConfig, 'name' | 'branding'>,
  hero: HeroImage,
  root: string,
): ConfigIssue[] {
  const issues: ConfigIssue[] = [];
  const add = (
    severity: ConfigIssue['severity'],
    field: string,
    message: string,
  ) => issues.push({ severity, field, message });
  if (!business.name.trim())
    add('error', 'business.name', 'Supply a public business name.');
  if (!business.branding.tagline.trim())
    add('error', 'business.branding.tagline', 'Supply a public tagline.');
  const colors = business.branding.colors;
  const colorNames: readonly (keyof BrandColors)[] = [
    'primary',
    'primaryHover',
    'background',
    'text',
    'accent',
    'surface',
    'muted',
    'border',
    'onPrimary',
    'captionSurface',
    'imagePlaceholder',
  ];
  for (const key of colorNames) {
    const value = colors[key];
    if (!/^#[0-9a-f]{6}$/i.test(value))
      add(
        'error',
        `branding.colors.${key}`,
        'Use a six-digit hex color, such as #466653.',
      );
  }
  const pairs = [
    ['text', 'background'],
    ['text', 'surface'],
    ['muted', 'background'],
    ['muted', 'surface'],
    ['text', 'accent'],
    ['onPrimary', 'primary'],
    ['onPrimary', 'primaryHover'],
  ] as const;
  for (const [foreground, background] of pairs) {
    if (
      [colors[foreground], colors[background]].every((c) =>
        /^#[0-9a-f]{6}$/i.test(c),
      ) &&
      contrastRatio(colors[foreground], colors[background]) < 4.5
    ) {
      add(
        'warning',
        `branding.colors.${foreground}/${background}`,
        'Text contrast is below 4.5:1. Adjust the pair and review all focus, hover, and error states manually.',
      );
    }
  }
  const dimensions = (width: number, height: number, field: string) => {
    if (![width, height].every((n) => Number.isInteger(n) && n > 0))
      add(
        'error',
        field,
        'Use positive integer image width and height matching the asset.',
      );
  };
  const logo = business.branding.logo;
  if (logo) {
    if (!localImageExists(root, logo.src))
      add(
        'error',
        'branding.logo.src',
        'Use an existing root-relative image under public/; keep logo null when omitted.',
      );
    dimensions(logo.width, logo.height, 'branding.logo');
  }
  if (!localImageExists(root, hero.heroImageSrc))
    add(
      'error',
      'homeContent.heroImageSrc',
      'Use an existing root-relative image under public/ (no remote URL, query, or traversal).',
    );
  if (!hero.heroImageAlt.trim())
    add(
      'error',
      'homeContent.heroImageAlt',
      'Describe the hero image for people who cannot see it.',
    );
  dimensions(
    hero.heroImageWidth,
    hero.heroImageHeight,
    'homeContent.heroImage',
  );
  return issues;
}
