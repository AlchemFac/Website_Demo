/** Privacy-first embeds: no external player loads until a visitor chooses Play. */
export function videoEmbed(url: string): string | undefined {
  try {
    const value = new URL(url);
    if (value.protocol !== 'https:' || value.username || value.password) return;
    const host = value.hostname.replace(/^www\./, '');
    if (
      host === 'youtu.be' ||
      host === 'youtube.com' ||
      host === 'm.youtube.com'
    ) {
      const id =
        host === 'youtu.be'
          ? value.pathname.slice(1)
          : (value.searchParams.get('v') ??
            value.pathname.split('/').filter(Boolean).at(-1));
      if (id && /^[A-Za-z0-9_-]{11}$/.test(id))
        return `https://www.youtube-nocookie.com/embed/${id}`;
    }
    if (host === 'vimeo.com' && /^\/\d+$/.test(value.pathname))
      return `https://player.vimeo.com/video/${value.pathname.slice(1)}?dnt=1`;
  } catch {
    /* Unknown providers remain plain text, not arbitrary embeds. */
  }
  return undefined;
}

/** Local MP4s stay within the site's own media directory. No remote trackers,
 * traversal, query strings or arbitrary media origins are accepted here. */
export function localVideoPath(value: string): string | undefined {
  return /^\/media\/[a-z0-9][a-z0-9-]*\.mp4$/.test(value) ? value : undefined;
}
