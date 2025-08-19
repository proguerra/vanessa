"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ServiceCard from '@/components/shared/ServiceCard';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { getAcuityAppointmentTypes, type AcuityAppointmentType } from '@/ai/flows/acuity-booking-flow';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

type SubCategory = 'Face' | 'Mid Body' | 'Lower Body';

export default function ServicesPage() {
  const [allServices, setAllServices] = useState<AcuityAppointmentType[]>([]);
  const [displayedServices, setDisplayedServices] = useState<AcuityAppointmentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [gender, setGender] = useState<'women' | 'men' | null>(null);
  const [activeSubCategory, setActiveSubCategory] = useState<SubCategory | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    async function fetchServices() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/services');
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const fetchedServices = await response.json();
        setAllServices(fetchedServices.filter((s: AcuityAppointmentType) => !s.private));
      } catch (error) {
        console.error("Failed to fetch services:", error);
        toast({
          title: "Error",
          description: "Could not load services. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchServices();
  }, [toast]);

  useEffect(() => {
    let servicesToDisplay: AcuityAppointmentType[] = [];
    const menKeywords = ["men's", "gentleman’s", "the gentleman's"];
    
    const categories: Record<SubCategory, string[]> = {
      'Face': ['nose', 'lip', 'chin', 'brow', 'eyebrow', 'face', 'sideburn', 'ear', 'facial'],
      'Mid Body': ['back', 'chest', 'stomach', 'underarm', 'arm'],
      'Lower Body': ['brazilian', 'bikini', 'leg', 'butt'],
    };

    if (gender) {
      let genderSpecificServices = allServices;
      if (gender === 'men') {
        genderSpecificServices = allServices.filter(service =>
          menKeywords.some(kw => service.name.toLowerCase().includes(kw))
        );
      } else { // women
        genderSpecificServices = allServices.filter(service =>
          !menKeywords.some(kw => service.name.toLowerCase().includes(kw))
        );
      }

      if (activeSubCategory) {
        const keywords = categories[activeSubCategory] || [];
        servicesToDisplay = genderSpecificServices.filter(service =>
          keywords.some(kw => service.name.toLowerCase().includes(kw))
        );
      } else {
        servicesToDisplay = genderSpecificServices;
      }
    }
    
    setDisplayedServices(servicesToDisplay);
  }, [gender, activeSubCategory, allServices]);

  const handleServiceSelect = (service: AcuityAppointmentType) => {
    toast({
      title: "Starting Booking...",
      description: `You are booking for ${service.name}.`,
    });
    router.push(`/schedule?appointmentType=${service.id}`);
  };

  const selectGender = (selectedGender: 'women' | 'men') => {
    setGender(selectedGender);
    setActiveSubCategory(null);
  };

  const selectSubCategory = (category: SubCategory) => {
    setActiveSubCategory(category);
  };

  const hasServices = displayedServices.length > 0;
  const subCategories: SubCategory[] = ['Face', 'Mid Body', 'Lower Body'];

  return (
    <div className="bg-background py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-headline font-semibold text-primary mb-4 flex items-center justify-center">
            <Image src="https://static.wixstatic.com/media/c5947c_105b98aad40c4d4c8ca7de374634e9fa~mv2.png" alt="" width={40} height={40} className="mr-3 h-10 w-10" />
            Our Beauty & Waxing Services
            <Image src="https://static.wixstatic.com/media/c5947c_105b98aad40c4d4c8ca7de374634e9fa~mv2.png" alt="" width={40} height={40} className="ml-3 h-10 w-10" />
          </h1>
          <p className="text-xl text-foreground max-w-2xl mx-auto font-body">
            Discover a comprehensive range of treatments designed to make you look and feel your best.
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <Button onClick={() => selectGender('women')} variant={gender === 'women' ? 'default' : 'outline'}>
            Women's Services
          </Button>
          <Button onClick={() => selectGender('men')} variant={gender === 'men' ? 'default' : 'outline'}>
            Men's Services
          </Button>
        </div>

        {gender && (
          <div className="flex justify-center gap-4 mb-12">
            {subCategories.map(category => (
              <Button 
                key={category}
                onClick={() => selectSubCategory(category)} 
                variant={activeSubCategory === category ? 'secondary' : 'outline'}
              >
                {category}
              </Button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : gender ? (
          hasServices ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedServices.map((service) => (
                <ServiceCard 
                  key={service.id} 
                  service={service}
                  onSelect={() => handleServiceSelect(service)}
                  isSelected={false}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground font-body text-lg">
              No services found for this category. Please check back soon or contact us!
            </p>
          )
        ) : (
            <p className="text-center text-muted-foreground font-body text-lg">
                Please select a category to view services.
            </p>
        )}
      </div>
    </div>
  );
}
