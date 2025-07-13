'use server';

import { z } from 'zod';

// Schema para una sola reseña de Google, basado en la respuesta de la API de Places
const GoogleReviewSchema = z.object({
  author_name: z.string(),
  profile_photo_url: z.string().url(),
  rating: z.number().min(1).max(5),
  relative_time_description: z.string(),
  text: z.string(),
  time: z.number(),
});

// Schema para el objeto 'result' que contiene las reseñas
const PlaceDetailsResultSchema = z.object({
  reviews: z.array(GoogleReviewSchema).optional(),
});

// Schema para la respuesta completa de la API de Places Details
const GoogleApiResponseSchema = z.object({
  result: PlaceDetailsResultSchema.optional(),
  status: z.string(),
  error_message: z.string().optional(),
});

// Exportar el tipo para usarlo en los componentes del frontend
export type GoogleReview = z.infer<typeof GoogleReviewSchema>;

/**
 * Fetches reviews for a specific Google Place ID using the Google Places API.
 * The API Key and Place ID are read from environment variables.
 * @returns A promise that resolves to an array of GoogleReview objects.
 */
export async function getGoogleReviews(): Promise<GoogleReview[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID; // Usar una variable pública si es necesario, o privada si solo se usa en servidor

  if (!apiKey || !placeId) {
    console.error('Google Places API Key or Place ID is not configured in environment variables.');
    return [];
  }

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews&key=${apiKey}&reviews_sort=newest`;

  try {
    const response = await fetch(url, {
      // Usar cache para no llamar a la API en cada carga de página. 
      // Se revalidará después de 1 día (86400 segundos).
      next: { revalidate: 86400 }, 
    });

    const data = await response.json();
    const parsedData = GoogleApiResponseSchema.parse(data);

    if (parsedData.status !== 'OK' || !parsedData.result || !parsedData.result.reviews) {
      console.error(`Google Places API returned status: ${parsedData.status}`, parsedData.error_message || '');
      return [];
    }

    // Devuelve las reseñas, ordenadas por tiempo (más recientes primero) ya que pedimos 'newest'
    return parsedData.result.reviews;

  } catch (error) {
    console.error('Failed to fetch or parse Google reviews:', error);
    return [];
  }
}
