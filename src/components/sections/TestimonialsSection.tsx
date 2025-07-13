import TestimonialCard from '@/components/shared/TestimonialCard';
import { MessageCircle } from 'lucide-react';
import { getGoogleReviews } from '@/lib/google-reviews';

// Convertido a un async Server Component para llamar a la función de servidor
export default async function TestimonialsSection() {
  const reviews = await getGoogleReviews();

  // Opcional: Limitar el número de reseñas a mostrar, por ejemplo, las 3 más recientes.
  // La API ya las devuelve ordenadas por 'newest'.
  const displayedReviews = reviews.slice(0, 3);

  return (
    <section id="testimonials" className="py-16 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-headline font-semibold text-primary mb-4 flex items-center justify-center">
             <MessageCircle className="mr-3 h-8 w-8 text-accent" />
            What Our Clients Say
          </h2>
          <p className="text-lg text-foreground max-w-2xl mx-auto font-body">
            Hear from our happy clients about their Viva La Beauty experiences.
          </p>
        </div>
        
        {displayedReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedReviews.map((review, index) => (
              <TestimonialCard key={index} review={review} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground bg-card p-8 rounded-lg shadow-md">
            <p>Could not load reviews at this time. Please check our Google Business Profile for the latest testimonials!</p>
          </div>
        )}
      </div>
    </section>
  );
}

