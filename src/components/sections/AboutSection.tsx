import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

export default function AboutSection() {
  const iconUrl = "https://static.wixstatic.com/media/c5947c_105b98aad40c4d4c8ca7de374634e9fa~mv2.png";
  
  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 relative aspect-square rounded-lg overflow-hidden shadow-2xl">
            <Image 
              src="https://static.wixstatic.com/media/c5947c_76dc43206651421fae1dee0ed1b30a5b~mv2.jpg" 
              alt="Viva La Beauty Salon Interior" 
              layout="fill" 
              objectFit="cover"
              data-ai-hint="salon interior"
              className="transform hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-4xl font-headline font-semibold text-primary mb-6">
              Welcome to Viva La Beauty
            </h2>
            <p className="text-lg text-foreground mb-4 font-body">
              At Viva La Beauty, we are passionate about making you look and feel your absolute best. Nestled in the vibrant community of Sugar Land, Texas, our salon offers a serene and welcoming atmosphere where you can unwind and indulge in top-tier beauty and waxing services.
            </p>
            <p className="text-lg text-foreground mb-6 font-body">
              Our experienced estheticians are dedicated to providing personalized care, using only the highest quality products and a gentle touch. Whether you're seeking a flawless Brazilian wax, perfectly sculpted eyebrows, or a rejuvenating facial, we're here to exceed your expectations.
            </p>
            <div className="flex items-center text-accent mb-6">
              <MapPin className="mr-2 h-5 w-5 flex-shrink-0" />
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("15315 Southwest Fwy ste. 192, Sugar Land, TX 77478")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:underline"
              >
                15315 Southwest Fwy ste. 192, Sugar Land, TX 77478
              </a>
            </div>
            <Button size="lg" asChild>
              <Link href="/book">
                <Image src={iconUrl} alt="" width={20} height={20} className="mr-2 h-5 w-5" />
                Book Your Transformation
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
