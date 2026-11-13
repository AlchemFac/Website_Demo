import {
  packagePages,
  website,
  type PageId,
  type WebsitePackage,
} from './website';

interface Page {
  id: PageId;
  label: string;
  href: string;
  /** Optional pages live outside src/pages so disabled pages cannot be emitted. */
  template?: string;
}

const pages: readonly Page[] = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'services', label: 'Services', href: '/services/' },
  {
    id: 'about',
    label: 'About',
    href: '/about/',
    template: './src/page-templates/about.astro',
  },
  {
    id: 'gallery',
    label: 'Gallery',
    href: '/gallery/',
    template: './src/page-templates/gallery.astro',
  },
  { id: 'contact', label: 'Contact', href: '/contact/' },
];

export function navigationFor(packageName: WebsitePackage): readonly Page[] {
  const enabled: readonly PageId[] = packagePages[packageName];
  return pages.filter((page) => enabled.includes(page.id));
}

/** The same enabled routes drive the header, footer, optional builds and sitemap. */
export const navigation = navigationFor(website.package);
