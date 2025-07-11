import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CalendarCheck2 } from 'lucide-react';

export default function CallToActionSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-accent text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-headline font-semibold mb-6">
          Ready to Elevate Your Beauty?
        </h2>
        <p className="text-xl max-w-xl mx-auto mb-10 font-body">
          Book your appointment today at Viva La Beauty and discover the difference. We can't wait to welcome you!
        </p>
        <Button size="lg" variant="secondary" asChild className="text-primary hover:bg-secondary/80 transform hover:scale-105 transition-all duration-300 shadow-lg">
          <Link href="/book">
            <CalendarCheck2 className="mr-2 h-5 w-5" />
            Schedule Your Visit
          </Link>
        </Button>
      </div>
    </section>
  );
}
