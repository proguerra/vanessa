
"use client";

import { useState, useEffect } from 'react';
import ServiceCard from '@/components/shared/ServiceCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { getAcuityAppointmentTypes, type AcuityAppointmentType } from '@/ai/flows/acuity-booking-flow';
import { useToast } from '@/hooks/use-toast';

export default function FeaturedServicesSection() {
  const [featuredServices, setFeaturedServices] = useState<AcuityAppointmentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const iconUrl = "https://static.wixstatic.com/media/c5947c_105b98aad40c4d4c8ca7de374634e9fa~mv2.png";

  useEffect(() => {
    async function fetchServices() {
      try {
        setIsLoading(true);
        const allServices = (await getAcuityAppointmentTypes()).filter(s => !s.private);
        
        const featured: AcuityAppointmentType[] = [];
        
        // Prioritize "Brazilian Wax"
        const brazilianWax = allServices.find(s => s.name.toLowerCase().includes('brazilian wax'));
        if (brazilianWax) {
          featured.push(brazilianWax);
        }
        
        // Add other services, avoiding duplicates
        const otherServices = allServices.filter(s => s.id !== brazilianWax?.id);
        
        // Fill up to 3 slots
        const remainingSlots = 3 - featured.length;
        if (remainingSlots > 0) {
          featured.push(...otherServices.slice(0, remainingSlots));
        }
        
        setFeaturedServices(featured);

      } catch (error) {
        console.error("Failed to fetch services:", error);
        toast({
          title: "Error",
          description: "Could not load featured services.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchServices();
  }, [toast]);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-headline font-semibold text-primary mb-4 flex items-center justify-center">
            <Image src={iconUrl} alt="" width={32} height={32} className="mr-3 h-8 w-8" />
            Our Popular Services
            <Image src={iconUrl} alt="" width={32} height={32} className="ml-3 h-8 w-8" />
          </h2>
          <p className="text-lg text-foreground max-w-2xl mx-auto font-body">
            Indulge in our most sought-after treatments, expertly delivered for stunning results.
          </p>
        </div>
        
        {isLoading ? (
           <div className="flex justify-center items-center h-40">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service) => (
              <Link key={service.id} href={`/book?serviceIds=${service.id}`}>
                <ServiceCard service={service} onSelect={() => {}} isSelected={false} />
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button size="lg" asChild variant="outline">
            <Link href="/services">View All Services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
