import { business } from './business';
import livingRoom from '../assets/gallery/living-room.png';
import kitchen from '../assets/gallery/kitchen.png';
import bathroom from '../assets/gallery/bathroom.png';

const demoProvenance = {
  label: 'AI-generated demonstration',
  caption: 'Imagined interior. Not a customer home or completed cleaning job.',
};

/** Original AI-generated demo images. Replace only with approved imagery and update alt text. */
export const galleryImages = [
  {
    ...demoProvenance,
    src: livingRoom,
    title: 'Room to unwind',
    alt: 'AI-generated living room with a cream sofa, sage cushions, an oak coffee table, and a leafy plant beside a sunlit window.',
  },
  {
    ...demoProvenance,
    src: kitchen,
    title: 'An everyday gathering space',
    alt: 'AI-generated bright kitchen with white cabinets, pale stone counters, an oak accent, and a small vase of green stems.',
  },
  {
    ...demoProvenance,
    src: bathroom,
    title: 'A calmer daily routine',
    alt: 'AI-generated bathroom with a light oak vanity, round mirror, white basin, folded towels, and a small plant.',
  },
] as const;

/** Client-editable demonstration copy. Keep claims and demo notices truthful. */
export const galleryContent = {
  eyebrow: 'A little inspiration for your space',
  title: 'Picture a fresh start.',
  description:
    'A few calm interiors to inspire the everyday. These original AI-generated images show imagined spaces, not customer homes, before-and-after results, or completed cleaning jobs.',
  ctaTitle: 'What does your home need?',
  ctaDescription:
    'Explore the sample contact details and the test-inquiry form.',
  noticeTitle: 'Demonstration imagery, clearly labeled.',
  notice: `${business.name} is fictional. This gallery illustrates a visual style only; it does not document the quality or results of any cleaning service.`,
} as const;
