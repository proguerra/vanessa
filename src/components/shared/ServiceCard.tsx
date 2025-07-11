

import Image from 'next/image';
import type { AcuityAppointmentType } from '@/ai/flows/acuity-booking-flow';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, PlusCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  service: AcuityAppointmentType;
  onSelect: () => void;
  isSelected: boolean;
}

export default function ServiceCard({ service, onSelect, isSelected }: ServiceCardProps) {
  // Simple hashing function to create a more 'unique' hint from service name
  const imageHint = service.name.toLowerCase().split(' ').slice(0,2).join(' ') || 'beauty service';

  return (
    <Card 
        className={cn(
            "flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer",
            isSelected && "ring-2 ring-primary shadow-2xl"
        )}
        onClick={onSelect}
    >
      <CardHeader className="p-0">
        <div className="relative w-full h-48 bg-muted"> {/* Añadido un color de fondo por si la imagen no carga o es transparente */}
          <Image
            src={service.image || `https://placehold.co/600x400.png?text=${encodeURIComponent(service.name)}`}
            alt={service.name}
            fill // Reemplaza layout="fill"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Tamaños de ejemplo, ajustar según el grid
            style={{ objectFit: 'cover' }} // Reemplaza objectFit="cover"
            className="transition-transform duration-500 group-hover:scale-105"
            data-ai-hint={imageHint}
            priority={false} // Considerar si alguna de estas imágenes debe ser priority
          />
           {isSelected && (
              <div className="absolute top-2 right-2 bg-primary rounded-full p-1 shadow-lg">
                <CheckCircle className="h-6 w-6 text-primary-foreground" />
              </div>
            )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-6">
        <CardTitle className="text-2xl font-headline text-primary mb-2">{service.name}</CardTitle>
        <p className="text-muted-foreground text-sm mb-3 font-body line-clamp-3">{service.description}</p> {/* Añadido line-clamp para descripciones largas */}
        <div className="flex justify-between items-center text-sm text-foreground">
          <span className="font-semibold text-lg text-accent">${service.price}</span>
          {service.duration && (
            <span className="flex items-center">
              <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
              {service.duration} min
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 mt-auto">
        <Button 
            variant={isSelected ? "secondary" : "default"} 
            className="w-full pointer-events-none"
            aria-pressed={isSelected}
        >
          {isSelected ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Selected
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add to Booking
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
