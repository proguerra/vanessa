
import type { Testimonial, SpecialOffer } from '@/types';

export const testimonials: Testimonial[] = [
  {
    id: '1',
    quote: "Viva La Beauty is my go-to for waxing in Sugar Land! The staff is incredibly professional, and the results are always perfect. Highly recommend!",
    author: 'Jessica M.',
    location: 'Sugar Land, TX',
  },
  {
    id: '2',
    quote: "I had the signature facial, and my skin has never felt better. Such a relaxing and rejuvenating experience. I'll definitely be back!",
    author: 'Sarah L.',
    location: 'Houston, TX',
  },
  {
    id: '3',
    quote: "The best Brazilian wax I've ever had. Minimal pain and super smooth results. The salon is clean and inviting. Five stars!",
    author: 'Emily R.',
    location: 'Stafford, TX',
  },
];

export const specialOffers: SpecialOffer[] = [
    {
      id: '1',
      title: 'First-Time Client Special',
      description: 'New to Viva La Beauty? Enjoy 20% off your first service. Welcome to the family!',
      validUntil: 'Valid for your first visit.',
      ctaText: 'Book Now & Save',
      ctaLink: '/book',
      imageUrl: 'https://placehold.co/600x400.png',
      imageHint: 'spa products',
    },
    {
      id: '2',
      title: 'Brazilian Wax Package',
      description: 'Purchase a package of 5 Brazilian waxes and get the 6th one completely free!',
      validUntil: 'Ongoing promotion.',
      ctaText: 'Learn More',
      ctaLink: '/services',
      imageUrl: 'https://placehold.co/600x400.png',
      imageHint: 'waxing tools',
    },
    {
      id: '3',
      title: 'Refer-a-Friend',
      description: 'Love our services? Refer a friend and you both get $10 off your next visit!',
      validUntil: 'Ongoing promotion.',
      ctaText: 'Ask Us How',
      ctaLink: '/book',
      imageUrl: 'https://placehold.co/600x400.png',
      imageHint: 'friends laughing',
    },
];
