import type { ImageMetadata } from 'astro';
import portraitBlack from '../assets/media/fernanda-portrait-black.png';
import portraitMagenta from '../assets/media/fernanda-portrait-magenta.png';
import closeEmbrace from '../assets/media/tango-close-embrace.jpg';
import community from '../assets/media/holiday-tango-community.jpg';
import performance from '../assets/media/tango-performance.jpg';
import practicePoster from '../assets/media/tango-practice-poster.jpg';

export const instructorPortrait = portraitBlack;

export interface PortfolioPhoto {
  image: ImageMetadata;
  alt: string;
  caption: string;
  credit: string;
}
interface VideoDescription {
  id: string;
  title: string;
  description: string;
}
export type PortfolioVideo = VideoDescription &
  (
    | {
        kind: 'file';
        src: string;
        poster: ImageMetadata;
        width: number;
        height: number;
        duration: string;
      }
    | { kind?: 'embed'; url: string }
  );
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

/** User-supplied portfolio media. The repeated close-embrace image is included
 * once. Existing photographer/event marks stay visible in the full photographs.
 * No names, dates, teaching roles or recording credits are guessed.
 */
export const photos: readonly PortfolioPhoto[] = [
  {
    image: portraitBlack,
    alt: 'Fernanda Delgado smiling in a black dress against a dark studio background.',
    caption: 'Fernanda Delgado.',
    credit: '',
  },
  {
    image: portraitMagenta,
    alt: 'Fernanda Delgado in a magenta dress, pearl necklace and pink headpiece.',
    caption: 'A portrait in magenta.',
    credit: '',
  },
  {
    image: closeEmbrace,
    alt: 'Two tango dancers in close embrace, photographed under blue and warm event lighting.',
    caption: 'A moment of connection on the dance floor.',
    credit: 'Photo: Louis Parks · @louistangophoto · Holiday Tango Weekend',
  },
  {
    image: performance,
    alt: 'Tango dancers in magenta and tan costumes holding a dance pose with raised hands.',
    caption: 'On the dance floor at Holiday Tango Weekend.',
    credit: 'Photo: Louis Parks · @louistangophoto · Holiday Tango Weekend',
  },
  {
    image: community,
    alt: 'A group of dancers posing together in front of a Holiday Tango Weekend backdrop.',
    caption: 'The tango community at Holiday Tango Weekend.',
    credit: 'Photo: Louis Parks · @louistangophoto · Holiday Tango Weekend',
  },
];
export const videos: readonly PortfolioVideo[] = [
  {
    kind: 'file',
    id: 'tango-practice',
    title: 'A moment of tango practice',
    description:
      'Close-embrace tango practice, with walking steps and a shared turn across a wooden studio floor.',
    src: '/media/tango-practice.mp4',
    poster: practicePoster,
    width: 720,
    height: 1280,
    duration: '9-second clip',
  },
];
export const events: readonly TangoEvent[] = [];
export const reviews: readonly StudentReview[] = [];
