import Image from 'next/image';
import Link from 'next/link';
import type { SpecialOffer } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tag, CalendarClock } from 'lucide-react';

interface SpecialCardProps {
  offer: SpecialOffer;
}

export default function SpecialCard({ offer }: SpecialCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
      {offer.imageUrl && (
        <CardHeader className="p-0">
          <div className="relative w-full h-48">
            <Image
              src={offer.imageUrl}
              alt={offer.title}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-500 hover:scale-105"
              data-ai-hint={offer.imageHint || 'special offer'}
            />
          </div>
        </CardHeader>
      )}
      <CardContent className="flex-grow p-6">
        <CardTitle className="text-2xl font-headline text-primary mb-2 flex items-center">
          <Tag className="mr-2 h-6 w-6 text-accent" />
          {offer.title}
        </CardTitle>
        <CardDescription className="text-muted-foreground text-sm mb-3 font-body">{offer.description}</CardDescription>
        {offer.validUntil && (
          <p className="text-xs text-muted-foreground flex items-center">
            <CalendarClock className="mr-1 h-3 w-3" />
            Valid: {offer.validUntil}
          </p>
        )}
      </CardContent>
      {offer.ctaLink && offer.ctaText && (
        <CardFooter className="p-6 pt-0">
          <Button asChild variant="default" className="w-full bg-accent hover:bg-accent/90">
            <Link href={offer.ctaLink}>
              {offer.ctaText}
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
