import { testimonials } from '@/lib/data';
import TestimonialCard from '@/components/shared/TestimonialCard';
import { MessageCircle } from 'lucide-react';

export default function TestimonialsSection() {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
