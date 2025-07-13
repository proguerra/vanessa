import type { GoogleReview } from '@/lib/google-reviews';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import Image from 'next/image';

interface TestimonialCardProps {
  review: GoogleReview;
}

// Componente para renderizar las estrellas de calificación
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => {
        const isFilled = i < rating;
        return (
          <Star 
            key={i} 
            className={`h-5 w-5 ${isFilled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
          />
        );
      })}
    </div>
  );
};

export default function TestimonialCard({ review }: TestimonialCardProps) {
  return (
    <Card className="bg-card shadow-lg h-full flex flex-col">
      <CardContent className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex items-center mb-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
              <Image 
                src={review.profile_photo_url} 
                alt={review.author_name}
                fill
                sizes="48px"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div>
              <p className="font-semibold font-headline text-primary">{review.author_name}</p>
              <StarRating rating={review.rating} />
            </div>
          </div>
          <p className="text-muted-foreground italic font-body mb-4 line-clamp-6">&ldquo;{review.text}&rdquo;</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">{review.relative_time_description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
