import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function PartnershipsSection() {
  return (
    <section className="relative w-full py-16 md:py-20 bg-background">
      {/* Background banner placeholder */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://placehold.co/1600x900/png"
          alt="Viva La Beauty Partnerships & Community"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
        <h2 className="text-4xl md:text-5xl font-headline font-semibold text-white mb-4">
          Partnerships &amp; Community
        </h2>
        <p className="text-base md:text-lg text-white/90 mb-8 font-body">
          From Alphaland to Summer Shredding and Muscle Beach, Viva La Beauty is proud
          to support the bodybuilding and fitness community. Our partnerships reflect
          our passion for beauty, strength, and confidence.
        </p>

        <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
          <a href="/partnerships" aria-label="See all partnerships">
            See Our Partnerships
          </a>
        </Button>
      </div>
    </section>
  );
}
