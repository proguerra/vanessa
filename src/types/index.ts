
// This file is now primarily for client-side types that are not related to the Acuity API.
// Acuity-related types are now defined and exported from the booking flow file.

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  location?: string; // e.g., "Sugar Land, TX"
}

export interface SpecialOffer {
    id: string;
    title: string;
    description: string;
    validUntil?: string;
    ctaText?: string;
    ctaLink?: string;
    imageUrl?: string;
    imageHint?: string;
}
