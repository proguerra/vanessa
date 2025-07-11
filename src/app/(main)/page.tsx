import HeroSection from '@/components/sections/HeroSection';
import FeaturedServicesSection from '@/components/sections/FeaturedServicesSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import AboutSection from '@/components/sections/AboutSection';
import CallToActionSection from '@/components/sections/CallToActionSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <FeaturedServicesSection />
      <TestimonialsSection />
      <CallToActionSection />
    </>
  );
}
