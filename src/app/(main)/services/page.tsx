"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import ServiceCard from '@/components/shared/ServiceCard';
import { Loader2, ShoppingCart, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { getAcuityAppointmentTypes, type AcuityAppointmentType } from '@/ai/flows/acuity-booking-flow';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

export default function ServicesPage() {
  const [categorizedServices, setCategorizedServices] = useState<Record<string, AcuityAppointmentType[]>>({});
  const [cart, setCart] = useState<AcuityAppointmentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchAndCategorizeServices() {
      try {
        setIsLoading(true);
        const fetchedServices = (await getAcuityAppointmentTypes()).filter(s => !s.private);

        const categories: Record<string, string[]> = {
            'Face': ['nose', 'lip', 'chin', 'brow', 'eyebrow', 'face', 'sideburn', 'ear', 'facial'],
            'Mid Body': ['back', 'chest', 'stomach', 'underarm', 'arm'],
            'Low Body': ['brazilian', 'bikini', 'leg', 'butt'],
        };

        const grouped: Record<string, AcuityAppointmentType[]> = {
            'Face': [],
            'Mid Body': [],
            'Low Body': [],
            'Other Services': [],
        };
        
        fetchedServices.forEach(service => {
            const name = service.name.toLowerCase();
            let added = false;
            for (const category in categories) {
                if (categories[category as keyof typeof categories].some(kw => name.includes(kw))) {
                    grouped[category].push(service);
                    added = true;
                    break;
                }
            }
            if (!added) {
                grouped['Other Services'].push(service);
            }
        });

        Object.keys(grouped).forEach(key => {
            if (grouped[key].length === 0) {
                delete grouped[key];
            }
        });
        
        setCategorizedServices(grouped);

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
    fetchAndCategorizeServices();
  }, [toast]);
  
  const handleToggleService = (service: AcuityAppointmentType) => {
    const isInCart = cart.some(item => item.id === service.id);

    if (isInCart) {
      toast({
          title: "Service Removed",
          description: `${service.name} has been removed from your booking.`,
      });
      setCart(prevCart => prevCart.filter(item => item.id !== service.id));
    } else {
      toast({
          title: "Service Added!",
          description: `${service.name} has been added to your booking.`,
      });
      setCart(prevCart => [...prevCart, service]);
    }
  };

  const totalCost = useMemo(() => cart.reduce((total, service) => total + parseFloat(service.price), 0), [cart]);
  const totalDuration = useMemo(() => cart.reduce((total, service) => total + service.duration, 0), [cart]);
  const serviceIdsQuery = useMemo(() => cart.map(s => s.id).join(','), [cart]);

  const hasServices = Object.keys(categorizedServices).length > 0 && Object.values(categorizedServices).some(s => s.length > 0);

  return (
    <div className="bg-background py-12 md:py-16 pb-40">
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
          <p className="text-lg font-body text-accent font-bold mt-4 p-2 bg-accent/10 rounded-md inline-block">
            You can select one or multiple services for each booking.
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : hasServices ? (
          <div className="space-y-16">
            {Object.entries(categorizedServices).map(([category, services]) => (
                <div key={category}>
                    <h2 className="text-4xl font-headline text-primary mb-8 text-center">{category}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service) => (
                            <ServiceCard 
                                key={service.id} 
                                service={service}
                                onSelect={() => handleToggleService(service)}
                                isSelected={cart.some(s => s.id === service.id)}
                            />
                        ))}
                    </div>
                </div>
            ))}
          </div>
        ) : (
           <p className="text-center text-muted-foreground font-body text-lg">
            Our service list is currently being updated. Please check back soon or contact us for more information!
          </p>
        )}
      </div>
      
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-secondary border-t border-border shadow-2xl z-50 animate-in slide-in-from-bottom-12 duration-500">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                    <h3 className="text-lg font-bold font-headline text-secondary-foreground flex items-center justify-center sm:justify-start">
                        <ShoppingCart className="mr-3 h-6 w-6" />
                        Booking Summary
                    </h3>
                    <p className="text-sm text-secondary-foreground">
                        {cart.length} service{cart.length > 1 ? 's' : ''} selected &bull; {totalDuration} min &bull; <strong>${totalCost.toFixed(2)}</strong>
                    </p>
                </div>
                <Button asChild size="lg" className="w-full sm:w-auto">
                    <Link href={`/book?serviceIds=${serviceIdsQuery}`}>
                        Proceed to Booking <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </Button>
            </div>
        </div>
      )}
    </div>
  );
}
