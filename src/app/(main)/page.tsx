import HeroSection from '@/components/sections/HeroSection';
import FeaturedServicesSection from '@/components/sections/FeaturedServicesSection';
import TrainingPromoSection from '@/components/sections/TrainingPromoSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import AboutSection from '@/components/sections/AboutSection';
import CallToActionSection from '@/components/sections/CallToActionSection';
import PartnershipsSection from '@/components/sections/PartnershipsSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <FeaturedServicesSection />
      <PartnershipsSection />
      <TestimonialsSection />
      <TrainingPromoSection />
      <CallToActionSection />
    </>
  );
}
