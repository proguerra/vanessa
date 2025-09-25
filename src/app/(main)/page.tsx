import HeroSection from '@/components/sections/HeroSection';
import FeaturedServicesSection from '@/components/sections/FeaturedServicesSection';
import TrainingPromoSection from '@/components/sections/TrainingPromoSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import AboutSection from '@/components/sections/AboutSection';
import CallToActionSection from '@/components/sections/CallToActionSection';
import PartnershipsSection from '@/components/PartnershipsSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <FeaturedServicesSection />
      <TrainingPromoSection />
      <TestimonialsSection />
      <PartnershipsSection />
      <CallToActionSection />
    </>
  );
}
