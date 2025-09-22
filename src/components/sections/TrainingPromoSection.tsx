import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function TrainingPromoSection() {
  return (
    <section className="py-12 bg-card/70">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="relative w-full h-64 md:h-full min-h-[260px] overflow-hidden rounded-lg shadow-lg">
            <Image
              src="/images/training/cover.png"
              alt="Hands-on waxing training session"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="space-y-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold uppercase tracking-wide">
              New Offering
            </span>
            <h2 className="text-3xl font-headline font-semibold text-primary">
              Elevate Your Skills with Vanessa&apos;s Training
            </h2>
            <p className="text-lg text-foreground font-body">
              Unlock professional waxing education focused on speed, client comfort, and luxury add-on services. Vanessa now offers customized classes for beauty schools, salons, and individual estheticians ready to grow.
            </p>
            <Button asChild size="lg" className="mt-4">
              <Link href="/training">Explore Training</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
