"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Importado useRouter
import ServiceCard from '@/components/shared/ServiceCard';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { getAcuityAppointmentTypes, type AcuityAppointmentType } from '@/ai/flows/acuity-booking-flow';
import { useToast } from '@/hooks/use-toast';
// Eliminado Button, ShoppingCart, ArrowRight si no se usan en la nueva versión

export default function ServicesPage() {
  const [categorizedServices, setCategorizedServices] = useState<Record<string, AcuityAppointmentType[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter(); // Inicializado router

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
  
  const handleServiceSelect = (service: AcuityAppointmentType) => {
    // Redirige directamente a la página de reserva con el ID del servicio seleccionado
    toast({
        title: "Starting Booking...",
        description: `You are booking for ${service.name}.`,
    });
    router.push(`/book?serviceIds=${service.id}`);
  };

  const hasServices = Object.keys(categorizedServices).length > 0 && Object.values(categorizedServices).some(s => s.length > 0);

  return (
    <div className="bg-background py-12 md:py-16"> {/* Eliminado padding inferior extra */}
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
            Click on any service to start your booking.
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
                                onSelect={() => handleServiceSelect(service)}
                                isSelected={false} // isSelected ya no es relevante aquí
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
      
      {/* La barra de resumen del carrito ha sido eliminada */}
    </div>
  );
}
