import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Partnerships & Community | Viva La Beauty",
  description:
    "Proud sponsors of Summer Shredding, Alphaland, and Muscle Beach. See how Viva La Beauty serves the bodybuilding community pre and post competition.",
};

export default function PartnershipsPage() {
  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative w-full py-16 md:py-20">
        <div className="absolute inset-0 -z-10">
          <Image
            src="https://placehold.co/1600x900/png"
            alt="Viva La Beauty Partnerships Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-semibold text-white mb-4">
            Partnerships &amp; Community
          </h1>
          <p className="text-base md:text-lg text-white/90 font-body">
            At Viva La Beauty, we believe beauty and strength go hand in hand. We proudly
            support the fitness world through partnerships with iconic communities and events.
          </p>
        </div>
      </section>

      {/* Bodybuilding Community */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-headline font-semibold text-primary mb-4">
            Catering to the Bodybuilding Community
          </h2>
          <p className="text-foreground/90 font-body mb-6">
            For competitors, every detail counts—on and off the stage. Our studio has serviced
            many athletes before and after competition, helping them feel confident, smooth, and
            stage-ready. Whether it’s prepping for the spotlight or recovering after the big day,
            we understand the unique needs of bodybuilders and competitors.
          </p>

          {/* Optional photo row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden">
              <Image
                src="https://placehold.co/1200x675/png"
                alt="Athlete preparation"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden">
              <Image
                src="https://placehold.co/1200x675/png"
                alt="Post-competition care"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What Sets Us Apart */}
      <section className="py-12 md:py-16 bg-secondary/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-headline font-semibold text-primary mb-4">
            What Sets Us Apart
          </h2>
          <p className="text-foreground/90 font-body mb-6">
            We offer more than a typical wax studio. Our speed waxing expertise is paired with a
            luxury, calming experience—efficient yet comfortable, with long-lasting results that
            match the dedication of the athletes we serve.
          </p>
          <ul className="grid gap-3 text-foreground/90 list-disc pl-5">
            <li>Stage-ready prep with efficient, precise services</li>
            <li>Post-competition comfort guidance and aftercare tips</li>
            <li>Private, judgment-free environment designed for athletes</li>
          </ul>
        </div>
      </section>

      {/* Community Engagement + Logos */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-headline font-semibold text-primary mb-4">
            Community Engagement
          </h2>
          <p className="text-foreground/90 font-body mb-8 max-w-3xl">
            Beyond the treatment room, we engage with the fitness community by showing up where it
            matters most—at events, competitions, and meetups. Our sponsorships aren’t just about
            brand presence; they’re about supporting the athletes, fans, and families who inspire us.
          </p>

          {/* Logos grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
            <div className="relative h-28 sm:h-32 bg-muted/40 rounded-2xl flex items-center justify-center">
              <Image
                src="https://placehold.co/400x200/png"
                alt="Summer Shredding"
                fill
                className="object-contain p-6"
              />
            </div>
            <div className="relative h-28 sm:h-32 bg-muted/40 rounded-2xl flex items-center justify-center">
              <Image
                src="https://placehold.co/400x200/png"
                alt="Alphaland"
                fill
                className="object-contain p-6"
              />
            </div>
            <div className="relative h-28 sm:h-32 bg-muted/40 rounded-2xl flex items-center justify-center">
              <Image
                src="https://placehold.co/400x200/png"
                alt="Muscle Beach Classic"
                fill
                className="object-contain p-6"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-primary/10 via-background to-secondary/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <p className="text-lg md:text-xl text-foreground font-body mb-6">
            Proud to be more than a beauty studio—we’re part of the fitness community.
          </p>
          <a
            href="/#book" /* adjust anchor to your booking section id */
            className="inline-flex items-center justify-center rounded-2xl px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition"
          >
            Book Your Experience
          </a>
        </div>
      </section>
    </div>
  );
}
