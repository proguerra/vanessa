"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ArrowRight, CalendarDays } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-pink-100 via-purple-50 to-pink-100 py-20 md:py-32 overflow-x-hidden"> {/* Prevenir overflow horizontal en la sección */}
      <div className="absolute inset-0 opacity-40 overflow-hidden"> {/* Contenedor de la imagen debe ocultar el desbordamiento de la imagen escalada */}
        <Image
            src="https://static.wixstatic.com/media/c5947c_105b98aad40c4d4c8ca7de374634e9fa~mv2.png"
            alt="Abstract beauty background"
            layout="fill"
            objectFit="contain"
            priority
            data-ai-hint="salon products"
            className="transform scale-150"
        />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-headline font-bold text-primary mb-6 animate-fade-in-down">
          Viva La Beauty
        </h1>
        <div className="flex justify-center md:justify-start mb-8 animate-fade-in-up">
          <Link href="https://houstonsbest.com/winners/" aria-label="Visit Houston's Best Winners">
            <Image
              src="/images/houstonsbest.png"
              alt="Houston's Best Winner"
              width={180}
              height={180}
              className="h-auto w-36 md:w-44"
            />
          </Link>
        </div>
        <p className="text-xl md:text-2xl text-foreground max-w-2xl mx-auto mb-10 font-body animate-fade-in-up delay-200">
          Experience exceptional waxing and beauty treatments in the heart of Sugar Land, TX. <br/>Feel confident, radiant, and beautifully you.
        </p>
        <div className="space-x-4 animate-fade-in-up delay-400">
          <Button size="xl" asChild className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            <Link href="/book">
              Book Appointment
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            <Link href="/services">
              Explore Services
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
      <style jsx>{`
        @keyframes fade-in-down {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        .delay-200 { animation-delay: 0.2s; }
        .delay-400 { animation-delay: 0.4s; }
      `}</style>
    </section>
  );
}
