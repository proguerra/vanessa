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
              Viva La Beauty offers a uniquely intimate and welcoming environment tailored to your comfort and confidence. With over 10 years of expertise, I specialize in delivering smooth, flawless results. Make the smart choice and choose the best waxing place for your needs. We're not just another waxing studio; we're the destination for those who appreciate the the most efficient service. Whether you're new to waxing or a regular, you'll leave feeling refreshed and empowered. Schedule your appointment today and discover why my clients trust Viva La Beauty for exceptional waxing services. — Vanessa
            </p>
            <div className="flex items-center text-accent mb-6">
              <MapPin className="mr-2 h-5 w-5 flex-shrink-0" />
              <a 
                href="https://www.google.com/maps/place/Viva+La+Beauty/@29.6033214,-95.6124699,17z/data=!3m1!4b1!4m6!3m5!1s0x8640e7d41c47ab2b:0x38fa7a13e4169f70!8m2!3d29.6033214!4d-95.6124699!16s%2Fg%2F11wmh17z1g?sa=X&ved=1t:2428&ictx=111&entry=tts&g_ep=EgoyMDI0MTIxMS4wIPu8ASoASAFQAw%3D%3D"
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
                Book Your Services
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
