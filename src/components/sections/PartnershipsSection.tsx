import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function PartnershipsSection() {
  return (
    <section className="relative w-full py-20">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/partnerships-banner.jpg"
          alt="Partnerships and Community"
          fill
          className="object-cover opacity-80"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Partnerships &amp; Community
        </h2>
        <p className="text-lg md:text-xl text-gray-200 mb-8">
          From Alphaland to Summer Shredding and Muscle Beach, Viva La Beauty is proud
          to support the bodybuilding and fitness community. Our partnerships reflect
          our passion for beauty, strength, and confidence.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-primary text-white hover:bg-primary/90"
        >
          <a href="/partnerships">See Our Partnerships</a>
        </Button>
      </div>
    </section>
  );
}
