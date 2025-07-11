import { specialOffers } from '@/lib/data';
import SpecialCard from '@/components/shared/SpecialCard';
import { Metadata } from 'next';
import { Gift } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Specials & Promotions - Viva La Beauty',
  description: 'Check out the latest specials and promotions at Viva La Beauty. Save on your favorite waxing and beauty treatments in Sugar Land, TX.',
};

export default function SpecialsPage() {
  return (
    <div className="bg-background py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-headline font-semibold text-primary mb-4 flex items-center justify-center">
            <Gift className="mr-3 h-10 w-10 text-accent" />
            Current Specials & Promotions
          </h1>
          <p className="text-xl text-foreground max-w-2xl mx-auto font-body">
            Take advantage of our exclusive offers and enjoy premium beauty services at great prices.
          </p>
        </div>
        {specialOffers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {specialOffers.map((offer) => (
              <SpecialCard key={offer.id} offer={offer} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground font-body text-lg">
            We currently don't have any special offers. Please check back soon or subscribe to our newsletter!
          </p>
        )}
      </div>
    </div>
  );
}
