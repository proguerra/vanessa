import type { Testimonial } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card className="bg-card shadow-lg h-full flex flex-col">
      <CardContent className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          <p className="text-muted-foreground italic font-body mb-4">&ldquo;{testimonial.quote}&rdquo;</p>
        </div>
        <div>
          <p className="font-semibold font-headline text-primary">{testimonial.author}</p>
          {testimonial.location && <p className="text-sm text-muted-foreground">{testimonial.location}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
