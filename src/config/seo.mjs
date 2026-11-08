/** Validate a root HTTPS origin without silently rewriting a path or credentials. */
export function parseSiteUrl(value = '') {
  if (!value.trim()) return undefined;
  let url;
  try {
    url = new URL(value.trim());
  } catch {
    throw new Error('SITE_URL must be the final absolute HTTPS origin.');
  }
  if (
    url.protocol !== 'https:' ||
    url.username ||
    url.password ||
    url.pathname !== '/' ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      'SITE_URL must be a root HTTPS origin with no credentials, path, query, or fragment.',
    );
  }
  return url;
}

/** A domain alone must never make a fictional/staging site indexable. */
export function indexingAllowed(site, permission, isDemo) {
  return Boolean(site && permission === 'true' && !isDemo);
}

export function robotsText(site, indexable) {
  return indexable && site
    ? `User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap.xml', site).href}\n`
    : 'User-agent: *\nDisallow: /\n';
}

/** Escape URL text before putting it in XML; do not fabricate last-modified dates. */
export function sitemapXml(site, routes) {
  if (!site)
    throw new Error('A verified site origin is required for a sitemap.');
  const escape = (text) =>
    text
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&apos;');
  const urls = [...new Set(routes)].map((route) => {
    if (
      !route.startsWith('/') ||
      route.startsWith('//') ||
      route.includes('?') ||
      route.includes('#') ||
      new URL(route, site).origin !== site.origin
    ) {
      throw new Error(
        'Sitemap routes must be local paths without queries or fragments.',
      );
    }
    return `  <url><loc>${escape(new URL(route, site).href)}</loc></url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}
