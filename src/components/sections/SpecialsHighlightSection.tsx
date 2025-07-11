
import { specialOffers } from '@/lib/data';
import SpecialCard from '@/components/shared/SpecialCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Gift } from 'lucide-react';

export default function SpecialsHighlightSection() {
  const highlightedOffers = specialOffers.slice(0, 2);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-headline font-semibold text-primary mb-4 flex items-center justify-center">
            <Gift className="mr-3 h-8 w-8 text-accent" />
            Current Specials & Promotions
          </h2>
          <p className="text-lg text-foreground max-w-2xl mx-auto font-body">
            Don't miss out on our exclusive deals to enhance your beauty experience.
          </p>
        </div>
        {highlightedOffers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {highlightedOffers.map((offer) => (
              <SpecialCard key={offer.id} offer={offer} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground font-body">Check back soon for new offers!</p>
        )}
        <div className="text-center mt-12">
          <Button size="lg" asChild variant="outline">
            <Link href="/specials">View All Specials</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
