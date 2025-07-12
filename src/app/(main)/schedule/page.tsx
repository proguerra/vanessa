'use client'; // Necesario para usar hooks como useSearchParams

import Script from 'next/script';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';

// La metadata para esta página se puede manejar en el layout si se necesita,
// ya que la exportación estática no es compatible con 'use client'.

export default function SchedulePage() {
  const searchParams = useSearchParams();
  const acuityOwnerID = '33624155';
  // Leer el parámetro 'appointmentType' de la URL, que es lo que envía AcuityScheduler.tsx
  const appointmentType = searchParams.get('appointmentType');

  // Construir la URL base del iframe
  let iframeSrc = `https://app.acuityscheduling.com/schedule.php?owner=${acuityOwnerID}&ref=embedded_csp`;

  // Si el parámetro existe, añadirlo a la URL del iframe para preseleccionar el servicio
  if (appointmentType) {
    iframeSrc += `&appointmentType=${appointmentType}`;
  }

  return (
    <div className="py-8 md:py-12 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="w-full shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl md:text-4xl font-headline text-primary">Schedule Your Appointment</CardTitle>
            <CardDescription className="text-lg font-body text-muted-foreground mt-2">
              Please use the scheduler below to book your services.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 md:p-2">
            <div className="aspect-w-16 aspect-h-9 md:aspect-none" style={{ minHeight: '800px' }}>
              <iframe 
                src={iframeSrc} 
                title="Schedule Appointment" 
                width="100%" 
                height="800"
                frameBorder="0"
                loading="lazy"
              ></iframe>
            </div>
          </CardContent>
        </Card>
      </div>
      <Script 
        src="https://embed.acuityscheduling.com/js/embed.js" 
        type="text/javascript"
        strategy="lazyOnload"
      />
    </div>
  );
}
