import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About Me - Viva La Beauty',
  description: 'Learn about the passion and expertise behind Viva La Beauty, your premier waxing studio in Sugar Land, TX.',
};

export default function AboutPage() {
  const imageUrl = "https://static.wixstatic.com/media/c5947c_6166529c84414c4c9168682fe1c28f8e~mv2.jpg";

  return (
    <div className="bg-gradient-to-br from-pink-50 via-background to-purple-50 py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto bg-card p-8 md:p-12 rounded-lg shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            
            {/* Columna Izquierda: Imagen */}
            <div className="md:col-span-5">
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-500">
                <Image 
                  src={imageUrl}
                  alt="Founder of Viva La Beauty"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: 'cover' }}
                  priority // Cargar esta imagen de forma prioritaria
                />
              </div>
            </div>

            {/* Columna Derecha: Texto */}
            <div className="md:col-span-7">
              <div className="text-left">
                <h1 className="text-5xl font-headline font-semibold text-primary mb-8">
                  About Me
                </h1>
              </div>
              <div className="prose prose-lg max-w-none font-body text-foreground">
                <p>
                  I’ve always had a strong passion for beauty and skincare, which led me to become a licensed esthetician. Over the years, I’ve gained experience working at some of the best waxing studios in Sugar Land, TX. That’s when I realized there was a need for a more personalized, efficient, and comfortable waxing experience. Driven by a desire to offer something unique, I decided to open Viva La Beauty, a cozy, intimate waxing studio where we focus on expert hair removal using the most advanced and skin-friendly techniques.
                </p>
                <p>
                  At Viva La Beauty, we specialize in Brazilian waxing, full-body waxing, and eyebrow waxing, ensuring smooth, long-lasting results for all my clients. Whether you're searching for “eyebrow waxing near me” or “waxing in Sugar Land, TX,” we’ve created a space where you can feel confident, cared for, and right at home.
                </p>
                <p>
                  Located in the heart of Sugar Land, TX, Viva La Beauty is your go-to destination for all things waxing. We use only the best products to make the process as comfortable as possible while achieving the best results. From Brazliian waxing to leg and arm waxing, to facial waxing, we offer a full range of services to keep you looking your best.
                </p>
                <p>
                  If you're looking for the best waxing experience you’re in the right place. We pride ourselves on offering a relaxing atmosphere where you can unwind while ensuring a precise and comfortable experience every time.
                </p>
                <p>
                  Whether it’s your first time or you're a regular, I’m here to make your visit special. Book your appointment today and see why Viva La Beauty is the preferred choice for waxing in Sugar Land, TX. Let us help you achieve smooth, radiant skin!
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
