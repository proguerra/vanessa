import { Metadata } from 'next';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Waxing Education & Training by Vanessa | Viva La Beauty',
  description:
    'Learn speed waxing and luxury intimate care from Vanessa, founder of Viva La Beauty. Classes available for beauty schools, salons, and individual professionals.',
};

export default function TrainingPage() {
  return (
    <div className="bg-background">
      <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-secondary/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-semibold text-primary mb-6">
            Waxing Education &amp; Training by Vanessa
          </h1>
          <p className="text-lg md:text-xl text-foreground font-body mb-8">
            Take your waxing skills to the next level. Vanessa, founder of Viva La Beauty, has spent over a decade perfecting speed waxing and luxury intimate care. Now she shares her expertise with schools, salons, and professionals ready to master the craft.
          </p>
          <Button asChild size="lg">
            <a href="mailto:training@vivalabeautywax.com" aria-label="Request a class by email">
              Request a Class
            </a>
          </Button>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-headline font-semibold text-primary mb-6">
                About Vanessa as an Educator
              </h2>
              <p className="text-lg text-foreground font-body">
                With more than 10 years of experience and thousands of clients served, Vanessa is a trusted authority in Brazilian and speed waxing. Her teaching blends technical mastery and real-world client care so students leave confident, fast, and client-ready.
              </p>
            </div>
            <div className="flex justify-center">
              <div
                className="w-full max-w-sm aspect-[4/5] rounded-lg border border-primary/40 bg-primary/10 flex items-center justify-center text-primary font-headline text-xl shadow-lg"
                role="img"
                aria-label="Vanessa teaching (placeholder)"
              >
                Educator Photo
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <h2 className="text-3xl font-headline font-semibold text-primary text-center mb-10">
            Training Options
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <article className="bg-card shadow-lg rounded-lg p-8 border border-primary/20">
              <h3 className="text-2xl font-headline text-primary mb-4">
                For Beauty Schools &amp; Institutes
              </h3>
              <p className="text-foreground font-body text-lg">
                Invite Vanessa as a guest educator to teach Brazilian, speed waxing, and men’s services. Her curriculum plugs into your program with practical, high-demand skills.
              </p>
            </article>
            <article className="bg-card shadow-lg rounded-lg p-8 border border-primary/20">
              <h3 className="text-2xl font-headline text-primary mb-4">
                For Individuals &amp; Professionals
              </h3>
              <p className="text-foreground font-body text-lg">
                1-on-1 or small group training to build speed, technique, and client communication. Ideal for estheticians adding waxing or leveling up.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h2 className="text-3xl font-headline font-semibold text-primary text-center mb-8">
            What You’ll Learn
          </h2>
          <ul className="space-y-4 text-lg text-foreground font-body list-disc list-inside">
            <li>Fast &amp; efficient speed-waxing technique</li>
            <li>Brazilian &amp; intimate waxing with maximum client comfort</li>
            <li>Aftercare and ingrown prevention protocols</li>
            <li>How to upsell vajacials, brightening peels, scrubs, and oils</li>
            <li>Client communication and retention playbook</li>
          </ul>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-primary/10 via-secondary/20 to-primary/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <p className="text-xl text-foreground font-body mb-8">
            Whether you’re a school director or an esthetician ready to level up, Vanessa’s training is the fast track to waxing mastery.
          </p>
          <Button asChild size="lg">
            <a href="mailto:training@vivalabeautywax.com" aria-label="Book a training by email">
              Book a Training
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
