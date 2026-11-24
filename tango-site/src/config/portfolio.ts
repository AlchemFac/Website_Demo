import type { ImageMetadata } from 'astro';

export interface PortfolioPhoto {
  image: ImageMetadata;
  alt: string;
  caption: string;
  credit: string;
}
export interface PortfolioVideo {
  id: string;
  title: string;
  description: string;
  url: string;
}
export interface TangoEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD in Dallas–Fort Worth local time.
  time: string; // Display text approved by the owner; no times are invented.
  location: string;
  role: string;
  url?: string;
}
export interface StudentReview {
  quote: string;
  attribution: string;
  permissionConfirmed: boolean;
}

/** Add only owner-approved media, public event details and permission-cleared
 * reviews. The questionnaire contains no actual videos, event dates or reviews.
 * A reference image for a logo is not an instructor portrait or portfolio image.
 */
export const photos: readonly PortfolioPhoto[] = [];
export const videos: readonly PortfolioVideo[] = [];
export const events: readonly TangoEvent[] = [];
export const reviews: readonly StudentReview[] = [];

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
